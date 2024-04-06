import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateEquipementDto {
  @IsNotEmpty()
  désignation: string;

  marque: string;

  modele: string;

  numSerie: string;

  @IsNotEmpty()
  idClient: Types.ObjectId;
}
