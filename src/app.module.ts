/**
 * APP.MODULE.TS — MÓDULO RAÍZ DE LA APLICACIÓN
 *
 * RESPONSABILIDADES:
 * 1. Configurar las variables de entorno de forma global mediante ConfigModule
 * 2. Establecer la conexión a PostgreSQL con TypeORM de forma asíncrona
 * 3. Importar y registrar todos los módulos de dominio de la aplicación
 *
 * CONFIGURACIÓN:
 * - Variables de entorno: cargadas desde .env con los namespaces app y database
 * - Base de datos: conexión PostgreSQL con autoLoadEntities y synchronize configurable
 * - Logging de queries: habilitado/deshabilitado según variable de entorno
 *
 * MÓDULOS REGISTRADOS:
 * - AuthModule:       Autenticación JWT y gestión de sesión
 * - UsuariosModule:   Gestión de usuarios y perfiles (natural/jurídica)
 * - CatalogosModule:  Datos de referencia: municipios, tipos, estados
 * - RegistroModule:   Flujo de aprobación de nuevos usuarios
 * - PerfilesModule:   Perfiles de proveedores, productoras y directorio
 * - ProyectosModule:  Proyectos audiovisuales
 * - TramitesModule:   Trámites PUFA — solicitudes de permiso de rodaje
 * - DocumentosModule: Carga y validación de documentos
 * - PagosModule:      Pagos y abonos de trámites
 * - EntidadesModule:  Entidades revisoras externas
 *
 * INTEGRACIÓN:
 * - AppController maneja redirecciones y endpoints de portal que no pertenecen a un módulo específico
 * - AppService provee lógica auxiliar compartida accesible desde el controlador raíz
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { CatalogosModule } from './modules/catalogos/catalogos.module';
import { RegistroModule } from './modules/registro/registro.module';
import { PerfilesModule } from './modules/perfiles/perfiles.module';
import { ProyectosModule } from './modules/proyectos/proyectos.module';
import { TramitesModule } from './modules/tramites/tramites.module';
import { DocumentosModule } from './modules/documentos/documentos.module';
import { PagosModule } from './modules/pagos/pagos.module';
import { EntidadesModule } from './modules/entidades/entidades.module';

@Module({
  imports: [
    // Configuración global con variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [path.resolve(process.cwd(), '.env')],
      load: [appConfig, databaseConfig],
    }),
    // Conexión a PostgreSQL con TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        autoLoadEntities: true,
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('database.logging'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsuariosModule,
    CatalogosModule,
    RegistroModule,
    PerfilesModule,
    ProyectosModule,
    TramitesModule,
    DocumentosModule,
    PagosModule,
    EntidadesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}