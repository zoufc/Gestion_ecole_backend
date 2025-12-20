import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import logger from './utils/logger';
import { HttpExceptionFilter } from './utils/filters/http-exception.filter';
import { RolesGuard } from './utils/guards/role.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    allowedHeaders: [
      '*',
      /* 'Content-Type, Access-Control-Allow-Origin, x-access-token, Accept', */
    ],
    methods: 'POST,GET,PUT,PATCH,DELETE',
  });
  app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());
  const port = app.get(ConfigService).get('port');
  await app.listen(port);
  logger.info(`Gestion_ecole_BACKEND IS RUNNING ON ${await app.getUrl()}`);
}
bootstrap();
