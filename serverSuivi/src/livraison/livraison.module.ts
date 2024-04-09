import { Module } from '@nestjs/common';
import { LivraisonController } from './livraison.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Livraison, LivraisonSchema } from './schema/livraison.schema';
import { LivraisonService } from './livraison.service';
import { DtService } from 'src/dt/dt.service';
import {Dt, DtSchema } from 'src/dt/schema/dt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Livraison.name, schema: LivraisonSchema },
      {name:Dt.name,schema:DtSchema}
    ]),
  ],
  providers: [LivraisonService,DtService],
  controllers: [LivraisonController],
})
export class LivraisonModule {}
