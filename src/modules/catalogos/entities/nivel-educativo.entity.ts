/**
 * NIVEL-EDUCATIVO.ENTITY.TS — CATÁLOGO DE NIVELES EDUCATIVOS
 *
 * RESPONSABILIDADES:
 * 1. Proveer el listado de niveles de formación académica para el registro de personas
 * 2. Garantizar estandarización en la clasificación educativa del sistema
 *
 * CAMPOS:
 * - id:     ID único autoincremental
 * - nombre: Nombre del nivel educativo (ej: 'Primaria', 'Bachillerato', 'Pregrado', 'Posgrado')
 *
 * INTEGRACIÓN:
 * - Referenciado en PersonaNatural para el campo de nivel de formación académica
 * - Usado en formularios de perfil y en reportes de caracterización de talento humano
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('niveles_educativos')
export class NivelEducativo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;
}