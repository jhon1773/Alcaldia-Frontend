/**
 * GRUPO-ETNICO.ENTITY.TS — CATÁLOGO DE GRUPOS ÉTNICOS
 *
 * RESPONSABILIDADES:
 * 1. Proveer el listado oficial de grupos étnicos para el registro de personas
 * 2. Garantizar estandarización en la clasificación étnica del sistema
 *
 * CAMPOS:
 * - id:     ID único autoincremental
 * - nombre: Nombre del grupo étnico (ej: 'Indígena', 'Afrocolombiano', 'Mestizo', 'Rom')
 *
 * INTEGRACIÓN:
 * - Referenciado en PersonaNatural para el campo de autorreconocimiento étnico
 * - Usado en formularios de perfil y en reportes de caracterización poblacional
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('grupos_etnicos')
export class GrupoEtnico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;
}