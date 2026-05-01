/**
 * SEXO-NACER.ENTITY.TS — CATÁLOGO DE SEXOS AL NACER
 *
 * RESPONSABILIDADES:
 * 1. Proveer las opciones de sexo biológico registrado al nacer para el perfil de personas
 * 2. Diferenciar el campo de sexo al nacer del campo de identidad de género
 *
 * CAMPOS:
 * - id:     ID único autoincremental
 * - nombre: Descripción del sexo al nacer (ej: 'Masculino', 'Femenino', 'Intersexual')
 *
 * NOTA:
 * - Este catálogo corresponde al sexo biológico registrado al nacer
 * - No debe confundirse con IdentidadGenero, que recoge la autopercepción del usuario
 *
 * INTEGRACIÓN:
 * - Referenciado en PersonaNatural para el campo de sexo al nacer
 * - Usado en formularios de perfil y en reportes de caracterización poblacional
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sexos_nacer')
export class SexoNacer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;
}