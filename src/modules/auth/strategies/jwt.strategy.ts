/**
 * JWT.STRATEGY.TS — ESTRATEGIA DE VALIDACIÓN DE TOKENS JWT
 *
 * RESPONSABILIDADES:
 * 1. Extraer y validar el token JWT del header Authorization en cada request
 * 2. Deserializar el payload del token y poblarlo en request.user
 * 3. Rechazar tokens inválidos, expirados o sin campo 'sub'
 * 4. Evitar consultas a la base de datos en cada solicitud autenticada
 *
 * FLUJO DE VALIDACIÓN:
 * 1. JwtAuthGuard intercepta el request entrante
 * 2. Esta estrategia extrae el token del header: Authorization: Bearer <token>
 * 3. Passport verifica la firma con el secreto configurado en app.jwtSecret
 * 4. Si el token es válido, se llama a validate() con el payload deserializado
 * 5. validate() retorna el objeto que queda disponible en request.user
 * 6. Si el token es inválido o expirado, se lanza UnauthorizedException automáticamente
 *
 * OBJETO RESULTANTE EN request.user:
 * {
 *   id:          ID del usuario (sub del payload)
 *   email:       Correo electrónico del usuario
 *   roles:       Array de códigos de roles asignados
 *   permisos:    Array de códigos de permisos activos
 *   tipoPerfil:  Código del tipo de perfil del usuario
 * }
 *
 * INTEGRACIÓN:
 * - Registrado como provider en AuthModule
 * - @CurrentUser() en controladores extrae campos de request.user
 * - RolesGuard y PermisosGuard leen roles y permisos desde request.user
 * - El secreto se obtiene de app.jwtSecret (variable JWT_SECRET en .env)
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('app.jwtSecret') ?? 'dev-jwt-secret-change-me',
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException('Token inválido');
    }
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
      permisos: payload.permisos,
      tipoPerfil: payload.tipoPerfil,
    };
  }
}