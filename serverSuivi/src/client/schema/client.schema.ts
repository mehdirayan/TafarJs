import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IContacts } from '../interfaces/contacts.interface';

export type ClientDocument = HydratedDocument<Client>;

@Schema()
export class Client {
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  activité: string;

  @Prop()
  adresse: string;

  @Prop()
  rc: string;

  @Prop()
  ai: string;

  @Prop()
  nif: string;

  @Prop()
  nis: string;

  @Prop()
  contacts: IContacts[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);
