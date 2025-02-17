/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Query,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as fs from 'fs/promises';
import { WillService } from '../service/will.service.js';
import { LighthouseService } from '../service/lighthouse.service.js';
import { WalletVerificationService } from '../service/wallet-verification.service.js';

import { Express } from 'express';
import { WalletAddressDto } from '../dto/wallet-address.dto.js';
import { GetWillParamsDto, GetWillQueryDto } from '../dto/get-will.dto.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Controller('will')
export class WillController {
  constructor(
    private readonly lighthouseService: LighthouseService,
    private readonly willService: WillService,
    private readonly walletVerificationService: WalletVerificationService,
  ) {}

  /**
   * Handles encrypted will file upload and storage verification
   * @param file - Uploaded will document
   * @param walletData - Wallet verification data
   * @returns CID of uploaded file
   * @throws BadRequestException for verification or upload failures
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    // Se aplica el ValidationPipe para transformar y validar el DTO
    @Body(new ValidationPipe({ transform: true })) walletData: WalletAddressDto,
  ) {
    const { walletAddress, nftContractAddress, signedMessage } = walletData;
    const tempDir = join(__dirname, '..', '..', 'tmp');
    await fs.mkdir(tempDir, { recursive: true });
    const filePath = join(tempDir, file.originalname);
    await fs.writeFile(filePath, file.buffer as Buffer);
    try {
      await this.walletVerificationService.verifyWallet(
        walletAddress,
        nftContractAddress,
      );
      // Si pasa la verificación, continuar con el flujo
      const result = await this.lighthouseService.uploadEncryptedFile(
        filePath,
        walletAddress,
        signedMessage,
      );
      await this.willService.createWill(
        walletAddress,
        result.cid,
        nftContractAddress,
      );
      return { cid: result.cid };
    } catch (error: unknown) {
      // Capturamos la excepción y la relanzamos con contexto adicional
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      if (error instanceof BadRequestException) {
        throw new BadRequestException(`Verificación fallida: ${errorMessage}`);
      }

      throw new BadRequestException(`Error uploading file: ${errorMessage}`);
    } finally {
      await fs.unlink(filePath).catch(() => {});
    }
  }

  /**
   * Retrieves and decrypts a will document
   * @param cid - Content identifier of the will
   * @param walletAddress - Requestor's wallet address
   * @param signedMessage - Valid message signature
   * @returns Decrypted will content
   * @throws BadRequestException for ownership issues or decryption failures
   */
  @Get(':cid')
  async getWill(
    @Param(new ValidationPipe({ transform: true })) params: GetWillParamsDto,
    @Query(new ValidationPipe({ transform: true })) query: GetWillQueryDto,
  ) {
    const { cid } = params;
    const { walletAddress, signedMessage } = query;

    // Validamos la existencia del testamento y la propiedad del wallet
    const will = await this.willService.verifyOwnership(cid, walletAddress);
    if (!will) {
      throw new BadRequestException(
        'Testamento no encontrado o acceso denegado',
      );
    }

    const decryptedContent = await this.lighthouseService.downloadEncryptedFile(
      will.cid,
      walletAddress,
      signedMessage,
    );
    return { content: JSON.stringify(JSON.parse(decryptedContent)) };
  }
}
