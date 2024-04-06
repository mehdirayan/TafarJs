import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IOpération } from '../interfaces/operation.interface';

export type DtDocument = HydratedDocument<Dt>;

@Schema()
export class Dt {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  idEquipement: Types.ObjectId;

  @Prop()
  panne: string;

  @Prop()
  test: string;

  @Prop()
  état: string;
  @Prop()
  urgence: boolean;

  @Prop()
  observation: string

  @Prop()
  opérations: IOpération[];
}

export const DtSchema = SchemaFactory.createForClass(Dt);
