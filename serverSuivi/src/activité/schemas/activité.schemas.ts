import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ActivitéDocument = HydratedDocument<Activité>;

@Schema()
export class Activité {
  @Prop({ required: true })
  désignation: string;
}

export const ActivitéSchema = SchemaFactory.createForClass(Activité);
