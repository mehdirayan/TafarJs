import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Equipement } from './schema/equipement.schema';
import { Model, Types } from 'mongoose';
import { CreateEquipementDto } from './dto/équipement.dto';

@Injectable()
export class EquipementService {
  constructor(
    @InjectModel(Equipement.name) private EquipementModel: Model<Equipement>,
  ) {}

  async findAll(): Promise<Equipement[]> {
    const Equipements = await this.EquipementModel.find();
    return Equipements;
  }

  async findOne(id: Types.ObjectId): Promise<Equipement> {
    return await this.EquipementModel.findById(id);
  }

  async addEquipement(EquipementDto: CreateEquipementDto): Promise<Equipement> {
    const createdEquipement = new this.EquipementModel(EquipementDto);
    return createdEquipement.save();
  }

  async updateOne(
    id: Types.ObjectId,
    EquipementDto: CreateEquipementDto,
  ): Promise<Equipement> {
    return await this.EquipementModel.findByIdAndUpdate(id, EquipementDto);
  }

  async deleteOne(id: Types.ObjectId): Promise<Equipement> {
    return await this.EquipementModel.findByIdAndDelete(id);
  }
}
