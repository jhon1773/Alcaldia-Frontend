/**
 * ROL.ENTITY.TS — ROLES DE USUARIO EN EL SISTEMA
 *
 * RESPONSABILIDADES:
 * 1. Definir los roles disponibles para el control de acceso basado en roles (RBAC)
 * 2. Agrupar conjuntos de permisos bajo un nombre de rol reutilizable
 * 3. Relacionarse con usuarios a través de UsuarioRol
 * 4. Relacionarse con permisos a través de RolPermiso
 *
 * CAMPOS:
 * - id:                  ID único autoincremental
 * - codigo:              Identificador único para lógica de negocio (ej: 'admin', 'proveedor')
 * - nombre:              Nombre descriptivo del rol (ej: 'Administrador', 'Proveedor')
 * - descripcion:         Explicación del alcance y responsabilidades del rol
 * - activo:              Si el rol puede asignarse a usuarios
 * - fecha_creacion:      Fecha de registro automática
 * - fecha_actualizacion: Fecha de última modificación automática
 *
 * ROLES DEL SISTEMA:
 * - 'admin':      Acceso total a todas las funcionalidades
 * - 'productora': Gestión de trámites propios y seguimiento
 * - 'proveedor':  Oferta de servicios y respuesta a solicitudes
 * - 'academico':  Acceso a módulos académicos y consulta
 *
 * RELACIONES:
 * - UsuarioRol (OneToMany): un rol puede estar asignado a múltiples usuarios
 * - RolPermiso (OneToMany): un rol puede tener múltiples permisos asignados
 *
 * INTEGRACIÓN:
 * - RolesGuard verifica el campo codigo del rol contra @Roles() en los controladores
 * - JwtStrategy incluye el rol activo del usuario en el payload del token
 * - Administrado desde el panel de administración por usuarios con rol 'admin'
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { UsuarioRol } from './usuario-rol.entity';
import { RolPermiso } from './rol-permiso.entity';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  codigo: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @OneToMany(() => UsuarioRol, (ur) => ur.rol)
  usuario_roles: UsuarioRol[];

  @OneToMany(() => RolPermiso, (rp) => rp.rol)
  rol_permisos: RolPermiso[];
}