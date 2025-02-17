/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AlchemyService {
  private readonly alchemyRpcUrl: string | undefined;

  constructor() {
    this.alchemyRpcUrl = process.env.ALCHEMY_ETHEREUM_SEPOLIA_URL;
  }

  /**
   * Obtiene el balance de tokens usando Axios para hacer una petición RPC a Alchemy.
   */
  async getTokenBalanceRPC(
    ownerAddr: string,
    contractType: 'erc20' | 'erc721' = 'erc20',
  ) {
    try {
      const body = {
        id: 1,
        jsonrpc: '2.0',
        method: 'alchemy_getTokenBalances',
        params: [ownerAddr, contractType],
      };
      if (this.alchemyRpcUrl === undefined) {
        throw new Error('Alchemy RPC URL is not defined');
      }

      const { data } = await axios.post(this.alchemyRpcUrl, body, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return data;
    } catch (error) {
      console.error('Error fetching token balances via RPC:', error);
      throw new Error('Failed to fetch token balances via RPC');
    }
  }

  /**
   * Checks for token ownership via Alchemy RPC
   * @param ownerAddr - Wallet address to check
   * @param contractType - Token type (ERC20/ERC721)
   * @returns Boolean indicating token ownership
   * @throws Error for RPC failures
   */
  async hasAtLeastOneToken(
    ownerAddr: string,
    contractType: 'erc20' | 'erc721' = 'erc20',
  ): Promise<boolean> {
    try {
      const response = await this.getTokenBalanceRPC(ownerAddr, contractType);

      if (!response?.result?.tokenBalances) {
        return false;
      }

      return response.result.tokenBalances.some(
        (token: { tokenBalance: string | number | bigint | boolean }) =>
          BigInt(token.tokenBalance) > BigInt(0),
      );
    } catch (error) {
      console.error('Error checking wallet token balances:', error);
      throw new Error('Failed to check wallet token balances');
    }
  }
}
