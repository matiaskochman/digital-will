import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigitalWill } from '../entities/digital-will.entity.js';
import { WillController } from '../controller/will.controller.js';
import { WillService } from '../service/will.service.js';
import { AlchemyService } from '../service/alchemy.service.js';
import { LighthouseService } from '../service/lighthouse.service.js';
import { WalletVerificationService } from '../service/wallet-verification.service.js';
import { WalletSignerController } from '../controller/walletSigner.controller.js';
@Module({
  imports: [TypeOrmModule.forFeature([DigitalWill]), ConfigModule],
  controllers: [WillController, WalletSignerController],
  providers: [
    WillService,
    LighthouseService,
    WalletVerificationService,
    AlchemyService,
  ],
})
export class WillModule {}
