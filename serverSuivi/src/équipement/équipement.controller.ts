import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { EquipementService } from './équipement.service';
import { Equipement } from './schema/equipement.schema';
import { Types } from 'mongoose';
import { CreateEquipementDto } from './dto/équipement.dto';

@Controller('equipements')
export class EquipementController {
  constructor(private equipementService: EquipementService) {}

  @Get()
  async findAll(): Promise<Equipement[]> {
    const Equipements = await this.equipementService.findAll();
    return Equipements;
  }

  @Get(':id')
  async findOne(@Param('id') id: Types.ObjectId): Promise<Equipement> {
    return await this.equipementService.findOne(id);
  }

  @Post()
  async addEquipement(
    @Body() EquipementDto: CreateEquipementDto,
  ): Promise<Equipement> {
    const createdEquipement =
      this.equipementService.addEquipement(EquipementDto);
    return createdEquipement;
  }

  @Put(':id')
  async updateOne(
    @Param('id') id: Types.ObjectId,
    @Body() EquipementDto: CreateEquipementDto,
  ): Promise<Equipement> {
    return await this.equipementService.updateOne(id, EquipementDto);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: Types.ObjectId): Promise<Equipement> {
    return await this.equipementService.deleteOne(id);
  }
}
