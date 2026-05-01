/**
 * PAGO.ENTITY.TS — ENTIDAD PARA REGISTROS DE PAGOS REALIZADOS
 *
 * RESPONSABILIDADES:
 * 1. Registrar pagos realizados por usuarios
 * 2. Mantener trazabilidad de transacciones
 * 3. Gestionar verificación de pagos por administradores
 * 4. Relacionar pagos con trámites y soportes
 *
 * CAMPOS PRINCIPALES:
 * - id: ID único autoincremental
 * - tramite_id: Trámite PUFAB asociado
 * - usuario_id: Usuario que realizó el pago
 * - tipo_pago_id: Método de pago utilizado
 * - estado_pago_id: Estado actual del pago
 * - monto: Valor pagado (numeric con precisión)
 * - referencia_pago: Referencia bancaria/transacción
 * - soporte_pago_documento_id: ID del documento soporte
 * - fecha_pago: Fecha en que se realizó el pago
 * - fecha_registro: Fecha de registro en sistema
 * - fecha_verificacion: Fecha de verificación por admin
 * - verificado_por: Admin que verificó el pago
 *
 * RELACIONES:
 * - usuario: Usuario que realizó el pago (ManyToOne)
 * - tipo_pago: Método de pago (ManyToOne)
 * - estado_pago: Estado actual (ManyToOne)
 * - tramite: Trámite asociado (ManyToOne)
 * - soporte_pago_documento: Documento comprobante (ManyToOne)
 *
 * FLUJO DE ESTADOS:
 * 1. 'pendiente': Registrado, esperando verificación
 * 2. 'en_proceso': Siendo verificado por admin
 * 3. 'verificado': Confirmado y válido
 * 4. 'rechazado': Rechazado por admin
 * 5. 'cancelado': Cancelado por usuario
 * 6. 'expirado': Expirado sin verificación
 *
 * VALIDACIONES:
 * - Monto debe ser positivo
 * - Referencia de pago debe ser única
 * - Soporte obligatorio para verificación
 * - Solo pagos verificados permiten continuar trámite
 *
 * INTEGRACIÓN CON PUFAB:
 * - Obligatorio para continuar proceso de trámite
 * - Abono mínimo del 30% del presupuesto del proyecto
 * - Verificado antes de aprobación final
 * - Mantiene historial de transacciones
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { TipoPago } from '../../catalogos/entities/tipo-pago.entity';
import { EstadoPago } from '../../catalogos/entities/estado-pago.entity';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tramite_id: number;

  @Column()
  usuario_id: number;

  @Column({ nullable: true })
  tipo_pago_id: number;

  @Column({ nullable: true })
  estado_pago_id: number;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  monto: number;

  @Column({ length: 10, default: 'COP' })
  moneda: string;

  @Column({ length: 100, nullable: true })
  referencia_pago: string;

  // ID del documento que es el soporte/comprobante del pago
  @Column({ nullable: true })
  soporte_pago_documento_id: number;

  @Column({ type: 'date', nullable: true })
  fecha_pago: Date;

  @CreateDateColumn()
  fecha_registro: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => TipoPago)
  @JoinColumn({ name: 'tipo_pago_id' })
  tipo_pago: TipoPago;

  @ManyToOne(() => EstadoPago)
  @JoinColumn({ name: 'estado_pago_id' })
  estado_pago: EstadoPago;
}
