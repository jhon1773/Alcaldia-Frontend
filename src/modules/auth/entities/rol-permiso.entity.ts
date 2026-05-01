/**
 * ROL-PERMISO.ENTITY.TS — TABLA INTERMEDIA DE ROLES Y PERMISOS
 *
 * RESPONSABILIDADES:
 * 1. Modelar la relación muchos-a-muchos entre roles y permisos
 * 2. Registrar cuándo fue asignado cada permiso a un rol
 * 3. Permitir activar o desactivar permisos por rol sin eliminar el registro
 *
 * CAMPOS:
 * - id:               ID único autoincremental
 * - rol_id:           FK hacia la tabla roles
 * - permiso_id:       FK hacia la tabla permisos
 * - fecha_asignacion: Fecha en que se asignó el permiso al rol (automática)
 * - activo:           Si la asignación está vigente
 *
 * RELACIONES:
 * - Rol     (ManyToOne): cada registro pertenece a un rol específico
 * - Permiso (ManyToOne): cada registro referencia un permiso específico
 *
 * COMPORTAMIENTO:
 * - Un rol puede tener múltiples permisos (un registro por cada par rol-permiso)
 * - Un permiso puede estar asignado a múltiples roles
 * - Para revocar un permiso se recomienda activo: false en lugar de eliminar el registro
 *
 * INTEGRACIÓN:
 * - PermisosGuard consulta esta tabla para verificar si el rol del usuario
 *   tiene asignado el permiso requerido en el endpoint
 * - RolesService gestiona la asignación y revocación de permisos por rol
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Rol } from './rol.entity';
import { Permiso } from './permiso.entity';

@Entity('rol_permisos')
export class RolPermiso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rol_id: number;

  @Column()
  permiso_id: number;

  @CreateDateColumn()
  fecha_asignacion: Date;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Rol, (rol) => rol.rol_permisos)
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  @ManyToOne(() => Permiso, (p) => p.rol_permisos)
  @JoinColumn({ name: 'permiso_id' })
  permiso: Permiso;
}