import { validate } from 'class-validator';
import { WalletAddressDto } from '../dto/wallet-address.dto.js';

describe('WalletAddressDto Validation', () => {
  it('should validate valid wallet and NFT contract addresses', async () => {
    const dto = new WalletAddressDto();
    dto.walletAddress = '0x1234567890abcdef1234567890abcdef12345678'; // 0x + 40 dígitos hexadecimales
    dto.nftContractAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
    dto.signedMessage =
      '0xf5c437fc5327699d8faf613f48d8447cb124792ea1a13377e6616748102db0f8528c658c7321e6e3c33c472511946ff24b8e830a4eec78bdc68501d1e6c3178a1b';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if walletAddress is invalid', async () => {
    const dto = new WalletAddressDto();
    // Falta el prefijo "0x"
    dto.walletAddress = '1234567890abcdef1234567890abcdef12345678';
    dto.nftContractAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
    dto.signedMessage =
      '0xf5c437fc5327699d8faf613f48d8447cb124792ea1a13377e6616748102db0f8528c658c7321e6e3c33c472511946ff24b8e830a4eec78bdc68501d1e6c3178a1b';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const walletAddressError = errors.find(
      (err) => err.property === 'walletAddress',
    );
    expect(walletAddressError).toBeDefined();
  });

  it('should fail if nftContractAddress is invalid', async () => {
    const dto = new WalletAddressDto();
    dto.walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
    // Formato inválido: contiene caracteres no hexadecimales o longitud incorrecta
    dto.nftContractAddress = '0xINVALIDADDRESS1234567890';
    dto.signedMessage =
      '0xf5c437fc5327699d8faf613f48d8447cb124792ea1a13377e6616748102db0f8528c658c7321e6e3c33c472511946ff24b8e830a4eec78bdc68501d1e6c3178a1b';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const nftError = errors.find(
      (err) => err.property === 'nftContractAddress',
    );
    expect(nftError).toBeDefined();
  });

  it('should fail if signedMessage is invalid', async () => {
    const dto = new WalletAddressDto();
    dto.walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
    dto.nftContractAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
    // Formato inválido: contiene caracteres no hexadecimales o longitud incorrecta
    dto.signedMessage =
      '0xf5c437fc5327699d8af613f48d8447cb124792ea1a13377e6616748102db0f8528c658c7321e6e3c33c472511946ff24b8e8---invalid';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const nftError = errors.find((err) => err.property === 'signedMessage');
    expect(nftError).toBeDefined();
  });
});
