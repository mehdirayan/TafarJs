import { IsNotEmpty } from 'class-validator';

export class CreateUsersDto {
  @IsNotEmpty()
  nom: string;
}
