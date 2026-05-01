/**
 * TIPO-CONVOCATORIA.ENTITY.TS — CATÁLOGO DE TIPOS DE CONVOCATORIA
 *
 * RESPONSABILIDADES:
 * 1. Clasificar las convocatorias del sistema según su naturaleza y propósito
 * 2. Permitir filtrar y organizar convocatorias por tipo en la plataforma
 * 3. Habilitar o deshabilitar tipos según las necesidades del sistema
 *
 * CAMPOS:
 * - id:          ID único autoincremental
 * - nombre:      Nombre del tipo de convocatoria (ej: 'Fomento', 'Estímulo', 'Beca')
 * - descripcion: Explicación del alcance y características del tipo (opcional)
 * - activo:      Si el tipo está disponible para asignarse a nuevas convocatorias
 *
 * INTEGRACIÓN:
 * - Referenciado en la entidad Convocatoria para clasificar cada llamado público
 * - Usado en filtros de búsqueda y en reportes de gestión de convocatorias
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_convocatoria')
export class TipoConvocatoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;
}