import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDigitalWillDto } from './dto/create-digital-will.dto';
import { DigitalWill } from './entities/digital-will.entity';
import * as crypto from 'crypto';

@Injectable()
export class WillService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key = Buffer.from(
    process.env.ENCRYPTION_KEY || 'your-32-byte-secure-key-here',
    'utf8',
  );

  constructor(
    @InjectRepository(DigitalWill)
    private readonly willRepository: Repository<DigitalWill>,
  ) {}

  private encrypt(text: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted, iv: iv.toString('hex') };
  }

  async createWill(createDigitalWillDto: CreateDigitalWillDto) {
    const jsonData = JSON.stringify(createDigitalWillDto);

    const { encryptedData, iv } = this.encrypt(jsonData);

    const will = this.willRepository.create({
      encryptedData,
      iv,
    });

    return this.willRepository.save(will);
  }

  async getWill(id: number) {
    return this.willRepository.findOne({ where: { id } });
  }
}
