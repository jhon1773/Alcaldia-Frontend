/**
 * TIPO-ENTIDAD-REVISION.ENTITY.TS — CATÁLOGO DE TIPOS DE ENTIDAD REVISORA
 *
 * RESPONSABILIDADES:
 * 1. Clasificar las entidades que participan en el proceso de revisión de trámites
 * 2. Diferenciar el rol institucional de cada tipo de entidad revisora
 * 3. Habilitar o deshabilitar tipos según las necesidades del sistema
 *
 * CAMPOS:
 * - id:          ID único autoincremental
 * - codigo:      Código único para lógica de negocio (ej: 'entidad_publica', 'comite_tecnico')
 * - nombre:      Nombre descriptivo del tipo de entidad revisora
 * - descripcion: Explicación del alcance y responsabilidades del tipo (opcional)
 * - activo:      Si el tipo está disponible para asignarse en el flujo de revisión
 *
 * INTEGRACIÓN:
 * - Referenciado en la entidad de revisión para identificar qué tipo de entidad
 *   está a cargo de la evaluación de un trámite en cada etapa del flujo
 * - Usado en reportes de gestión institucional y seguimiento de revisiones
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_entidad_revision')
export class TipoEntidadRevision {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  codigo: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;
}