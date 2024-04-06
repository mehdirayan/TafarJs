import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { DtService } from './dt.service';
import { Dt } from './schema/dt.schema';
import { Types } from 'mongoose';
import { CreateDtDto } from './dto/dt.dto';

@Controller('dts')
export class DtController {
  constructor(private dtService: DtService) {}

  @Get()
  findAll(): Promise<Dt[]> {
    return this.dtService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId): Promise<Dt> {
    return this.dtService.findOne(id);
  }

  @Post()
  create(@Body() createDtDto: CreateDtDto): Promise<Dt> {
    return this.dtService.create(createDtDto);
  }

  @Put(':id')
  update(
    @Param('id') id: Types.ObjectId,
    @Body() createDtDto: CreateDtDto,
  ): Promise<Dt> {
    return this.dtService.update(id, createDtDto);
  }

  @Delete(':id')
  delete(@Param('id') id: Types.ObjectId): Promise<Dt> {
    return this.dtService.delete(id);
  }
 
}
