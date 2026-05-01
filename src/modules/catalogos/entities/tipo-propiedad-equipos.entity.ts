/**
 * TIPO-PROPIEDAD-EQUIPOS.ENTITY.TS — CATÁLOGO DE TIPOS DE PROPIEDAD DE EQUIPOS
 *
 * RESPONSABILIDADES:
 * 1. Clasificar la modalidad de tenencia de los equipos técnicos declarados
 * 2. Proveer opciones estandarizadas para formularios y reportes de inventario
 *
 * CAMPOS:
 * - id:     ID único autoincremental
 * - nombre: Descripción de la modalidad de propiedad (ej: 'Propio', 'Arrendado',
 *           'En comodato', 'Leasing')
 *
 * INTEGRACIÓN:
 * - Referenciado en la entidad de equipos técnicos para indicar cómo el usuario
 *   dispone de cada equipo en su inventario
 * - Usado en reportes de capacidad técnica y estructura de activos del sector audiovisual
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_propiedad_equipos')
export class TipoPropiedadEquipos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;
}