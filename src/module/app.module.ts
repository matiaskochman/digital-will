import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigitalWill } from '../entities/digital-will.entity.js';
import { WillModule } from './will.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => ({
        ...config,
        LIGHTHOUSE_API_KEY: config.LIGHTHOUSE_API_KEY || '',
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [DigitalWill],
        synchronize: true,
        logging: false,
        extra: {
          connectionLimit: config.get<number>('DB_CONNECTION_LIMIT', 10),
          ssl: {
            rejectUnauthorized: config.get<boolean>(
              'DB_SSL_REJECT_UNAUTHORIZED',
              false,
            ),
          },
        },
      }),
    }),
    WillModule,
  ],
})
export class AppModule {}
