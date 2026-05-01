/**
 * JWT-AUTH.GUARD.TS — GUARD DE AUTENTICACIÓN JWT
 * 
 * RESPONSABILIDADES:
 * 1. Validar que el request incluya token JWT válido
 * 2. Permitir rutas marcadas con @Public() sin autenticación
 * 3. Extraer y adjuntar datos del usuario al request
 * 4. Lanzar UnauthorizedException si token es inválido/expirado
 * 
 * FLUJO:
 * 1. Request llega al controlador
 * 2. Guard verifica si ruta tiene @Public()
 * 3. Si tiene @Public(): permite acceso sin validar JWT
 * 4. Si NO tiene @Public():
 *    a. Extrae Authorization header
 *    b. Valida firma del JWT
 *    c. Verifica que no esté expirado
 *    d. Adjunta user al request (req.user)
 *    e. Permite o rechaza acceso
 * 
 * DEPENDENCIA: Usa estrategia JwtStrategy (Passport)
 * APLICACIÓN: @UseGuards(JwtAuthGuard) en controladores
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Rutas marcadas con @Public() omiten la validación de JWT
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}
