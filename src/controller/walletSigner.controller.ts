/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as ethers from 'ethers';
import * as kavach from '@lighthouse-web3/kavach';
import {
  Controller,
  Post,
  Body,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { IsString, Matches, validate } from 'class-validator';

class AuthCredentialsDto {
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'Invalid Ethereum wallet address format',
  })
  walletAddress!: string;

  @IsString()
  @Matches(/^[0-9a-fA-F]{64}$/, {
    message: 'Invalid private key format (64 hex characters expected)',
  })
  privateKey!: string;
}

@Controller('wallet')
export class WalletSignerController {
  @Post('sign-message')
  async signAuthMessage(
    @Body() credentials: AuthCredentialsDto,
  ): Promise<{ signedMessage: string }> {
    try {
      // Validación automática del DTO
      const errors = await validate(credentials);
      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }

      // Verificar que la private key corresponde a la wallet
      const signer = new ethers.Wallet(credentials.privateKey);
      if (
        signer.address.toLowerCase() !== credentials.walletAddress.toLowerCase()
      ) {
        throw new BadRequestException(
          'Private key does not match wallet address',
        );
      }

      const authMessage = await kavach.getAuthMessage(signer.address);

      if (!authMessage?.message) {
        throw new Error('Invalid authentication message response');
      }

      const signedMessage = await signer.signMessage(authMessage.message);

      return { signedMessage };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(
        `Error signing message: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
