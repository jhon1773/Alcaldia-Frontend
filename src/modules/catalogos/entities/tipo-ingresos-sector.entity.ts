/**
 * TIPO-INGRESOS-SECTOR.ENTITY.TS — CATÁLOGO DE TIPOS DE INGRESOS EN EL SECTOR
 *
 * RESPONSABILIDADES:
 * 1. Clasificar las fuentes de ingresos que personas y organizaciones obtienen
 *    dentro del sector audiovisual
 * 2. Proveer opciones estandarizadas para formularios y reportes de caracterización económica
 *
 * CAMPOS:
 * - id:     ID único autoincremental
 * - nombre: Descripción del tipo de ingreso (ej: 'Producción audiovisual', 'Servicios técnicos',
 *           'Docencia', 'Distribución y exhibición')
 *
 * INTEGRACIÓN:
 * - Referenciado en PersonaNatural y PersonaJuridica para declarar la fuente principal
 *   de ingresos proveniente del sector
 * - Usado en reportes de sostenibilidad económica del ecosistema audiovisual de Boyacá
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_ingresos_sector')
export class TipoIngresosSector {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;
}