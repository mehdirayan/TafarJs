import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { IOpération } from '../interfaces/operation.interface';

export class CreateDtDto {
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  idEquipement: Types.ObjectId;

  panne: string;

  @IsNotEmpty()
  test: string;

  @IsNotEmpty()
  état: string;

  @IsNotEmpty()
  urgence: boolean;

  
  observation:string

  opérations: IOpération[];
}
