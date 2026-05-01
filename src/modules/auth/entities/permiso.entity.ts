/**
 * PERMISO.ENTITY.TS — PERMISOS GRANULARES DEL SISTEMA
 *
 * RESPONSABILIDADES:
 * 1. Representar acciones específicas que pueden realizarse sobre los módulos
 * 2. Agrupar permisos por módulo para facilitar su gestión
 * 3. Servir como base para el control de acceso basado en permisos (PBAC)
 * 4. Relacionarse con roles a través de la tabla intermedia RolPermiso
 *
 * CAMPOS:
 * - id:                  ID único autoincremental
 * - codigo:              Identificador único para lógica de negocio (ej: 'tramites:crear')
 * - nombre:              Nombre descriptivo del permiso (ej: 'Crear trámites')
 * - descripcion:         Explicación detallada de qué permite hacer
 * - modulo:              Módulo del sistema al que pertenece (ej: 'tramites', 'pagos')
 * - activo:              Si el permiso está disponible para asignarse
 * - fecha_creacion:      Fecha de registro automática
 * - fecha_actualizacion: Fecha de última modificación automática
 *
 * CONVENCIÓN DE CÓDIGOS:
 * - Formato recomendado: 'modulo:accion' (ej: 'usuarios:eliminar', 'reportes:exportar')
 * - El campo codigo es único y es el que usa @RequierePermisos() en los controladores
 *
 * RELACIONES:
 * - RolPermiso (OneToMany): un permiso puede estar asignado a múltiples roles
 *
 * INTEGRACIÓN:
 * - PermisosGuard consulta los permisos del usuario para autorizar endpoints
 * - @RequierePermisos('codigo') en controladores referencia el campo codigo
 * - Administrado desde el módulo de roles y permisos del panel de administración
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { RolPermiso } from './rol-permiso.entity';

@Entity('permisos')
export class Permiso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  codigo: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ length: 100 })
  modulo: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @OneToMany(() => RolPermiso, (rp) => rp.permiso)
  rol_permisos: RolPermiso[];
}