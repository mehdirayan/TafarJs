import { IsNotEmpty } from 'class-validator';
import { IContacts } from '../interfaces/contacts.interface';

export class CreateClientDto {
  @IsNotEmpty()
  nom: string;

  activité: string;

  adresse: string;

  rc: string;

  ai: string;

  nif: string;

  nis: string;

  contacts: IContacts[];
}
