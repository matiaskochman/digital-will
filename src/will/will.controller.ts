import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateDigitalWillDto } from './dto/create-digital-will.dto';
import { WillService } from './will.service';

@Controller('will')
export class WillController {
  constructor(private readonly willService: WillService) {}

  @Post()
  create(@Body() createDigitalWillDto: CreateDigitalWillDto) {
    return this.willService.createWill(createDigitalWillDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.willService.getWill(+id);
  }
}
