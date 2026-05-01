/**
 * Entidad TypeORM que representa el perfil académico de estudiantes/investigadores en el sistema PUFA.
 *
 * RESPONSABILIDADES:
 * - Gestionar información académica para proyectos estudiantiles
 * - Controlar elegibilidad para estímulos fiscales académicos
 * - Almacenar datos de instituciones educativas y fechas de proyecto
 * - Verificar aval institucional para beneficios fiscales
 *
 * FLUJO DE USO:
 * - Creado por estudiantes/investigadores durante registro
 * - Usado para determinar elegibilidad a vigencias de estímulo fiscal
 * - Verificado por administradores para aprobación de beneficios
 * - Asociado a proyectos académicos con fechas límite
 *
 * CAMPOS IMPORTANTES:
 * - id: Identificador único autogenerado
 * - usuario_id: FK única al usuario académico (OneToOne)
 * - institucion_educativa: Nombre de universidad/centro educativo
 * - fecha_fin_estimada: Fecha límite del proyecto académico
 * - tiene_aval_institucional: Flag de aprobación institucional
 * - observaciones: Notas adicionales sobre el proyecto académico
 *
 * RELACIONES:
 * - OneToOne con Usuario: Usuario académico propietario
 *
 * REGLAS DE NEGOCIO:
 * - Un usuario académico solo puede tener un perfil académico
 * - Fecha fin estimada determina vigencia del estímulo fiscal
 * - Aval institucional requerido para beneficios fiscales
 * - Campos de auditoría automáticos (fechas creación/actualización)
 *
 * INTEGRACIÓN CON ESTÍMULOS FISCALES:
 * - Perfiles académicos dan acceso a VigenciaEstimulo
 * - Fechas de proyecto determinan períodos de beneficio
 * - Aval institucional es requisito para aprobación
 * - Usado en cálculos de descuentos fiscales para proyectos estudiantiles
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToOne, JoinColumn,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('perfiles_academico')
export class PerfilAcademico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  usuario_id: number;

  @Column({ length: 255, nullable: true })
  institucion_educativa: string;

  @Column({ type: 'date', nullable: true })
  fecha_fin_estimada: Date;

  @Column({ default: false })
  tiene_aval_institucional: boolean;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
