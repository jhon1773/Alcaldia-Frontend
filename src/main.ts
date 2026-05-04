/**
 * MAIN.TS — PUNTO DE ENTRADA DE LA APLICACIÓN
 *
 * RESPONSABILIDADES:
 * 1. Crear e inicializar la instancia de la aplicación NestJS
 * 2. Configurar archivos estáticos, prefijo global, validación, filtros e interceptores
 * 3. Generar y publicar la documentación Swagger en /api/docs
 * 4. Arrancar el servidor HTTP con fallback automático de puerto si el preferido está ocupado
 *
 * CONFIGURACIÓN GLOBAL:
 * - Archivos estáticos: /public (landing) y /uploads (subidas de archivos)
 * - Prefijo de API:     configurable vía app.prefix (default: 'api/v1')
 * - Validación:         whitelist, forbidNonWhitelisted y transform habilitados
 * - Filtro global:      HttpExceptionFilter para formatear errores en español
 * - Interceptor global: RespuestaInterceptor para envolver respuestas exitosas
 * - CORS:               habilitado para desarrollo
 *
 * SWAGGER:
 * - Título:       P.U.F.A.B. — API REST
 * - Ruta:         /api/docs
 * - Autenticación: Bearer JWT — obtener token en POST /api/v1/auth/login
 * - Credenciales de prueba: admin@pufa.gov.co / Admin2024!
 *
 * FUNCIONES AUXILIARES:
 * - warnIfNodeVersionIsNotLts: Advierte si la versión de Node no es LTS (20 o 22)
 * - listenWithFallback:        Intenta iniciar el servidor en el puerto preferido;
 *                              si está ocupado (EADDRINUSE), prueba los siguientes hasta maxTries
 */
/**
 * MAIN.TS — PUNTO DE ENTRADA DE LA APLICACIÓN
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RespuestaInterceptor } from './common/interceptors/respuesta.interceptor';

function warnIfNodeVersionIsNotLts() {
  const current = process.versions.node;
  const major = Number(current.split('.')[0] ?? '0');
  const supportedLtsMajors = [20, 22];

  if (!supportedLtsMajors.includes(major)) {
    console.warn(
      `[Entorno] Versión de Node detectada: v${current}. ` +
      `Se recomienda usar Node LTS (${supportedLtsMajors.join(' o ')})`,
    );
  }
}

async function listenWithFallback(
  app: NestExpressApplication,
  preferredPort: number,
  maxTries = 20,
): Promise<number> {
  for (let i = 0; i < maxTries; i += 1) {
    const candidate = preferredPort + i;
    try {
      await app.listen(candidate, '0.0.0.0');
      return candidate;
    } catch (error: any) {
      if (error?.code !== 'EADDRINUSE') {
        throw error;
      }
    }
  }

  throw new Error(
    `No fue posible iniciar la aplicación. Puertos ocupados desde ${preferredPort} hasta ${preferredPort + maxTries - 1}.`,
  );
}

async function bootstrap() {
  warnIfNodeVersionIsNotLts();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Archivos estáticos
  app.useStaticAssets(join(process.cwd(), 'public'));
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  // Prefijo global
  const configService = app.get(ConfigService);
  const prefix = configService.get<string>('app.prefix', 'api/v1');
  app.setGlobalPrefix(prefix);

  // Validaciones
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtros e interceptores
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new RespuestaInterceptor());

  // CORS
  app.enableCors();

  // 🔥 SWAGGER CONFIG
  const swaggerConfig = new DocumentBuilder()
    .setTitle('P.U.F.A.B. — API REST')
    .setDescription(
      `Permiso Único de Filmación Audiovisual de Boyacá.\n\n` +
      `Usa POST /api/v1/auth/login para obtener el token JWT.`,
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT',
    )
    .addTag('auth')
    .addTag('usuarios')
    .addTag('catalogos')
    .addTag('registro')
    .addTag('perfiles')
    .addTag('proyectos')
    .addTag('tramites')
    .addTag('documentos')
    .addTag('pagos')
    .addTag('entidades')
    .build();

  const documento = SwaggerModule.createDocument(app, swaggerConfig, {
    deepScanRoutes: true, // ✅ ESTE ES EL CAMBIO IMPORTANTE
  });

  SwaggerModule.setup('api/docs', app, documento, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'PUFA-Backend — Documentación API',
  });

  // Puerto
  const preferredPort = configService.get<number>('app.port', 3000);
  const port = await listenWithFallback(app, preferredPort);

  console.log(`Servidor corriendo en: http://localhost:${port}/${prefix}`);
  console.log(`Swagger en: http://localhost:${port}/api/docs`);
}

bootstrap();