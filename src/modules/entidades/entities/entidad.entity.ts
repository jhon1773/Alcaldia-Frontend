/**
 * Entidad TypeORM que representa una entidad externa revisora en el sistema PUFA.
 *
 * RESPONSABILIDADES:
 * - Modelar entidades externas que participan en la revisión de trámites PUFA
 * - Almacenar información de contacto para notificaciones del proceso
 * - Mantener relación con catálogos de tipos de entidad y municipios
 *
 * FLUJO DE USO:
 * - Creadas por administradores del sistema vía API
 * - Asignadas automáticamente a trámites según locaciones geográficas
 * - Usadas para enviar notificaciones y recopilar conceptos técnicos
 *
 * CAMPOS IMPORTANTES:
 * - id: Identificador único autogenerado
 * - nombre: Nombre oficial de la entidad (ej: "Alcaldía de Tunja")
 * - tipo_entidad_revision_id: FK a catálogo de tipos (alcaldía, ambiental, aeronáutica, etc.)
 * - municipio_id: FK a catálogo de municipios donde opera
 * - correo_contacto/telefono_contacto: Datos para comunicación del trámite
 * - activo: Flag para soft delete (desactivación lógica)
 *
 * RELACIONES:
 * - ManyToOne con TipoEntidadRevision: Clasificación del tipo de entidad
 * - ManyToOne con Municipio: Ubicación geográfica de operación
 * - OneToMany con TramiteEntidad (implícita): Asignaciones a trámites específicos
 *
 * REGLAS DE NEGOCIO:
 * - Solo entidades activas pueden ser asignadas a nuevos trámites
 * - Los campos de contacto son opcionales pero recomendados para notificaciones
 * - El tipo de entidad determina el rol en el proceso de revisión
 *
 * ÍNDICES Y CONSTRAINTS:
 * - Primary Key: id (autoincremental)
 * - Foreign Keys: tipo_entidad_revision_id, municipio_id (con cascade)
 * - Unique: No aplica (múltiples entidades por tipo/municipio)
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { TipoEntidadRevision } from '../../catalogos/entities/tipo-entidad-revision.entity';
import { Municipio } from '../../catalogos/entities/municipio.entity';

@Entity('entidades')
export class Entidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ nullable: true })
  tipo_entidad_revision_id: number;

  @Column({ nullable: true })
  municipio_id: number;

  @Column({ length: 255, nullable: true })
  correo_contacto: string;

  @Column({ length: 30, nullable: true })
  telefono_contacto: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => TipoEntidadRevision)
  @JoinColumn({ name: 'tipo_entidad_revision_id' })
  tipo_entidad_revision: TipoEntidadRevision;

  @ManyToOne(() => Municipio)
  @JoinColumn({ name: 'municipio_id' })
  municipio: Municipio;
}
