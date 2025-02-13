import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class GetWillParamsDto {
  @IsString()
  @IsNotEmpty({ message: 'El parámetro "cid" no debe estar vacío' })
  cid!: string;
}

export class GetWillQueryDto {
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'walletAddress debe ser una dirección Ethereum válida',
  })
  walletAddress!: string;

  @IsString()
  @Matches(/^0x[a-fA-F0-9]{130}$/, {
    message: 'signedMessage debe ser una firma Ethereum válida',
  })
  signedMessage!: string;
}
