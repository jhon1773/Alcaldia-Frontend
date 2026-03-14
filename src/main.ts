import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RespuestaInterceptor } from './common/interceptors/respuesta.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global de la API versionada
  const configService = app.get(ConfigService);
  const prefix = configService.get<string>('app.prefix', 'api/v1');
  app.setGlobalPrefix(prefix);

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtro global para formatear errores en español
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptor global para envolver respuestas exitosas
  app.useGlobalInterceptors(new RespuestaInterceptor());

  // CORS habilitado para desarrollo
  app.enableCors();

  const port = configService.get<number>('app.port', 3000);
  await app.listen(port);
  console.log('PUFA-Backend corriendo en: http://localhost:' + port + '/' + prefix);
}
bootstrap();
