/**
 * ESTADO-REVISION-ENTIDAD.ENTITY.TS — ESTADOS DE REVISIÓN POR ENTIDAD
 *
 * RESPONSABILIDADES:
 * 1. Representar los estados del proceso de revisión realizado por la entidad
 * 2. Proporcionar indicadores visuales (semáforo) para el seguimiento del estado
 * 3. Mantener orden lógico del flujo de revisión institucional
 *
 * CAMPOS:
 * - id:             ID único autoincremental
 * - codigo:         Código único para lógica de negocio (ej: 'en_revision', 'aprobado')
 * - nombre:         Nombre descriptivo del estado de revisión
 * - descripcion:    Explicación detallada de lo que implica el estado
 * - orden:          Número para ordenar los estados en el flujo de revisión
 * - color_semaforo: Color para representación visual en UI (ej: 'verde', 'rojo', 'amarillo')
 * - activo:         Si el estado está disponible para asignarse
 *
 * INTEGRACIÓN:
 * - TrámitesService actualiza este estado según las acciones de la entidad revisora
 * - UI usa color_semaforo para mostrar indicadores visuales de progreso
 * - Panel de seguimiento filtra trámites por estado de revisión
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('estados_revision_entidad')
export class EstadoRevisionEntidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  codigo: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: 0 })
  orden: number;

  @Column({ length: 20, nullable: true })
  color_semaforo: string;

  @Column({ default: true })
  activo: boolean;
}