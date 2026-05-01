/**
 * IDENTIDAD-GENERO.ENTITY.TS — CATÁLOGO DE IDENTIDADES DE GÉNERO
 *
 * RESPONSABILIDADES:
 * 1. Proveer las opciones de identidad de género para el registro de personas
 * 2. Garantizar un trato inclusivo y estandarizado en la caracterización de usuarios
 *
 * CAMPOS:
 * - id:     ID único autoincremental
 * - nombre: Descripción de la identidad de género (ej: 'Mujer', 'Hombre', 'No binario')
 *
 * INTEGRACIÓN:
 * - Referenciado en PersonaNatural para el campo de identidad de género
 * - Usado en formularios de perfil y en reportes de caracterización poblacional
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('identidades_genero')
export class IdentidadGenero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;
}