import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigitalWill } from './entities/digital-will.entity';
import { WillController } from './will.controller';
import { WillService } from './will.service';

@Module({
  imports: [TypeOrmModule.forFeature([DigitalWill])], // Add this line
  controllers: [WillController],
  providers: [WillService],
})
export class WillModule {}
