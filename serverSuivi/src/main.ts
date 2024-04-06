import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true, origin: '*' });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter(new Logger()));
  await app.listen(
    process.env.PORT ? parseInt(process.env.PORT) : 3000,
    process.env.SERVER,
    () => {
      new Logger().log(
        'Listen at ' + process.env.SERVER + ':' + process.env.PORT,
        'APP',
      );
    },
  );
}
bootstrap();
