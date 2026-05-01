/**
 * USUARIO-ROL.ENTITY.TS — TABLA INTERMEDIA DE USUARIOS Y ROLES
 *
 * RESPONSABILIDADES:
 * 1. Modelar la relación muchos-a-muchos entre usuarios y roles
 * 2. Registrar cuándo y quién asignó cada rol a un usuario
 * 3. Permitir activar o desactivar roles por usuario sin eliminar el registro
 * 4. Soportar que un usuario tenga múltiples roles simultáneos
 *
 * CAMPOS:
 * - id:               ID único autoincremental
 * - usuario_id:       FK hacia la tabla usuarios
 * - rol_id:           FK hacia la tabla roles
 * - fecha_asignacion: Fecha en que se asignó el rol al usuario (automática)
 * - asignado_por:     ID del usuario administrador que realizó la asignación (auditoría)
 * - activo:           Si la asignación de rol está vigente
 *
 * RELACIONES:
 * - Rol (ManyToOne): cada registro referencia el rol asignado
 *
 * COMPORTAMIENTO:
 * - Un usuario puede tener múltiples roles activos simultáneamente
 * - Para revocar un rol se recomienda activo: false en lugar de eliminar el registro
 * - asignado_por permite auditar quién otorgó accesos en el sistema
 *
 * INTEGRACIÓN:
 * - AuthService consulta esta tabla al generar el token JWT del usuario
 * - RolesGuard verifica el rol activo del usuario para autorizar endpoints
 * - UsuariosService gestiona la asignación y revocación de roles por usuario
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Rol } from './rol.entity';

@Entity('usuario_roles')
export class UsuarioRol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario_id: number;

  @Column()
  rol_id: number;

  @CreateDateColumn()
  fecha_asignacion: Date;

  @Column({ nullable: true })
  asignado_por: number;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Rol, (rol) => rol.usuario_roles)
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;
}