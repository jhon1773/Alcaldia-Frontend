/**
 * GAMA-EQUIPOS.ENTITY.TS — CATÁLOGO DE GAMAS DE EQUIPOS
 *
 * RESPONSABILIDADES:
 * 1. Clasificar los equipos técnicos según su gama o nivel de calidad
 * 2. Servir como catálogo de referencia para la caracterización de equipos
 *
 * CAMPOS:
 * - id:     ID único autoincremental
 * - nombre: Nombre descriptivo de la gama (ej: 'Profesional', 'Semiprofesional', 'Doméstica')
 *
 * INTEGRACIÓN:
 * - Referenciado en el módulo de equipos técnicos de productoras y proveedores
 * - Usado en formularios de registro y actualización de inventario de equipos
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('gamas_equipos')
export class GamaEquipos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;
}