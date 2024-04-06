import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Dt } from './schema/dt.schema';
import { CreateDtDto } from './dto/dt.dto';

@Injectable()
export class DtService {
  constructor(@InjectModel(Dt.name) private DtModel: Model<Dt>) {}

  async findAll(): Promise<Dt[]> {
    const dt = await this.DtModel.find();
    return dt;
  }

  async create(createDtDto: CreateDtDto): Promise<Dt> {
    const createdDt = new this.DtModel(createDtDto);
    return createdDt.save();
  }

  async findOne(id: Types.ObjectId): Promise<Dt> {
    const dt = await this.DtModel.findById(id);
    return dt;
  }

  async delete(id: Types.ObjectId): Promise<Dt> {
    const deletedDt = await this.DtModel.findByIdAndDelete(id);
    return deletedDt;
  }

  async update(id: Types.ObjectId, createDtDto: CreateDtDto): Promise<Dt> {
    const updatedDt = await this.DtModel.findByIdAndUpdate(id, createDtDto, {
      new: true,
    });
    return updatedDt;
  }

 
}
