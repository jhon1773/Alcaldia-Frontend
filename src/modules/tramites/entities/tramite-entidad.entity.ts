/**
 * TRAMITE-ENTIDAD.ENTITY.TS — ENTIDADES REVISTORAS DE TRÁMITES PUFAB
 *
 * RESPONSABILIDADES:
 * 1. Gestionar entidades externas que revisan trámites
 * 2. Controlar flujo de revisiones por entidades competentes
 * 3. Mantener estado de revisiones por cada entidad
 * 4. Coordinar aprobaciones sectoriales requeridas
 *
 * CAMPOS PRINCIPALES:
 * - id: ID único autoincremental
 * - tramite_id: Trámite PUFAB asociado
 * - entidad_id: Entidad revisora asignada
 * - estado_revision_id: Estado de la revisión por esta entidad
 * - fecha_envio: Fecha de envío a la entidad
 * - fecha_respuesta: Fecha de respuesta de la entidad
 * - observaciones: Comentarios de la entidad revisora
 * - requiere_concepto: Si la entidad debe emitir concepto
 *
 * RELACIONES:
 * - tramite: Trámite siendo revisado (ManyToOne)
 * - entidad: Entidad revisora (ManyToOne)
 * - estado_revision: Estado del proceso de revisión (ManyToOne)
 * - usuario_asignado: Usuario que asignó la revisión (ManyToOne)
 *
 * ENTIDADES REVISTORAS TÍPICAS:
 * - CAR (Corporación Autónoma Regional): Zonas ambientales
 * - Alcaldías municipales: Permisos locales
 * - Policía Nacional: Seguridad y orden público
 * - Aeronáutica Civil: Espacios aéreos y drones
 * - Ministerio de Cultura: Aspectos culturales
 * - Entidades ambientales: Áreas protegidas
 *
 * ESTADOS DE REVISIÓN:
 * - Pendiente: Enviado pero no revisado
 * - En revisión: Siendo evaluado por la entidad
 * - Aprobado: Concepto favorable emitido
 * - Rechazado: Concepto negativo con observaciones
 * - No aplica: No requiere revisión de esta entidad
 *
 * FLUJO DE REVISIÓN:
 * 1. Trámite asigna entidades según locaciones/actividades
 * 2. Sistema envía solicitud a cada entidad
 * 3. Entidades revisan y emiten concepto
 * 4. Sistema consolida respuestas
 * 5. Aprobación final depende de todas las entidades
 *
 * VALIDACIONES:
 * - tramite_id y entidad_id requeridos
 * - estado_revision_id controla el flujo
 * - fechas de envío/respuesta para trazabilidad
 * - observaciones documentan conceptos emitidos
 *
 * INTEGRACIÓN CON PUFAB:
 * - Determina si trámite puede aprobarse
 * - Conceptos técnicos son obligatorios
 * - Tiempos de respuesta afectan cronograma
 * - Base para decisiones administrativas
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Tramite } from './tramite.entity';
import { EstadoRevisionEntidad } from '../../catalogos/entities/estado-revision-entidad.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Entidad } from '../../entidades/entities/entidad.entity';

@Entity('tramite_entidades')
export class TramiteEntidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tramite_id: number;

  @Column()
  entidad_id: number;

  @Column({ nullable: true })
  estado_revision_id: number;

  @Column({ type: 'timestamp', nullable: true })
  fecha_envio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_respuesta: Date;

  @Column({ nullable: true })
  usuario_revisor_id: number;

  @Column({ length: 50, nullable: true })
  concepto: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @ManyToOne(() => Tramite, (t) => t.entidades)
  @JoinColumn({ name: 'tramite_id' })
  tramite: Tramite;

  @ManyToOne(() => Entidad)
  @JoinColumn({ name: 'entidad_id' })
  entidad: Entidad;

  @ManyToOne(() => EstadoRevisionEntidad)
  @JoinColumn({ name: 'estado_revision_id' })
  estado_revision: EstadoRevisionEntidad;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_revisor_id' })
  usuario_revisor: Usuario;
}
