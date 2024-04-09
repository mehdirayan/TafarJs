import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Livraison } from './schema/livraison.schema';
import { Model, Types } from 'mongoose';
import { CreateLivraisonDto } from './dto/livraison.dto';
import { DtService } from 'src/dt/dt.service';
import { eEtat } from 'src/dt/interfaces/type';

@Injectable()
export class LivraisonService {
  constructor(
    @InjectModel(Livraison.name) private LivraisonModel: Model<Livraison>,
    private dtService: DtService

  ) { }

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

    if (createLivraisonDto.dts.length > 0) {

      const livraisonEnBase: Livraison = await this.LivraisonModel.findById(id)

      //------------------------ ajout ligne dt -----------------
      if (createLivraisonDto.dts.length > livraisonEnBase.dts.length) {

        createLivraisonDto.dts.forEach(ele => {
          ele.état = eEtat.livré
          this.dtService.updateEtatDt(ele._id,eEtat.livré)
        })

      }


    }


    return await this.LivraisonModel.findByIdAndUpdate(id, createLivraisonDto);
  }

  async delete(id: string): Promise<Livraison> {
    return await this.LivraisonModel.findByIdAndDelete(id);
  }



}
