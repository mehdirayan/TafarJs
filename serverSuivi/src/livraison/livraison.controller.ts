import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { LivraisonService } from './livraison.service';
import { Livraison } from './schema/livraison.schema';
import { CreateLivraisonDto } from './dto/livraison.dto';
import { Types } from 'mongoose';

@Controller('livraisons')
export class LivraisonController {
  constructor(private livraisonService: LivraisonService) {}

  @Get()
  findAll(): Promise<Livraison[]> {
    return this.livraisonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Livraison> {
    return this.livraisonService.findOne(id);
  }

  
  @Put(':id')
  async updateOne(
    @Param('id') id: Types.ObjectId,
    @Body() createLivraisonDto: CreateLivraisonDto,
  ): Promise<Livraison> {
    return await this.livraisonService.updateOne(id, createLivraisonDto);
  }


  @Post()
  create(@Body() createLivraisonDto: CreateLivraisonDto): Promise<Livraison> { 
    return this.livraisonService.create(createLivraisonDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Livraison> {
    return this.livraisonService.delete(id);
  }
}
