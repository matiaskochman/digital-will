import { NestFactory } from '@nestjs/core';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { AppModule } from './module/app.module.js';
import { AllExceptionsFilter } from './filters/all-exceptions.filter.js';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.use(
    rateLimit({
      windowMs: 1 * 1000,
      max: 10,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 4000, '0.0.0.0'); // <-- Añadir esta línea
}
bootstrap();
