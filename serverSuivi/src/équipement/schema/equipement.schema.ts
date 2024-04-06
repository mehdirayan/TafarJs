import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EquipementDocument = HydratedDocument<Equipement>;

@Schema()
export class Equipement {
  @Prop({ required: true })
  désignation: string;

  @Prop()
  marque: string;

  @Prop()
  modele: string;

  @Prop({ required: true, unique:true })
  numSerie: string;

  @Prop({ required: true })
  idClient: string;
}

export const EquipementSchema = SchemaFactory.createForClass(Equipement);
