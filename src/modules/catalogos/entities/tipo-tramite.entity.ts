/**
 * TIPO-TRAMITE.ENTITY.TS — CATÁLOGO DE TIPOS DE TRÁMITE
 *
 * RESPONSABILIDADES:
 * 1. Clasificar los trámites disponibles en el sistema según su naturaleza y propósito
 * 2. Permitir diferenciar los flujos, requisitos y revisiones según el tipo de trámite
 * 3. Habilitar o deshabilitar tipos según las necesidades del sistema
 *
 * CAMPOS:
 * - id:          ID único autoincremental
 * - nombre:      Nombre del tipo de trámite (ej: 'Solicitud de apoyo', 'Inscripción a convocatoria',
 *                'Registro de proyecto')
 * - descripcion: Explicación del alcance y proceso asociado al tipo de trámite (opcional)
 * - activo:      Si el tipo está disponible para la creación de nuevos trámites
 *
 * INTEGRACIÓN:
 * - Referenciado en la entidad Tramite para determinar el tipo de proceso que se gestiona
 * - TramitesService aplica reglas de negocio específicas según el tipo de trámite
 * - Usado en filtros de búsqueda, reportes de gestión y panel de seguimiento de trámites
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_tramite')
export class TipoTramite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;
}