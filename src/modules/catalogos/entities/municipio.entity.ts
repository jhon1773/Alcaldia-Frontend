/**
 * MUNICIPIO.ENTITY.TS — CATÁLOGO DE MUNICIPIOS
 *
 * RESPONSABILIDADES:
 * 1. Proveer el listado de municipios disponibles para el registro de personas y trámites
 * 2. Asociar cada municipio a su departamento correspondiente
 *
 * CAMPOS:
 * - id:           ID único autoincremental
 * - nombre:       Nombre del municipio (ej: 'Tunja', 'Duitama', 'Sogamoso')
 * - departamento: Departamento al que pertenece el municipio (default: 'Boyacá')
 *
 * NOTA:
 * - El sistema está orientado al departamento de Boyacá, por lo que
 *   el valor por defecto del departamento es 'Boyacá'
 * - Puede extenderse a otros departamentos si el alcance del sistema crece
 *
 * INTEGRACIÓN:
 * - Referenciado en PersonaNatural y PersonaJuridica para municipio de residencia
 * - Usado en formularios de registro y en reportes geográficos de cobertura
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('municipios')
export class Municipio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 150, default: 'Boyacá' })
  departamento: string;
}