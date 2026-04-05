import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { createServer } from 'net';
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
        `Se recomienda usar Node LTS (${supportedLtsMajors.join(' o ')}) para evitar advertencias ` +
        `de compatibilidad con pg/TypeORM en desarrollo.`,
    );
  }
}

async function getAvailablePort(preferredPort: number, maxTries = 20): Promise<number> {
  for (let i = 0; i < maxTries; i += 1) {
    const candidate = preferredPort + i;
    const isFree = await new Promise<boolean>((resolve) => {
      const tester = createServer();
      tester.once('error', () => resolve(false));
      tester.once('listening', () => {
        tester.close(() => resolve(true));
      });
      tester.listen(candidate, '0.0.0.0');
    });

    if (isFree) {
      return candidate;
    }
  }

  return preferredPort;
}

async function bootstrap() {
  warnIfNodeVersionIsNotLts();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Archivos estáticos para la landing pública
  app.useStaticAssets(join(process.cwd(), 'public'));

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

  // Configuración de Swagger — disponible en /api/docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('P.U.F.A.B. — API REST')
    .setDescription(
      `**Permiso Único de Filmación Audiovisual de Boyacá**\n\n` +
      `Plataforma digital de la Secretaría de Cultura y Patrimonio y la Comisión Fílmica de Boyacá ` +
      `para gestionar permisos de rodaje audiovisual en el departamento de Boyacá, Colombia.\n\n` +
      `## Autenticación\n` +
      `La mayoría de endpoints requieren un token JWT. Obtén el token con **POST /api/v1/auth/login** ` +
      `y haz clic en el botón **Authorize** (🔒) para ingresarlo.\n\n` +
      `## Usuario de prueba\n` +
      `- Email: \`admin@pufa.gov.co\`\n` +
      `- Password: \`Admin2024!\``,
    )
    .setVersion('1.0')
    .setContact(
      'Comisión Fílmica de Boyacá',
      'https://www.boyaca.gov.co',
      'cultura@boyaca.gov.co',
    )
    .setLicense('Uso Interno — Gobernación de Boyacá', '')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Token JWT obtenido en /auth/login' },
      'JWT',
    )
    .addTag('auth', 'Autenticación y gestión de sesión')
    .addTag('usuarios', 'Gestión de usuarios y perfiles de persona natural/jurídica')
    .addTag('catalogos', 'Datos de referencia: municipios, tipos, estados')
    .addTag('registro', 'Flujo de aprobación de nuevos usuarios')
    .addTag('perfiles', 'Perfiles de proveedores, productoras y directorio')
    .addTag('proyectos', 'Proyectos audiovisuales')
    .addTag('tramites', 'Trámites PUFA — solicitudes de permiso de rodaje')
    .addTag('documentos', 'Carga y validación de documentos')
    .addTag('pagos', 'Pagos y abonos de trámites')
    .addTag('entidades', 'Entidades revisoras externas')
    .build();

  const documento = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, documento, {
    swaggerOptions: {
      persistAuthorization: true,          // Conserva el token entre recargas
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'PUFA-Backend — Documentación API',
  });

  const preferredPort = configService.get<number>('app.port', 3000);
  const port = await getAvailablePort(preferredPort);
  await app.listen(port);
  if (port !== preferredPort) {
    console.warn(`Puerto ${preferredPort} ocupado. Se inició en el puerto ${port}.`);
  }
  console.log('PUFA-Backend corriendo en: http://localhost:' + port + '/' + prefix);
  console.log('Documentación Swagger en:  http://localhost:' + port + '/api/docs');
}
bootstrap();
