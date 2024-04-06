import { Module } from '@nestjs/common';
import { LivraisonController } from './livraison.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Livraison, LivraisonSchema } from './schema/livraison.schema';
import { LivraisonService } from './livraison.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Livraison.name, schema: LivraisonSchema },
    ]),
  ],
  providers: [LivraisonService],
  controllers: [LivraisonController],
})
export class LivraisonModule {}
