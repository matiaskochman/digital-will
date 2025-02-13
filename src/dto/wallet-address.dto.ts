import { IsString, Matches } from 'class-validator';

export class WalletAddressDto {
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'walletAddress must be a valid Ethereum address',
  })
  walletAddress!: string;

  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'nftContractAddress must be a valid Ethereum address',
  })
  nftContractAddress!: string;

  @IsString()
  @Matches(/^0x[a-fA-F0-9]{130}$/, {
    message: 'signedMessage must be a valid Ethereum signature',
  })
  signedMessage!: string;
}
