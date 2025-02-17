/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { AlchemyService } from '../service/alchemy.service.js';

dotenv.config();

const ERC721_ABI = ['function balanceOf(address owner) view returns (uint256)'];

@Injectable()
export class WalletVerificationService {
  constructor(private readonly alchemyService: AlchemyService) {}

  private readonly logger = new Logger(WalletVerificationService.name);
  private provider = new ethers.JsonRpcProvider(
    process.env.ALCHEMY_ETHEREUM_SEPOLIA_URL,
  );

  /**
   * Checks for positive ETH balance
   * @param walletAddress - Address to check
   * @returns Boolean balance status
   * @throws InternalServerErrorException for RPC failures
   */
  async hasPositiveETHBalance(walletAddress: string): Promise<boolean> {
    try {
      const balance: bigint = await this.provider.getBalance(walletAddress);
      if (balance > 0n) return true;
      this.logger.warn(`Wallet ${walletAddress} no tiene balance positivo.`);
      return false;
    } catch (error) {
      this.logger.error(
        `Error obteniendo balance para wallet ${walletAddress}: ${error}`,
        error instanceof Error ? error.stack : '',
      );
      throw new InternalServerErrorException(
        `Error obteniendo balance de la wallet ${walletAddress}.`,
      );
    }
  }

  /**
   * Verifies wallet meets access requirements
   * @param walletAddress - Ethereum address to verify
   * @param nftContractAddress - NFT contract address
   * @returns Boolean verification result
   * @throws BadRequestException for failed verifications
   */
  async verifyWallet(
    walletAddress: string,
    nftContractAddress: string,
  ): Promise<boolean> {
    const hasBalance = await this.hasPositiveETHBalance(walletAddress);
    const hasAtLeastOneToken =
      await this.alchemyService.hasAtLeastOneToken(walletAddress);

    if (!hasBalance && !hasAtLeastOneToken) {
      throw new BadRequestException(
        `Wallet ${walletAddress} no tiene balance ETH positivo ni tokens.`,
      );
    }

    const nftContract = new ethers.Contract(
      nftContractAddress,
      ERC721_ABI,
      this.provider,
    );
    const nftBalance: bigint = await nftContract.balanceOf(walletAddress);

    if (nftBalance <= 0n) {
      throw new BadRequestException(
        `Wallet ${walletAddress} no posee el NFT requerido.`,
      );
    }

    return true;
  }
}
