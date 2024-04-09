import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ActivitéModule } from './activité/activité.module';
import { UsersModule } from './users/users.module';
import { ClientModule } from './client/client.module';
import { ÉquipementModule } from './équipement/équipement.module';
import { DtModule } from './dt/dt.module';
import { LivraisonModule } from './livraison/livraison.module';
import { EtatDtMiddleware } from './dt/middlewares/etatDt.middleware';
import { LivraisonEtatDtMiddleware } from './livraison/middlewares/livraisonEtatDt.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    ActivitéModule,
    UsersModule,
    ClientModule,
    ÉquipementModule,
    DtModule,
    LivraisonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EtatDtMiddleware)
      .forRoutes({ path: 'dts/*', method: RequestMethod.PUT });
    consumer.apply(LivraisonEtatDtMiddleware).forRoutes({ path: 'livraisons/*', method: RequestMethod.PUT })
  }
}
