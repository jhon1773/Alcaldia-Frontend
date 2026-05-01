/**
 * VIGENCIA-ESTIMULO.ENTITY.TS — ENTIDAD PARA VIGENCIAS DE ESTÍMULOS
 *
 * RESPONSABILIDADES:
 * 1. Gestionar vigencias anuales de estímulos fiscales
 * 2. Relacionar estímulos con personas jurídicas
 * 3. Mantener historial de beneficios tributarios
 * 4. Controlar vigencias activas por año
 *
 * CAMPOS PRINCIPALES:
 * - id: ID único autoincremental
 * - persona_juridica_id: Empresa beneficiaria del estímulo
 * - vigencia: Año de la vigencia (ej: 2024, 2025)
 * - descripcion: Detalle del estímulo o beneficio
 * - fecha_creacion: Fecha de registro del estímulo
 *
 * RELACIONES:
 * - persona_juridica: Empresa que recibe el estímulo (ManyToOne)
 * - Relación bidireccional con PersonaJuridica.vigencias_estimulos
 *
 * PROPÓSITO EN PUFAB:
 * - Las empresas productoras pueden recibir estímulos fiscales
 * - Los estímulos tienen vigencia anual
 * - Se debe mantener historial de beneficios otorgados
 * - Puede afectar requisitos o prioridades en trámites
 *
 * EJEMPLOS DE ESTÍMULOS:
 * - Descuentos en impuestos por producción audiovisual
 * - Subsidios para proyectos en zonas especiales
 * - Beneficios por contratación de talento local
 * - Incentivos por producción en Boyacá
 *
 * VALIDACIONES:
 * - vigencia debe ser un año válido (1900-2100)
 * - descripcion no puede estar vacía
 * - persona_juridica_id debe existir
 *
 * USO EN SISTEMA:
 * - Verificación de elegibilidad para estímulos
 * - Reportes de beneficios otorgados
 * - Cálculos de descuentos en trámites
 * - Auditoría de incentivos fiscales
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { PersonaJuridica } from './persona-juridica.entity';

@Entity('persona_juridica_vigencias_estimulos')
export class VigenciaEstimulo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  persona_juridica_id: number;

  @Column({ type: 'int', comment: 'Año de la vigencia del estímulo' })
  vigencia: number;

  @Column({ type: 'text' })
  descripcion: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @ManyToOne(() => PersonaJuridica, (pj) => pj.vigencias_estimulos)
  @JoinColumn({ name: 'persona_juridica_id' })
  persona_juridica: PersonaJuridica;
}
