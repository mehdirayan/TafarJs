import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Activité } from './schemas/activité.schemas';
import { CreateActiviteDto } from './dto/createActivité.dto';

@Injectable()
export class ActivitéService {
  constructor(
    @InjectModel(Activité.name) private activitéModel: Model<Activité>,
  ) {}

  async findAll(): Promise<Activité[]> {
    const activité = await this.activitéModel.find();
    return activité;
  }

  async findOne(id: Types.ObjectId): Promise<Activité> {
    return await this.activitéModel.findById(id);
  }

  async addActivité(activitéDto: CreateActiviteDto): Promise<Activité> {
    const createdActivité = new this.activitéModel(activitéDto);
    return createdActivité.save();
  }

  async updateOne(
    id: Types.ObjectId,
    activitéDto: CreateActiviteDto,
  ): Promise<Activité> {
    return await this.activitéModel.findByIdAndUpdate(id, activitéDto);
  }

  async deleteOne(id: Types.ObjectId): Promise<Activité> {
    return await this.activitéModel.findByIdAndDelete(id);
  }
}
