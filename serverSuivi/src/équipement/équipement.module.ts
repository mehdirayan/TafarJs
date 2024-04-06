import { Module } from '@nestjs/common';
import { EquipementService } from './équipement.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Equipement, EquipementSchema } from './schema/equipement.schema';
import { EquipementController } from './équipement.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Equipement.name, schema: EquipementSchema },
    ]),
  ],
  providers: [EquipementService],
  controllers: [EquipementController],
})
export class ÉquipementModule {}
