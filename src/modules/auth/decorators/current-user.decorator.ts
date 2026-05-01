/**
 * CURRENT-USER.DECORATOR.TS — DECORADOR DE USUARIO AUTENTICADO
 *
 * RESPONSABILIDADES:
 * 1. Extraer el usuario autenticado del request de forma declarativa
 * 2. Permitir acceso a la entidad completa del usuario o a una propiedad específica
 * 3. Simplificar el acceso al contexto de autenticación en los controladores
 *
 * USO EN CONTROLADORES:
 * - @CurrentUser()          → retorna el objeto completo del usuario autenticado
 * - @CurrentUser('id')      → retorna solo el campo 'id' del usuario
 * - @CurrentUser('rol')     → retorna solo el campo 'rol' del usuario
 * - @CurrentUser('correo')  → retorna solo el campo 'correo' del usuario
 *
 * EJEMPLO:
 * @Get('perfil')
 * getPerfil(@CurrentUser() usuario: UsuarioPayload) { ... }
 *
 * @Get('mis-tramites')
 * getMisTramites(@CurrentUser('id') usuarioId: number) { ... }
 *
 * PRECONDICIÓN:
 * - El endpoint debe estar protegido con JwtAuthGuard
 * - JwtStrategy debe haber poblado request.user con el payload del token
 *
 * INTEGRACIÓN:
 * - Trabaja junto a JwtStrategy (auth/strategies/jwt.strategy.ts)
 * - Usado en combinación con @Roles() y @RequierePermisos() para control de acceso
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);