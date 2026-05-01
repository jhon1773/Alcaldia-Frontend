/**
 * TIPO-ENTIDAD.ENTITY.TS — CATÁLOGO DE TIPOS DE ENTIDAD
 *
 * RESPONSABILIDADES:
 * 1. Clasificar las entidades que interactúan con el sistema según su naturaleza jurídica
 * 2. Permitir diferenciar el tratamiento y los flujos según el tipo de entidad
 * 3. Habilitar o deshabilitar tipos según las necesidades del sistema
 *
 * CAMPOS:
 * - id:          ID único autoincremental
 * - nombre:      Nombre del tipo de entidad (ej: 'Pública', 'Privada', 'Mixta', 'Sin ánimo de lucro')
 * - descripcion: Explicación del alcance y características del tipo (opcional)
 * - activo:      Si el tipo está disponible para asignarse a entidades del sistema
 *
 * INTEGRACIÓN:
 * - Referenciado en PersonaJuridica para clasificar la naturaleza de la organización
 * - Usado en formularios de registro de personas jurídicas y en reportes de
 *   caracterización del ecosistema audiovisual
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_entidad')
export class TipoEntidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;
}