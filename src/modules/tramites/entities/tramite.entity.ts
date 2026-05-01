/**
 * TRAMITE.ENTITY.TS — ENTIDAD PRINCIPAL DEL SISTEMA PUFAB
 *
 * RESPONSABILIDADES:
 * 1. Representar solicitudes de permisos audiovisuales en Boyacá
 * 2. Gestionar flujo completo de aprobación de trámites
 * 3. Mantener trazabilidad con historial de cambios
 * 4. Relacionar con locaciones, equipo técnico y entidades revisoras
 *
 * CAMPOS CRÍTICOS:
 * - id: ID único autoincremental
 * - proyecto_id: Proyecto audiovisual base del trámite
 * - usuario_solicitante_id: Productor que solicita el permiso
 * - tipo_tramite_id: Tipo específico de trámite PUFAB
 * - estado_tramite_id: Estado actual en el flujo de aprobación
 * - numero_radicado: Identificador único PUFA-YYYYMMDD-XXXXXX
 *
 * FECHAS IMPORTANTES:
 * - fecha_solicitud: Fecha de creación del trámite
 * - fecha_inicio_revision: Inicio del proceso de revisión
 * - fecha_aprobacion: Fecha de aprobación final
 * - fecha_vencimiento: Fecha de expiración del permiso
 * - fecha_cancelacion: Fecha de cancelación si aplica
 *
 * RELACIONES COMPLEJAS:
 * - proyecto: Proyecto base (ManyToOne)
 * - usuario_solicitante: Productor solicitante (ManyToOne)
 * - tipo_tramite: Categoría del trámite (ManyToOne)
 * - estado_tramite: Estado actual (ManyToOne)
 * - locaciones: Lugares de rodaje (OneToMany)
 * - equipo_tecnico: Integrantes del equipo (OneToMany)
 * - entidades: Entidades revisoras (OneToMany)
 * - historial: Registro de cambios de estado (OneToMany)
 *
 * ÍNDICES DE PERFORMANCE:
 * - estado_tramite_id: Para filtrar por estado
 * - usuario_solicitante_id: Para consultas por usuario
 * - fecha_solicitud: Para ordenamiento cronológico
 * - numero_radicado: Para búsquedas por radicado
 *
 * CICLO DE VIDA TÍPICO:
 * 1. CREACIÓN: Trámite en 'borrador' con radicado generado
 * 2. ENVÍO: Pasa a 'en_revision' cuando se completa
 * 3. REVISIÓN: Admin revisa documentos y locaciones
 * 4. APROBACIÓN: Estado 'aprobado' con fecha de vencimiento
 * 5. VENCIMIENTO: Pasa a 'expirado' si no se renueva
 *
 * VALIDACIONES CRÍTICAS:
 * - numero_radicado único en el sistema
 * - proyecto_id debe existir y pertenecer al usuario
 * - Transiciones de estado deben ser válidas
 * - Fechas deben ser lógicas y consistentes
 *
 * INTEGRACIÓN CON SISTEMA:
 * - Base para todo el flujo PUFAB
 * - Requiere documentos, pagos y aprobaciones
 * - Genera permisos para producción audiovisual
 * - Mantiene historial completo de auditoría
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, OneToMany,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { TipoTramite } from '../../catalogos/entities/tipo-tramite.entity';
import { EstadoTramite } from '../../catalogos/entities/estado-tramite.entity';
import { TramiteLocacion } from './tramite-locacion.entity';
import { TramiteEquipoTecnico } from './tramite-equipo-tecnico.entity';
import { TramiteEntidad } from './tramite-entidad.entity';
import { HistorialTramite } from './historial-tramite.entity';

@Entity('tramites')
@Index(['estado_tramite_id'])
@Index(['usuario_solicitante_id'])
@Index(['fecha_solicitud'])
@Index(['numero_radicado'])
export class Tramite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  proyecto_id: number;

  @Column()
  usuario_solicitante_id: number;

  @Column({ nullable: true })
  tipo_tramite_id: number;

  @Column({ nullable: true })
  estado_tramite_id: number;

  // Número de radicado único autogenerado
  @Column({ length: 50, unique: true, nullable: true })
  numero_radicado: string;

  @CreateDateColumn()
  fecha_solicitud: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_inicio_revision: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_respuesta: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_aprobacion: Date;

  @Column({ type: 'date', nullable: true })
  fecha_vencimiento_permiso: Date;

  // Requisitos especiales del trámite
  @Column({ default: false })
  requiere_seguro_rc: boolean;

  @Column({ default: false })
  requiere_aval_institucional: boolean;

  @Column({ default: false })
  usa_drones: boolean;

  @Column({ default: false })
  requiere_permiso_aeronautica: boolean;

  @Column({ default: false })
  requiere_cierre_vias: boolean;

  @Column({ default: false })
  requiere_plan_manejo_transito: boolean;

  // Compromisos éticos obligatorios
  @Column({ default: false })
  compromiso_etico_aceptado: boolean;

  @Column({ default: false })
  plan_contingencia_entregado: boolean;

  @Column({ default: false })
  manejo_residuos_aceptado: boolean;

  @Column({ default: false })
  consentimiento_comunidades_aplica: boolean;

  @Column({ default: false })
  consentimiento_comunidades_entregado: boolean;

  @Column({ type: 'text', nullable: true })
  observaciones_generales: string;

  // Información de costos y abono
  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
  costo_proyecto_base: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 30 })
  porcentaje_abono: number;

  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
  valor_abono_requerido: number;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @ManyToOne(() => Proyecto)
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: Proyecto;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_solicitante_id' })
  usuario_solicitante: Usuario;

  @ManyToOne(() => TipoTramite)
  @JoinColumn({ name: 'tipo_tramite_id' })
  tipo_tramite: TipoTramite;

  @ManyToOne(() => EstadoTramite)
  @JoinColumn({ name: 'estado_tramite_id' })
  estado_tramite: EstadoTramite;

  @OneToMany(() => TramiteLocacion, (l) => l.tramite)
  locaciones: TramiteLocacion[];

  @OneToMany(() => TramiteEquipoTecnico, (e) => e.tramite)
  equipo_tecnico: TramiteEquipoTecnico[];

  @OneToMany(() => TramiteEntidad, (te) => te.tramite)
  entidades: TramiteEntidad[];

  @OneToMany(() => HistorialTramite, (h) => h.tramite)
  historial: HistorialTramite[];
}
