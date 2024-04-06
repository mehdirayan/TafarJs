import {Module} from '@nestjs/common';
import { DtController } from './dt.controller';
import { DtService } from './dt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Dt, DtSchema } from './schema/dt.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: Dt.name, schema: DtSchema }])],
  controllers: [DtController],
  providers: [DtService],
})
export class DtModule {
  
}
