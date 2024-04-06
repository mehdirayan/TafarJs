import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Dt } from 'src/dt/schema/dt.schema';

export type LivraisonDocument = HydratedDocument<Livraison>;

@Schema()
export class Livraison {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  client: string;

  @Prop({ required: true })
  dts: Dt[];

  @Prop()
  lien: string;
}

export const LivraisonSchema = SchemaFactory.createForClass(Livraison);
