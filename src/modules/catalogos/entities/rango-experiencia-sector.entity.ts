/**
 * RANGO-EXPERIENCIA-SECTOR.ENTITY.TS — CATÁLOGO DE RANGOS DE EXPERIENCIA EN EL SECTOR
 *
 * RESPONSABILIDADES:
 * 1. Clasificar la experiencia de personas y organizaciones en el sector audiovisual
 * 2. Proveer rangos estandarizados para formularios y reportes de caracterización
 *
 * CAMPOS:
 * - id:     ID único autoincremental
 * - nombre: Descripción del rango (ej: 'Menos de 1 año', 'De 1 a 3 años', 'Más de 10 años')
 *
 * INTEGRACIÓN:
 * - Referenciado en PersonaNatural y PersonaJuridica para declarar experiencia sectorial
 * - Usado en reportes de madurez y trayectoria del sector audiovisual de Boyacá
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('rangos_experiencia_sector')
export class RangoExperienciaSector {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;
}