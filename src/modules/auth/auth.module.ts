/**
 * AUTH.MODULE.TS — MÓDULO DE AUTENTICACIÓN
 *
 * RESPONSABILIDADES:
 * 1. Agrupar y configurar todos los componentes del dominio de autenticación
 * 2. Configurar JwtModule con secreto y expiración desde variables de entorno
 * 3. Registrar las entidades de TypeORM necesarias para el módulo
 * 4. Exportar AuthService y JwtModule para uso en otros módulos
 *
 * PROVIDERS REGISTRADOS:
 * - AuthService:  Lógica de negocio de autenticación
 * - JwtStrategy:  Validación de tokens JWT en cada request protegido
 *
 * CONFIGURACIÓN JWT:
 * - Secreto:    Leído de app.jwtSecret (variable JWT_SECRET en .env)
 * - Expiración: Leída de JWT_EXPIRES_IN o JWT_EXPIRATION (default: '1d')
 * - La configuración es asíncrona para poder inyectar ConfigService
 *
 * ENTIDADES REGISTRADAS:
 * - Rol, Permiso, UsuarioRol, RolPermiso    → control de acceso RBAC
 * - Usuario, PersonaNatural, PersonaJuridica → datos del usuario
 * - EstadoCuenta, TipoPerfil                → catálogos de estado y perfil
 *
 * EXPORTS:
 * - AuthService: disponible para módulos que necesiten verificar autenticación
 * - JwtModule:   disponible para módulos que necesiten firmar o verificar tokens
 *
 * INTEGRACIÓN:
 * - Importado en AppModule como módulo del dominio auth
 * - JwtStrategy queda disponible globalmente al registrarse con PassportModule
 * - Los guards JwtAuthGuard y RolesGuard usan JwtStrategy automáticamente
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Rol } from './entities/rol.entity';
import { Permiso } from './entities/permiso.entity';
import { UsuarioRol } from './entities/usuario-rol.entity';
import { RolPermiso } from './entities/rol-permiso.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { PersonaNatural } from '../usuarios/entities/persona-natural.entity';
import { PersonaJuridica } from '../usuarios/entities/persona-juridica.entity';
import { EstadoCuenta } from '../catalogos/entities/estado-cuenta.entity';
import { TipoPerfil } from '../catalogos/entities/tipo-perfil.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Acepta JWT_EXPIRES_IN o JWT_EXPIRATION
        const expiracion = configService.get<string>('JWT_EXPIRES_IN') ?? configService.get<string>('JWT_EXPIRATION') ?? '1d';
        return {
          secret: configService.get<string>('app.jwtSecret') ?? 'dev-jwt-secret-change-me',
          signOptions: { expiresIn: expiracion as any },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      Rol,
      Permiso,
      UsuarioRol,
      RolPermiso,
      Usuario,
      PersonaNatural,
      PersonaJuridica,
      EstadoCuenta,
      TipoPerfil,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}