import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { ActivitéService } from './activité.service';
import { Activité } from './schemas/activité.schemas';
import { CreateActiviteDto } from './dto/createActivité.dto';
import { Types } from 'mongoose';

@Controller('activites')
export class ActivitéController {
  constructor(private activitéService: ActivitéService) {}

  @Get()
  async findAll(): Promise<Activité[]> {
    return await this.activitéService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: Types.ObjectId): Promise<Activité> {
    return await this.activitéService.findOne(id);
  }

  @Post()
  async addActivité(@Body() activitéDto: CreateActiviteDto): Promise<Activité> {
    console.log(activitéDto);
    return await this.activitéService.addActivité(activitéDto);
  }

  @Put(':id')
  async updateOne(
    @Param('id') id: Types.ObjectId,
    @Body() activitéDto: CreateActiviteDto,
  ): Promise<Activité> {
    return await this.activitéService.updateOne(id, activitéDto);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: Types.ObjectId): Promise<Activité> {
    return await this.activitéService.deleteOne(id);
  }
}
