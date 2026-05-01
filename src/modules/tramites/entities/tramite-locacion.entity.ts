/**
 * TRAMITE-LOCACION.ENTITY.TS — LOCACIONES DE RODAJE DE TRÁMITES PUFAB
 *
 * RESPONSABILIDADES:
 * 1. Registrar lugares específicos de rodaje audiovisual
 * 2. Gestionar permisos requeridos por locación
 * 3. Relacionar trámites con municipios y tipos de espacio
 * 4. Mantener información detallada de lugares de filmación
 *
 * CAMPOS PRINCIPALES:
 * - id: ID único autoincremental
 * - tramite_id: Trámite PUFAB asociado
 * - municipio_id: Municipio donde se ubica la locación
 * - tipo_espacio_id: Tipo de espacio (público, privado, natural)
 * - nombre_lugar: Nombre específico del lugar de rodaje
 * - direccion: Dirección detallada de la locación
 * - requiere_permiso_especial: Si necesita permisos adicionales
 * - observaciones: Notas especiales sobre la locación
 *
 * RELACIONES:
 * - tramite: Trámite al que pertenece (ManyToOne)
 * - municipio: Municipio de ubicación (ManyToOne)
 * - tipo_espacio: Categoría del espacio (ManyToOne)
 *
 * TIPOS DE ESPACIO:
 * - Público: Plazas, parques, calles
 * - Privado: Propiedades particulares, empresas
 * - Natural: Bosques, ríos, páramos (requiere permisos ambientales)
 * - Institucional: Edificios públicos, universidades
 *
 * PERMISOS ESPECIALES:
 * - Zonas protegidas: CAR, parques naturales
 * - Propiedades privadas: Autorización del propietario
 * - Espacios institucionales: Permiso de la entidad
 * - Zonas arqueológicas: Autorización del Ministerio
 *
 * VALIDACIONES:
 * - nombre_lugar requerido para identificar la locación
 * - municipio_id ayuda a determinar jurisdicción
 * - requiere_permiso_especial marca locaciones críticas
 * - observaciones documentan requisitos especiales
 *
 * USO EN PROCESO PUFAB:
 * - Determina entidades revisoras por jurisdicción
 * - Afecta documentos requeridos (permisos específicos)
 * - Influye en tiempos de aprobación
 * - Base para permisos de filmación por locación
 *
 * INTEGRACIÓN:
 * - Múltiples locaciones por trámite
 * - Cada locación puede requerir permisos diferentes
 * - Visible en interfaces de detalle de trámite
 * - Base para reportes por municipio/zona
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Tramite } from './tramite.entity';
import { Municipio } from '../../catalogos/entities/municipio.entity';
import { TipoEspacio } from '../../catalogos/entities/tipo-espacio.entity';

@Entity('tramite_locaciones')
export class TramiteLocacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tramite_id: number;

  @Column({ nullable: true })
  municipio_id: number;

  @Column({ nullable: true })
  tipo_espacio_id: number;

  @Column({ length: 255 })
  nombre_lugar: string;

  @Column({ length: 255, nullable: true })
  direccion: string;

  @Column({ default: false })
  requiere_permiso_especial: boolean;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @ManyToOne(() => Tramite, (t) => t.locaciones)
  @JoinColumn({ name: 'tramite_id' })
  tramite: Tramite;

  @ManyToOne(() => Municipio)
  @JoinColumn({ name: 'municipio_id' })
  municipio: Municipio;

  @ManyToOne(() => TipoEspacio)
  @JoinColumn({ name: 'tipo_espacio_id' })
  tipo_espacio: TipoEspacio;
}
