/**
 * TIPO-PRODUCCION-PARTICIPA.ENTITY.TS — CATÁLOGO DE TIPOS DE PRODUCCIÓN EN LOS QUE PARTICIPA
 *
 * RESPONSABILIDADES:
 * 1. Clasificar los géneros o formatos de producción audiovisual en los que
 *    personas y organizaciones han participado o tienen experiencia
 * 2. Proveer opciones estandarizadas para formularios y reportes de caracterización
 *
 * CAMPOS:
 * - id:     ID único autoincremental
 * - nombre: Nombre del tipo de producción (ej: 'Largometraje', 'Cortometraje',
 *           'Documental', 'Serie de televisión', 'Publicidad')
 *
 * INTEGRACIÓN:
 * - Referenciado en PersonaNatural y PersonaJuridica para declarar los tipos
 *   de producción en los que se ha participado
 * - Usado en reportes de experiencia y capacidades del ecosistema audiovisual de Boyacá
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_produccion_participa')
export class TipoProduccionParticipa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;
}