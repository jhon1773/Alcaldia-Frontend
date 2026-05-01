/**
 * ROL-EQUIPO-TECNICO.ENTITY.TS — CATÁLOGO DE ROLES DEL EQUIPO TÉCNICO
 *
 * RESPONSABILIDADES:
 * 1. Definir los roles que pueden desempeñar los integrantes del equipo técnico
 * 2. Permitir describir las funciones asociadas a cada rol
 * 3. Habilitar o deshabilitar roles según las necesidades del sistema
 *
 * CAMPOS:
 * - id:          ID único autoincremental
 * - nombre:      Nombre del rol técnico (ej: 'Director de fotografía', 'Sonidista', 'Editor')
 * - descripcion: Descripción de las responsabilidades del rol (opcional)
 * - activo:      Si el rol está disponible para asignarse a integrantes del equipo
 *
 * INTEGRACIÓN:
 * - Referenciado en la entidad de integrantes del equipo técnico de productoras y proveedores
 * - Usado en formularios de registro de equipo humano y en reportes de perfiles disponibles
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('roles_equipo_tecnico')
export class RolEquipoTecnico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;
}