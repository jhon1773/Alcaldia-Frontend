/**
 * PROYECTO.ENTITY.TS — ENTIDAD PARA PROYECTOS AUDIOVISUALES
 *
 * RESPONSABILIDADES:
 * 1. Representar proyectos audiovisuales en el sistema
 * 2. Servir como base para creación de trámites PUFAB
 * 3. Gestionar información básica del proyecto
 * 4. Relacionar proyectos con usuarios y trámites
 *
 * CAMPOS PRINCIPALES:
 * - id: ID único autoincremental
 * - usuario_id: Productor propietario del proyecto
 * - tipo_produccion_id: Tipo de producción audiovisual
 * - nombre_proyecto: Título del proyecto
 * - sinopsis: Descripción breve del proyecto
 * - municipio_principal_id: Municipio principal de rodaje
 * - fecha_inicio_prevista: Fecha estimada de inicio
 * - fecha_fin_prevista: Fecha estimada de finalización
 * - presupuesto_total: Presupuesto en pesos colombianos
 * - estado_proyecto: Estado actual ('borrador', 'activo', 'completado')
 *
 * RELACIONES:
 * - usuario: Productor que creó el proyecto (ManyToOne)
 * - tipo_produccion: Categoría del proyecto (ManyToOne)
 * - municipio: Ubicación principal (ManyToOne)
 * - tramites: Trámites PUFAB asociados (OneToMany)
 *
 * ESTADOS DEL PROYECTO:
 * - 'borrador': Proyecto creado, puede editarse
 * - 'activo': Proyecto activo, puede crear trámites
 * - 'completado': Proyecto finalizado
 * - 'cancelado': Proyecto cancelado
 *
 * CICLO DE VIDA:
 * 1. CREACIÓN: Productor crea proyecto en estado 'borrador'
 * 2. DESARROLLO: Proyecto se edita y completa información
 * 3. ACTIVACIÓN: Proyecto pasa a 'activo' cuando está listo
 * 4. USO: Se crean trámites PUFAB basados en el proyecto
 * 5. COMPLETACIÓN: Proyecto se marca como completado
 *
 * VALIDACIONES:
 * - usuario_id no puede ser null
 * - nombre_proyecto único por usuario
 * - presupuesto_total debe ser positivo si se especifica
 * - Fechas deben ser lógicas (fin > inicio)
 *
 * INTEGRACIÓN CON PUFAB:
 * - Obligatorio para crear trámite
 * - Presupuesto determina abono requerido (30%)
 * - Tipo de producción afecta documentos requeridos
 * - Municipio puede requerir permisos específicos
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { TipoProduccion } from '../../catalogos/entities/tipo-produccion.entity';
import { Municipio } from '../../catalogos/entities/municipio.entity';

@Entity('proyectos')
export class Proyecto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario_id: number;

  @Column({ nullable: true })
  tipo_produccion_id: number;

  @Column({ length: 255 })
  nombre_proyecto: string;

  @Column({ type: 'text', nullable: true })
  sinopsis: string;

  @Column({ nullable: true })
  municipio_principal_id: number;

  @Column({ type: 'date', nullable: true })
  fecha_inicio_prevista: Date;

  @Column({ type: 'date', nullable: true })
  fecha_fin_prevista: Date;

  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
  presupuesto_total: number;

  @Column({ length: 50, default: 'borrador' })
  estado_proyecto: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => TipoProduccion)
  @JoinColumn({ name: 'tipo_produccion_id' })
  tipo_produccion: TipoProduccion;

  @ManyToOne(() => Municipio)
  @JoinColumn({ name: 'municipio_principal_id' })
  municipio_principal: Municipio;
}
