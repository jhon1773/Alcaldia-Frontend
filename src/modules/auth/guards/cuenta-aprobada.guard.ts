/**
 * CUENTA-APROBADA.GUARD.TS — GUARD DE VALIDACIÓN DE ESTADO DE CUENTA
 * 
 * RESPONSABILIDADES:
 * 1. Verificar que la cuenta del usuario ESTÉ ACTIVA en la BD
 * 2. Rechazar acceso si cuenta está: pendiente, suspendida, eliminada
 * 3. Consultar BD en cada request (a diferencia de JWT que no consulta BD)
 * 
 * FLUJO:
 * 1. Request llega (JwtAuthGuard + RolesGuard ya pasaron)
 * 2. Obtiene ID del usuario del JWT (req.user.id)
 * 3. Consulta BD: SELECT * FROM usuario WHERE id = ?
 * 4. Obtiene relación estado_cuenta del usuario
 * 5. Verifica: estado_cuenta.codigo === 'activo'
 * 6. Si NO es activo: lanza ForbiddenException
 * 7. Si es activo: permite acceso
 * 
 * CASOS DE USO:
 * - Cuando admin suspende una cuenta, el usuario no puede más acceder
 * - Cuentas pendientes de aprobación no pueden usar el sistema
 * - Validación en tiempo real vs JWT que es estático
 * 
 * RENDIMIENTO:
 * - ⚠️ Consulta BD en CADA request
 * - Usar con moderación (no en todas las rutas)
 * - Ideal para rutas críticas: crear trámite, aprobar, eliminar
 * 
 * APLICACIÓN:
 * @UseGuards(JwtAuthGuard, CuentaAprobadaGuard)
 * async crearTramite() { }
 * 
 * ORDEN DE GUARDS: JwtAuthGuard → RolesGuard → PermisosGuard → CuentaAprobadaGuard
 */

import {
  Injectable, CanActivate, ExecutionContext, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Injectable()
export class CuentaAprobadaGuard implements CanActivate {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const usuario = await this.usuariosRepository.findOne({
      where: { id: user.id },
      relations: ['estado_cuenta'],
    });
    if (!usuario || usuario.estado_cuenta?.codigo !== 'activo') {
      throw new ForbiddenException('La cuenta no está activa o no ha sido aprobada');
    }
    return true;
  }
}
