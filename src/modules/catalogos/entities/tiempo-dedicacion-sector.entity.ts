/**
 * TIEMPO-DEDICACION-SECTOR.ENTITY.TS — CATÁLOGO DE TIEMPOS DE DEDICACIÓN AL SECTOR
 *
 * RESPONSABILIDADES:
 * 1. Clasificar el tiempo que personas y organizaciones dedican al sector audiovisual
 * 2. Proveer opciones estandarizadas para formularios y reportes de caracterización
 *
 * CAMPOS:
 * - id:     ID único autoincremental
 * - nombre: Descripción del tiempo de dedicación (ej: 'Tiempo completo', 'Medio tiempo', 'Ocasional')
 *
 * INTEGRACIÓN:
 * - Referenciado en PersonaNatural y PersonaJuridica para declarar dedicación al sector
 * - Usado en reportes de actividad y disponibilidad del ecosistema audiovisual de Boyacá
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tiempos_dedicacion_sector')
export class TiempoDedicacionSector {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;
}