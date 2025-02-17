import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DigitalWill } from '../entities/digital-will.entity.js';

@Injectable()
export class WillService {
  constructor(
    @InjectRepository(DigitalWill)
    private readonly willRepository: Repository<DigitalWill>,
  ) {}

  /**
   * Creates new will record
   * @param ownerWalletAddress - Owner's wallet address
   * @param cid - Content identifier
   * @param nftContractAddress - Associated NFT contract
   * @returns Created will entity
   */
  async createWill(
    ownerWalletAddress: string,
    cid: string,
    nftContractAddress: string, // Nuevo parámetro
  ) {
    const will = this.willRepository.create({
      ownerWalletAddress,
      cid,
      nftContractAddress, // Guardar en la entidad
    });
    return this.willRepository.save(will);
  }

  async getWillByCid(cid: string): Promise<DigitalWill | null> {
    return this.willRepository.findOneBy({ cid });
  }

  async getWillsByOwner(address: string): Promise<DigitalWill[]> {
    return this.willRepository.find({ where: { ownerWalletAddress: address } });
  }
  /**
   * Verifies ownership of will document
   * @param cid - Content identifier
   * @param walletAddress - Claimant's address
   * @returns Will entity if verified
   * @throws NotFoundException for invalid claims
   */
  async verifyOwnership(
    cid: string,
    walletAddress: string,
  ): Promise<DigitalWill> {
    const will = await this.willRepository.findOneBy({
      cid,
      ownerWalletAddress: walletAddress,
    });
    if (!will)
      throw new NotFoundException('Testamento no encontrado o acceso denegado');
    return will; // Retornar la entidad completa
  }
}
