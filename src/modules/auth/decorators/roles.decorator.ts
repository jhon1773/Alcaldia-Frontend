/**
 * ROLES.DECORATOR.TS — DECORADOR DE ROLES REQUERIDOS
 *
 * RESPONSABILIDADES:
 * 1. Declarar los roles autorizados para acceder a un endpoint
 * 2. Proveer metadata que RolesGuard lee para autorizar la solicitud
 * 3. Restringir el acceso a recursos según el rol del usuario autenticado
 *
 * USO EN CONTROLADORES:
 * @Roles('admin')
 * @Delete(':id')
 * eliminarUsuario(@Param('id') id: number) { ... }
 *
 * @Roles('admin', 'supervisor')
 * @Get('panel')
 * verPanel() { ... }
 *
 * COMPORTAMIENTO:
 * - Un solo rol: solo usuarios con ese rol exacto pueden acceder
 * - Múltiples roles: aplica lógica OR (basta con tener uno de los roles listados)
 * - Sin @Roles(): RolesGuard no restringe por rol (solo verifica autenticación si aplica)
 *
 * INTEGRACIÓN:
 * - RolesGuard lee ROLES_KEY con Reflector para verificar el rol del usuario
 * - El rol del usuario debe estar disponible en request.user (poblado por JwtStrategy)
 * - Se combina con @RequierePermisos() para control de acceso por rol y permiso simultáneo
 * - Usado junto con @Public() para rutas que no requieren ningún rol
 */

import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);