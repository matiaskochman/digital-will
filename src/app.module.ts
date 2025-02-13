import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigitalWill } from './will/entities/digital-will.entity';
import { WillModule } from './will/will.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [DigitalWill],
      synchronize: true,
    }),
    WillModule, // Keep this import
  ],
})
export class AppModule {}
