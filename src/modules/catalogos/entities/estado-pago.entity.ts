/**
 * ESTADO-PAGO.ENTITY.TS — ESTADOS POSIBLES DE UN PAGO EN EL SISTEMA
 *
 * RESPONSABILIDADES:
 * 1. Controlar el flujo de procesamiento de pagos
 * 2. Gestionar estados de verificación y confirmación
 * 3. Proporcionar orden lógico para estados de pago
 * 4. Mantener trazabilidad del proceso de pago
 *
 * ESTADOS DEL FLUJO DE PAGO:
 * 1. 'pendiente': Pago registrado, esperando procesamiento
 * 2. 'en_proceso': Pago siendo procesado por la entidad
 * 3. 'verificado': Pago confirmado y verificado
 * 4. 'rechazado': Pago rechazado por la entidad
 * 5. 'cancelado': Pago cancelado por el usuario
 * 6. 'expirado': Pago expirado sin confirmación
 * 7. 'reembolsado': Pago devuelto al usuario
 *
 * CAMPOS:
 * - id: ID único autoincremental
 * - codigo: Código único para lógica de negocio
 * - nombre: Nombre descriptivo del estado
 * - descripcion: Explicación detallada del estado
 * - orden: Número para ordenar estados lógicamente
 * - activo: Si el estado está disponible
 *
 * VALIDACIONES CRÍTICAS:
 * - Solo pagos con estado 'verificado' permiten:
 *   * Continuar proceso del trámite
 *   * Generar comprobantes de pago
 *   * Considerarse como pago válido
 *
 * FLUJO DE VALIDACIÓN DE PAGO:
 * 1. Usuario registra pago → estado 'pendiente'
 * 2. Sistema/envía para verificación → 'en_proceso'
 * 3. Entidad confirma pago → 'verificado'
 * 4. Trámite puede continuar
 * 5. Si hay problemas → 'rechazado' o 'expirado'
 *
 * INTEGRACIÓN:
 * - PagosService.cambiarEstado() para transiciones
 * - UI muestra progreso según estado
 * - Reportes financieros por estado de pago
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('estados_pago')
export class EstadoPago {
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
