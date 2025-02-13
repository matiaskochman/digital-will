import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DigitalWill {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: true })
  ownerWalletAddress!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cid!: string;

  @Column({ type: 'varchar', nullable: true })
  nftContractAddress!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
