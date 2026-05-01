/**
 * HISTORIAL-TRAMITE.ENTITY.TS — REGISTRO DE CAMBIOS DE ESTADO DE TRÁMITES
 *
 * RESPONSABILIDADES:
 * 1. Mantener trazabilidad completa de cambios en trámites
 * 2. Registrar quién, cuándo y por qué cambió el estado
 * 3. Proporcionar auditoría completa del proceso PUFAB
 * 4. Soporte para reportes y análisis de tiempos
 *
 * CAMPOS PRINCIPALES:
 * - id: ID único autoincremental
 * - tramite_id: Trámite al que pertenece el cambio
 * - estado_anterior_id: Estado antes del cambio
 * - estado_nuevo_id: Estado después del cambio
 * - usuario_actor_id: Usuario que realizó el cambio
 * - accion: Descripción de la acción realizada
 * - observacion: Comentarios adicionales del cambio
 * - fecha_cambio: Timestamp exacto del cambio
 *
 * RELACIONES:
 * - tramite: Trámite afectado (ManyToOne)
 * - estado_anterior: Estado previo (ManyToOne)
 * - estado_nuevo: Estado nuevo (ManyToOne)
 * - usuario_actor: Usuario que realizó el cambio (ManyToOne)
 *
 * ACCIONES REGISTRADAS:
 * - 'Trámite creado': Creación inicial del trámite
 * - 'Cambio de estado': Transición entre estados
 * - 'Documento subido': Adición de documentos
 * - 'Pago registrado': Registro de abonos
 * - 'Revisión iniciada': Inicio de proceso de revisión
 * - 'Aprobado': Aprobación final
 * - 'Rechazado': Rechazo con observaciones
 * - 'Cancelado': Cancelación por solicitante
 *
 * PROPÓSITO DE AUDITORÍA:
 * - Quién realizó cada cambio
 * - Cuándo ocurrió cada cambio
 * - Por qué se realizó el cambio (observaciones)
 * - Trazabilidad completa del proceso
 *
 * USO EN REPORTES:
 * - Tiempos de respuesta por estado
 * - Productividad de revisores
 * - Análisis de cuellos de botella
 * - Métricas de eficiencia del proceso
 *
 * VALIDACIONES:
 * - tramite_id debe existir
 * - estado_anterior y estado_nuevo pueden ser null en creación
 * - usuario_actor_id registra quién realizó el cambio
 * - fecha_cambio se establece automáticamente
 *
 * INTEGRACIÓN:
 * - Creado automáticamente en cambios de estado
 * - Visible en interfaces de detalle de trámite
 * - Base para reportes administrativos
 * - Soporte para resolución de disputas
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Tramite } from './tramite.entity';
import { EstadoTramite } from '../../catalogos/entities/estado-tramite.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('historial_tramite')
export class HistorialTramite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tramite_id: number;

  @Column({ nullable: true })
  estado_anterior_id: number;

  @Column({ nullable: true })
  estado_nuevo_id: number;

  @Column({ nullable: true })
  usuario_actor_id: number;

  @Column({ length: 100 })
  accion: string;

  @Column({ type: 'text', nullable: true })
  observacion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_cambio: Date;

  @ManyToOne(() => Tramite, (t) => t.historial)
  @JoinColumn({ name: 'tramite_id' })
  tramite: Tramite;

  @ManyToOne(() => EstadoTramite)
  @JoinColumn({ name: 'estado_anterior_id' })
  estado_anterior: EstadoTramite;

  @ManyToOne(() => EstadoTramite)
  @JoinColumn({ name: 'estado_nuevo_id' })
  estado_nuevo: EstadoTramite;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_actor_id' })
  usuario_actor: Usuario;
}
