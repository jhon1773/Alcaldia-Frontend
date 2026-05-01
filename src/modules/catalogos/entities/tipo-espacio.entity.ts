/**
 * TIPO-ESPACIO.ENTITY.TS — CATÁLOGO DE TIPOS DE ESPACIO
 *
 * RESPONSABILIDADES:
 * 1. Clasificar los espacios físicos o virtuales disponibles en el sistema
 * 2. Permitir diferenciar el uso y las condiciones de cada tipo de espacio
 * 3. Habilitar o deshabilitar tipos según las necesidades del sistema
 *
 * CAMPOS:
 * - id:          ID único autoincremental
 * - nombre:      Nombre del tipo de espacio (ej: 'Sala de edición', 'Estudio de grabación', 'Locación exterior')
 * - descripcion: Explicación de las características y usos del tipo de espacio (opcional)
 * - activo:      Si el tipo está disponible para asignarse a espacios del catálogo
 *
 * INTEGRACIÓN:
 * - Referenciado en la entidad de espacios para clasificar la infraestructura disponible
 * - Usado en formularios de registro de espacios y en reportes de oferta de infraestructura
 *   del sector audiovisual
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_espacio')
export class TipoEspacio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;
}