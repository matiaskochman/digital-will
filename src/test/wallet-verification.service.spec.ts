/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/test/wallet-verification.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { WalletVerificationService } from '../service/wallet-verification.service.js';
import { ethers } from 'ethers';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AlchemyService } from '../service/alchemy.service.js';

// Definición de funciones mock compartidas
const mockGetBalance = jest.fn();
const mockBalanceOf = jest.fn();

const wallet1 = '0xD4A1E660C916855229e1712090CcfD8a424A2E33';
const nftContract = '0x131a23869322794Ed8cB53b2Be92761e2a5ecbf5';

// Mockeamos `ethers` para evitar llamadas reales a la blockchain
jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers'); // Cargamos el módulo real de ethers
  return {
    ...actual, // Mantenemos todas las funcionalidades originales de ethers
    JsonRpcProvider: jest.fn(() => ({
      getBalance: mockGetBalance, // Reemplazamos getBalance con un mock
    })),
    Contract: jest.fn(() => ({
      balanceOf: mockBalanceOf, // Reemplazamos balanceOf con un mock
    })),
  };
});

describe('WalletVerificationService', () => {
  let service: WalletVerificationService;
  let mockAlchemyService: Partial<AlchemyService>;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Creamos un mock para AlchemyService
    mockAlchemyService = {
      hasAtLeastOneToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletVerificationService,
        { provide: AlchemyService, useValue: mockAlchemyService },
      ],
    }).compile();

    service = module.get<WalletVerificationService>(WalletVerificationService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fail with zero ETH balance and zero tokens', async () => {
    // Simulamos un balance en ETH de 0
    mockGetBalance.mockResolvedValue(0n);
    // Simulamos que la wallet no posee ningún token según Alchemy
    (mockAlchemyService.hasAtLeastOneToken as jest.Mock).mockResolvedValue(
      false,
    );

    await expect(service.verifyWallet(wallet1, nftContract)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should fail missing NFT', async () => {
    // Simulamos que la wallet tiene ETH
    mockGetBalance.mockResolvedValue(ethers.parseEther('1'));
    // Simulamos que Alchemy indica que posee tokens (para evitar la validación previa)
    (mockAlchemyService.hasAtLeastOneToken as jest.Mock).mockResolvedValue(
      true,
    );
    // Simulamos que la wallet no posee el NFT requerido
    mockBalanceOf.mockResolvedValue(0n);

    await expect(service.verifyWallet(wallet1, nftContract)).rejects.toThrow(
      BadRequestException,
    );
  });
});
