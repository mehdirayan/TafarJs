import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Livraison } from './schema/livraison.schema';
import { Model, Types } from 'mongoose';
import { CreateLivraisonDto } from './dto/livraison.dto';

@Injectable()
export class LivraisonService {
  constructor(
    @InjectModel(Livraison.name) private LivraisonModel: Model<Livraison>,
  ) {}

  async findAll(): Promise<Livraison[]> {
    const livraisons = await this.LivraisonModel.find();
    return livraisons;
  }

  async findOne(id: string): Promise<Livraison> {
    return await this.LivraisonModel.findById(id);
  }

  async create(createLivraisonDto: any): Promise<Livraison> {
    const createdLivraison = new this.LivraisonModel(createLivraisonDto);
    return createdLivraison.save();
  }

  async updateOne(
    id: Types.ObjectId,
    createLivraisonDto: CreateLivraisonDto,
  ): Promise<Livraison> {
    return await this.LivraisonModel.findByIdAndUpdate(id, createLivraisonDto);
  }

  async delete(id: string): Promise<Livraison> {
    return await this.LivraisonModel.findByIdAndDelete(id);
  }
}
