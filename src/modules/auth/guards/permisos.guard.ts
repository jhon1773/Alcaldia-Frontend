/**
 * PERMISOS.GUARD.TS — GUARD DE VALIDACIÓN DE PERMISOS GRANULARES
 * 
 * RESPONSABILIDADES:
 * 1. Validar que el usuario tenga TODOS los permisos requeridos (AND lógico)
 * 2. Lee permisos requeridos del decorador @RequierePermisos()
 * 3. Compara con los permisos del usuario en el JWT
 * 4. Rechaza acceso si falta CUALQUIER permiso
 * 
 * FLUJO:
 * 1. Request llega al controlador (JwtAuthGuard + RolesGuard ya pasaron)
 * 2. Guard obtiene permisos requeridos del decorador @RequierePermisos()
 * 3. Si no hay decorador: permite acceso (sin restricción)
 * 4. Si hay decorador: verifica que user.permisos INCLUYA TODOS
 * 5. Retorna true (permitir) o false (rechazar)
 * 
 * LÓGICA:
 * - Usa .every() porque necesita TODOS los permisos (AND lógico)
 * - Si falta 1 de los permisos requeridos, rechaza
 * 
 * EJEMPLO DE USO:
 * @RequierePermisos('tramites.aprobar', 'tramites.crear')
 * async aprobarTramite() { }
 * // Usuario DEBE tener AMBOS permisos
 * 
 * DIFERENCIA CON ROLES:
 * - Roles: categorías amplias (admin, revisor, productor)
 * - Permisos: acciones específicas (tramites.aprobar, usuarios.eliminar)
 * - Roles son más generales, permisos son más específicos
 * 
 * ORDEN DE GUARDS: JwtAuthGuard → RolesGuard → PermisosGuard
 */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISOS_KEY } from '../decorators/requiere-permisos.decorator';

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permisosRequeridos = this.reflector.getAllAndOverride<string[]>(PERMISOS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!permisosRequeridos || permisosRequeridos.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    // Verifica que el usuario tenga TODOS los permisos requeridos
    return permisosRequeridos.every((permiso) => user?.permisos?.includes(permiso));
  }
}
