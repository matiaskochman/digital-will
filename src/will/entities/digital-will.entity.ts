import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DigitalWill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  encryptedData: string;

  @Column('varchar')
  iv: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
