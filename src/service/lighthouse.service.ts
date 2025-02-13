/* eslint-disable @typescript-eslint/only-throw-error */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as lighthouse from '@lighthouse-web3/sdk';

@Injectable()
export class LighthouseService {
  constructor(private configService: ConfigService) {}

  async uploadEncryptedFile(
    filePath: string,
    wallet: string,
    signedMessage: string,
  ): Promise<{ cid: string }> {
    console.log(`📂 Subiendo archivo encriptado: ${filePath}`);

    const apiKey = this.configService.get<string>('LIGHTHOUSE_API_KEY');
    if (!apiKey) {
      throw new Error('LIGHTHOUSE_API_KEY no está definida');
    }

    try {
      const response = await lighthouse.uploadEncrypted(
        filePath,
        apiKey,
        wallet,
        signedMessage,
      );

      if (!response.data || !response.data[0]?.Hash) {
        throw new Error('Error en la respuesta de Lighthouse');
      }

      console.log(`✅ Archivo subido con éxito. CID: ${response.data[0].Hash}`);
      return { cid: response.data[0].Hash };
    } catch (error) {
      throw new Error(`Error subiendo archivo: ${error}`);
    }
  }

  async downloadEncryptedFile(
    cid: string,
    walletAddress: string,
    signedMessage: string,
  ): Promise<string> {
    try {
      const encryptionKey = await lighthouse.fetchEncryptionKey(
        cid,
        walletAddress,
        signedMessage,
      );

      if (!encryptionKey.data.key) {
        throw new Error('No se pudo obtener la clave de encriptación');
      }

      const decryptedData = await lighthouse.decryptFile(
        cid,
        encryptionKey.data.key,
      );
      return Buffer.from(decryptedData).toString();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error.message;
      }
      throw new BadRequestException(error);
      // console.error('Error desencriptando archivo:', error);
      // throw new BadRequestException('Error al desencriptar el testamento');
    }
  }
}
