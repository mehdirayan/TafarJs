import { IsNotEmpty,IsUrl, ValidateIf } from 'class-validator';
import { Dt } from 'src/dt/schema/dt.schema';

export class CreateLivraisonDto {
  @IsNotEmpty()
  date: Date;
  @IsNotEmpty()
  client: string;
  dts: Dt[];
  @ValidateIf(o => o.lien !== "")
  @IsNotEmpty()
  @IsUrl()
  lien:string
}
