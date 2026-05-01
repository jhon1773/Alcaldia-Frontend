/**
 * TIPO-IDENTIFICACION.ENTITY.TS — CATÁLOGO DE TIPOS DE DOCUMENTO DE IDENTIFICACIÓN
 *
 * RESPONSABILIDADES:
 * 1. Proveer el listado de documentos de identidad válidos para el registro de personas
 * 2. Garantizar estandarización en la captura del tipo de documento en el sistema
 *
 * CAMPOS:
 * - id:     ID único autoincremental
 * - nombre: Nombre del tipo de documento (ej: 'Cédula de ciudadanía', 'Pasaporte',
 *           'Tarjeta de identidad', 'Cédula de extranjería')
 *
 * INTEGRACIÓN:
 * - Referenciado en PersonaNatural para el campo de tipo de documento de identificación
 * - Usado en formularios de perfil y en procesos de verificación de identidad
 */

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('tipos_identificacion')
export class TipoIdentificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;
}