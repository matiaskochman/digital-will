/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { LighthouseService } from '../service/lighthouse.service.js';
import { ConfigService } from '@nestjs/config';
import * as lighthouse from '@lighthouse-web3/sdk';
import { BadRequestException } from '@nestjs/common';

// Mock entire lighthouse SDK to control its behavior in tests
jest.mock('@lighthouse-web3/sdk', () => ({
  uploadEncrypted: jest.fn(),
  fetchEncryptionKey: jest.fn(),
  decryptFile: jest.fn(),
}));

describe('LighthouseService', () => {
  let service: LighthouseService;
  let configService: ConfigService;

  // Setup testing module before each test
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LighthouseService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              // Mock environment variable retrieval
              if (key === 'LIGHTHOUSE_API_KEY') return 'test-api-key';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<LighthouseService>(LighthouseService);
    configService = module.get<ConfigService>(ConfigService);
  });

  // Clear all mocks after each test to prevent state leakage
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('downloadEncryptedFile', () => {
    it('should successfully decrypt file when valid inputs are provided', async () => {
      // Mock data setup
      const mockCid = 'QmTestCID';
      const mockWallet = '0xWallet';
      const mockSignature = 'signedMsg';
      const mockKey = 'mockEncryptionKey';
      const mockContent = Buffer.from('decrypted-content');

      // Configure lighthouse mock responses
      (lighthouse.fetchEncryptionKey as jest.Mock).mockResolvedValue({
        data: { key: mockKey },
      });
      (lighthouse.decryptFile as jest.Mock).mockResolvedValue(mockContent);

      // Execute test
      const result = await service.downloadEncryptedFile(
        mockCid,
        mockWallet,
        mockSignature,
      );

      // Verify lighthouse SDK interactions
      expect(lighthouse.fetchEncryptionKey).toHaveBeenCalledWith(
        mockCid,
        mockWallet,
        mockSignature,
      );
      expect(lighthouse.decryptFile).toHaveBeenCalledWith(mockCid, mockKey);

      // Validate output conversion
      expect(result).toEqual(mockContent.toString());
    });

    it('should throw error when encryption key is not present in response', async () => {
      // Simulate missing key response
      (lighthouse.fetchEncryptionKey as jest.Mock).mockResolvedValue({
        data: {},
      });

      // Verify proper error propagation
      await expect(
        service.downloadEncryptedFile('cid', 'wallet', 'signature'),
      ).rejects.toThrow('No se pudo obtener la clave de encriptación');
    });

    it('should handle decryption failure gracefully', async () => {
      // Setup valid key response but failed decryption
      (lighthouse.fetchEncryptionKey as jest.Mock).mockResolvedValue({
        data: { key: 'validKey' },
      });
      (lighthouse.decryptFile as jest.Mock).mockRejectedValue(
        new Error('Decryption failed'),
      );

      // Verify exception wrapping
      await expect(
        service.downloadEncryptedFile('cid', 'wallet', 'signature'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // TODO: Add tests for uploadEncryptedFile functionality
  // describe('uploadEncryptedFile', () => {
  //   Test cases for file upload scenarios
  // });
});
