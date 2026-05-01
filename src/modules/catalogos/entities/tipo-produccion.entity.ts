/**
 * TIPO-PRODUCCION.ENTITY.TS — TIPOS DE PRODUCCIÓN AUDIOVISUAL SOPORTADOS
 *
 * RESPONSABILIDADES:
 * 1. Definir categorías de producciones audiovisuales
 * 2. Clasificar proyectos por tipo de producción
 * 3. Determinar requisitos específicos por tipo
 * 4. Gestionar tipos activos para nuevos proyectos
 *
 * TIPOS DE PRODUCCIÓN TÍPICOS:
 * - 'documental': Documentales, reportajes, investigación
 * - 'ficcion': Largometrajes, cortometrajes, series de ficción
 * - 'publicidad': Spots publicitarios, comerciales
 * - 'videoclip': Videos musicales, promocionales
 * - 'animacion': Producciones animadas, motion graphics
 * - 'experimental': Proyectos experimentales, artísticos
 * - 'educativo': Contenido educativo, formativo
 * - 'institucional': Videos corporativos, institucionales
 *
 * CAMPOS:
 * - id: ID único autoincremental
 * - nombre: Nombre descriptivo del tipo de producción
 * - descripcion: Características y alcance del tipo
 * - activo: Si está disponible para nuevos proyectos
 *
 * IMPACTO EN PROCESO PUFAB:
 * - Documentos requeridos varían por tipo
 * - Entidades revisoras pueden depender del tipo
 * - Presupuestos y abonos pueden variar
 * - Tiempos de aprobación pueden diferir
 *
 * USO EN SISTEMA:
 * - ProyectosService asocia tipo al crear proyecto
 * - TramitesService determina requisitos por tipo
 * - UI filtra opciones según tipo de producción
 * - Reportes y estadísticas por tipo
 *
 * CONFIGURACIÓN:
 * - Admin puede activar/desactivar tipos
 * - Nuevos tipos pueden agregarse según demanda
 * - Cambios afectan proyectos futuros
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_produccion')
export class TipoProduccion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;
}
