/**
 * ESTADO-ABONO.ENTITY.TS — ESTADOS POSIBLES DE UN ABONO EN EL SISTEMA
 *
 * RESPONSABILIDADES:
 * 1. Controlar el flujo de procesamiento de abonos
 * 2. Proporcionar orden lógico para los estados del ciclo de vida del abono
 * 3. Mantener trazabilidad del proceso de abono de un trámite
 *
 * CAMPOS:
 * - id:          ID único autoincremental
 * - codigo:      Código único para lógica de negocio (ej: 'pendiente', 'aprobado')
 * - nombre:      Nombre descriptivo del estado
 * - descripcion: Explicación detallada del estado
 * - orden:       Número para ordenar los estados lógicamente en el flujo
 * - activo:      Si el estado está disponible para asignarse
 *
 * INTEGRACIÓN:
 * - AbonosService.cambiarEstado() para gestionar transiciones entre estados
 * - UI muestra el progreso del abono según el estado actual
 * - Reportes financieros filtrados por estado de abono
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('estados_abono')
export class EstadoAbono {
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

  @Column({ default: true })
  activo: boolean;
}