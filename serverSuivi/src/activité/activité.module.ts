import { Module } from '@nestjs/common';
import { ActivitéController } from './activité.controller';
import { ActivitéService } from './activité.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Activité, ActivitéSchema } from './schemas/activité.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activité.name, schema: ActivitéSchema },
    ]),
  ],
  controllers: [ActivitéController],
  providers: [ActivitéService],
})
export class ActivitéModule {}
