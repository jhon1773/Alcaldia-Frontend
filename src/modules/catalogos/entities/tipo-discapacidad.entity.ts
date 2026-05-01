/**
 * TIPO-DISCAPACIDAD.ENTITY.TS — CATÁLOGO DE TIPOS DE DISCAPACIDAD
 *
 * RESPONSABILIDADES:
 * 1. Proveer el listado oficial de tipos de discapacidad para el registro de personas
 * 2. Garantizar estandarización en la clasificación de discapacidad del sistema
 *
 * CAMPOS:
 * - id:     ID único autoincremental
 * - nombre: Nombre del tipo de discapacidad (ej: 'Visual', 'Auditiva', 'Cognitiva', 'Motriz')
 *
 * INTEGRACIÓN:
 * - Referenciado en PersonaNatural para el campo de tipo de discapacidad (si aplica)
 * - Usado en formularios de perfil y en reportes de inclusión y diversidad poblacional
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_discapacidad')
export class TipoDiscapacidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;
}