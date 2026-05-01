/**
 * PERMISOS.DECORATOR.TS — DECORADOR DE PERMISOS GRANULARES
 *
 * RESPONSABILIDADES:
 * 1. Declarar los permisos específicos requeridos para acceder a un endpoint
 * 2. Proveer metadata que PermisosGuard lee para autorizar la solicitud
 * 3. Habilitar control de acceso fino más allá de los roles generales
 *
 * USO EN CONTROLADORES:
 * @RequierePermisos('tramites:crear')
 * @Post()
 * crearTramite(@Body() dto: CrearTramiteDto) { ... }
 *
 * @RequierePermisos('tramites:leer', 'reportes:ver')
 * @Get('reporte')
 * obtenerReporte() { ... }
 *
 * CONVENCIÓN DE NOMBRES DE PERMISOS:
 * - Formato recomendado: 'recurso:accion' (ej: 'usuarios:eliminar', 'pagos:aprobar')
 * - Múltiples permisos en un decorador aplican lógica AND (se requieren todos)
 *
 * INTEGRACIÓN:
 * - PermisosGuard lee PERMISOS_KEY con Reflector para verificar autorización
 * - Se combina con @Roles() para control de acceso por rol y permiso simultáneo
 * - Los permisos del usuario deben estar disponibles en el payload del JWT o en base de datos
 */

import { SetMetadata } from '@nestjs/common';

export const PERMISOS_KEY = 'permisos';
export const RequierePermisos = (...permisos: string[]) => SetMetadata(PERMISOS_KEY, permisos);