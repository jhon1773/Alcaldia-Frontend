/**
 * ROLES.GUARD.TS — GUARD DE VALIDACIÓN DE ROLES
 * 
 * RESPONSABILIDADES:
 * 1. Validar que el usuario tenga al menos UNO de los roles requeridos
 * 2. Lee los roles requeridos del decorador @Roles('admin', 'revisor')
 * 3. Compara con los roles del usuario en el JWT
 * 4. Rechaza acceso si no cumple la condición
 * 
 * FLUJO:
 * 1. Request llega al controlador (ya validado por JwtAuthGuard)
 * 2. Guard obtiene roles requeridos del decorador @Roles()
 * 3. Si no hay @Roles(): permite acceso (sin restricción de rol)
 * 4. Si hay @Roles(): verifica que user.roles incluya AL MENOS UNO
 * 5. Retorna true (permitir) o false (rechazar)
 * 
 * LÓGICA:
 * - Usa .some() porque necesita CUALQUIER rol (OR lógico)
 * - Si usuario tiene múltiples roles, basta con uno para pasar
 * 
 * EJEMPLO DE USO:
 * @Roles('admin', 'revisor')
 * async eliminarUsuario() { }
 * // Usuario necesita tener 'admin' O 'revisor' (o ambos)
 * 
 * ORDEN DE GUARDS: JwtAuthGuard → RolesGuard → PermisosGuard
 */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequeridos = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!rolesRequeridos || rolesRequeridos.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    // Verifica si el usuario tiene al menos uno de los roles requeridos
    return rolesRequeridos.some((rol) => user?.roles?.includes(rol));
  }
}
