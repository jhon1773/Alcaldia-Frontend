/**
 * TRAMITE-EQUIPO-TECNICO.ENTITY.TS — EQUIPO TÉCNICO DE PRODUCCIONES AUDIOVISUALES
 *
 * RESPONSABILIDADES:
 * 1. Registrar miembros del equipo técnico de filmación
 * 2. Clasificar roles técnicos en producciones audiovisuales
 * 3. Gestionar información de contacto del equipo
 * 4. Relacionar personal técnico con trámites PUFAB
 *
 * CAMPOS PRINCIPALES:
 * - id: ID único autoincremental
 * - tramite_id: Trámite PUFAB asociado
 * - rol_equipo_tecnico_id: Rol específico del integrante
 * - nombre_completo: Nombre completo del integrante
 * - identificacion: Número de documento de identidad
 * - telefono: Número de teléfono de contacto
 * - email: Correo electrónico del integrante
 *
 * RELACIONES:
 * - tramite: Trámite al que pertenece (ManyToOne)
 * - rol_equipo_tecnico: Categoría del rol (ManyToOne)
 *
 * ROLES TÉCNICOS TÍPICOS:
 * - Director: Responsable artístico y técnico
 * - Camarógrafo: Operador de cámara
 * - Sonidista: Técnico de audio
 * - Iluminador: Técnico de iluminación
 * - Productor: Coordinador de producción
 * - Asistente de dirección: Apoyo al director
 * - Script: Continuista/secretario de rodaje
 * - Gaffer: Jefe de eléctricos
 *
 * VALIDACIONES:
 * - nombre_completo requerido para identificar al integrante
 * - rol_equipo_tecnico_id clasifica la función específica
 * - identificacion y telefono opcionales pero recomendados
 * - email para comunicaciones oficiales
 *
 * PROPÓSITO EN PUFAB:
 * - Documentar equipo técnico autorizado
 * - Verificar experiencia y calificaciones
 * - Facilitar comunicaciones durante rodaje
 * - Cumplir requisitos de producción responsable
 *
 * INTEGRACIÓN CON SISTEMA:
 * - Múltiples integrantes por trámite
 * - Vinculado con requisitos de producción
 * - Información visible para entidades revisoras
 * - Base para permisos de acceso a locaciones
 *
 * CONSIDERACIONES LEGALES:
 * - Verificación de identidad puede ser requerida
 * - Algunos roles requieren certificaciones específicas
 * - Información confidencial debe protegerse
 * - Cumple con requisitos de producción audiovisual
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Tramite } from './tramite.entity';
import { RolEquipoTecnico } from '../../catalogos/entities/rol-equipo-tecnico.entity';

@Entity('tramite_equipo_tecnico')
export class TramiteEquipoTecnico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tramite_id: number;

  @Column({ nullable: true })
  rol_equipo_tecnico_id: number;

  @Column({ length: 255 })
  nombre_completo: string;

  @Column({ length: 30, nullable: true })
  identificacion: string;

  @Column({ length: 30, nullable: true })
  telefono: string;

  @Column({ length: 255, nullable: true })
  email: string;

  // Indicador de fomento al talento local boyacense
  @Column({ default: false })
  es_talento_local: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @ManyToOne(() => Tramite, (t) => t.equipo_tecnico)
  @JoinColumn({ name: 'tramite_id' })
  tramite: Tramite;

  @ManyToOne(() => RolEquipoTecnico)
  @JoinColumn({ name: 'rol_equipo_tecnico_id' })
  rol_equipo_tecnico: RolEquipoTecnico;
}
