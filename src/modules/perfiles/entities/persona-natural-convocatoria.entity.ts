/**
 * Entidad TypeORM que representa la participación de personas naturales en convocatorias del sistema PUFA.
 *
 * RESPONSABILIDADES:
 * - Registrar participación de personas en convocatorias específicas
 * - Mantener historial de convocatorias por persona natural
 * - Facilitar consultas de elegibilidad para futuras convocatorias
 * - Auditar participación en procesos de selección
 *
 * FLUJO DE USO:
 * - Creado cuando una persona natural participa en convocatoria
 * - Usado para verificar participación previa en procesos similares
 * - Consultada para estadísticas de participación ciudadana
 * - Base para evitar duplicación en convocatorias del mismo tipo
 *
 * CAMPOS IMPORTANTES:
 * - id: Identificador único autogenerado
 * - persona_natural_id: FK a la persona natural participante
 * - tipo_convocatoria_id: FK al tipo de convocatoria participada
 * - fecha_creacion: Timestamp automático de participación
 *
 * RELACIONES:
 * - ManyToOne con TipoConvocatoria: Tipo de convocatoria participada
 * - (Implícita) ManyToOne con PersonaNatural: Persona participante
 *
 * REGLAS DE NEGOCIO:
 * - Una persona puede participar en múltiples convocatorias
 * - Una persona puede participar múltiples veces en mismo tipo de convocatoria
 * - Fecha de creación marca el momento exacto de participación
 * - Usado para control de concurrencia en procesos de selección
 *
 * INTEGRACIÓN CON CONVOCATORIAS:
 * - Vincula personas naturales con procesos de convocatoria
 * - Permite seguimiento de participación ciudadana
 * - Base para reportes de inclusión y participación
 * - Audita cumplimiento de procesos democráticos
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { TipoConvocatoria } from '../../catalogos/entities/tipo-convocatoria.entity';

@Entity('persona_natural_convocatorias')
export class PersonaNaturalConvocatoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  persona_natural_id: number;

  @Column()
  tipo_convocatoria_id: number;

  @CreateDateColumn()
  fecha_creacion: Date;

  @ManyToOne(() => TipoConvocatoria)
  @JoinColumn({ name: 'tipo_convocatoria_id' })
  tipo_convocatoria: TipoConvocatoria;
}
