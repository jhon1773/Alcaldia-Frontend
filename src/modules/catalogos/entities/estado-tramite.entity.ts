/**
 * ESTADO-TRAMITE.ENTITY.TS — ESTADOS POSIBLES DE UN TRÁMITE PUFAB
 *
 * RESPONSABILIDADES:
 * 1. Definir todos los estados posibles en el flujo de un trámite
 * 2. Controlar el orden lógico de los estados
 * 3. Proporcionar colores visuales para UI (semáforo)
 * 4. Mantener catálogo de estados activos/inactivos
 *
 * ESTADOS TÍPICOS DEL FLUJO PUFAB:
 * 1. 'borrador' - Trámite creado, puede editarse
 * 2. 'en_revision' - Enviado para revisión administrativa
 * 3. 'documentos_pendientes' - Faltan documentos requeridos
 * 4. 'pagos_pendientes' - Falta pago de abono
 * 5. 'en_aprobacion_entidades' - Revisión por entidades externas
 * 6. 'aprobado' - Aprobado completamente
 * 7. 'rechazado' - Rechazado con observaciones
 * 8. 'cancelado' - Cancelado por el solicitante
 * 9. 'expirado' - Vencido sin resolución
 *
 * CAMPOS:
 * - id: ID único autoincremental
 * - nombre: Nombre descriptivo del estado
 * - descripcion: Explicación detallada del estado
 * - orden: Número para ordenar estados lógicamente
 * - color_semaforo: Color para UI (verde, amarillo, rojo)
 * - activo: Si el estado está disponible para nuevos trámites
 *
 * USO EN SISTEMA:
 * - TramitesService.cambiarEstado() valida transiciones
 * - UI muestra colores según estado actual
 * - Reportes y estadísticas por estado
 * - Historial registra cambios de estado
 *
 * VALIDACIÓN:
 * - Estados deben seguir orden lógico
 * - Solo estados activos pueden asignarse
 * - Transiciones válidas definidas por negocio
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('estados_tramite')
export class EstadoTramite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: 0 })
  orden: number;

  @Column({ length: 20, nullable: true })
  color_semaforo: string;

  @Column({ default: true })
  activo: boolean;
}
