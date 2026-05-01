/**
 * Entidad TypeORM que representa el perfil profesional de un proveedor audiovisual en el sistema PUFA.
 *
 * RESPONSABILIDADES:
 * - Almacenar información profesional completa de proveedores independientes
 * - Gestionar especializaciones técnicas mediante relaciones many-to-many
 * - Controlar visibilidad y verificación para directorio público
 * - Mantener estado de aprobación/rechazo por administradores
 *
 * FLUJO DE USO:
 * - Creado por proveedores durante registro o actualización de perfil
 * - Revisado por administradores para verificación
 * - Mostrado en directorio público si verificado y visible
 * - Usado para matching con necesidades de proyectos
 *
 * CAMPOS IMPORTANTES:
 * - id: Identificador único autogenerado
 * - usuario_id: FK única al usuario (OneToOne)
 * - descripcion_perfil: Texto descriptivo de servicios y experiencia
 * - experiencia_sector_id: FK a catálogo de rangos de experiencia
 * - sitio_web: URL opcional del portafolio o sitio web
 * - visible_directorio: Control de visibilidad en directorio público
 * - verificado: Flag de verificación por administrador
 * - estado: Estado del perfil ('pendiente', 'aprobado', 'rechazado')
 * - telefono: Contacto adicional
 * - motivo_rechazo: Razón si fue rechazado
 * - activo: Flag de activación del perfil
 *
 * RELACIONES:
 * - OneToOne con Usuario: Usuario propietario del perfil
 * - ManyToOne con RangoExperienciaSector: Nivel de experiencia
 * - ManyToMany con SubcategoriaProveedor: Especializaciones seleccionadas
 * - ManyToMany con EspecialidadProveedor: Habilidades técnicas específicas
 *
 * REGLAS DE NEGOCIO:
 * - Un usuario solo puede tener un perfil de proveedor
 * - Solo perfiles verificados y visibles aparecen en directorio público
 * - Estado 'pendiente' requiere revisión administrativa
 * - Relaciones many-to-many permiten múltiples especializaciones
 * - Campos de auditoría automáticos (fechas creación/actualización)
 *
 * PROCESO DE VERIFICACIÓN:
 * 1. Proveedor crea/actualiza perfil → estado: 'pendiente'
 * 2. Administrador revisa → estado: 'aprobado' o 'rechazado'
 * 3. Si aprobado → verificado: true, puede aparecer en directorio
 * 4. Si rechazado → motivo_rechazo explica la razón
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToOne, ManyToOne, JoinColumn,
  CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { RangoExperienciaSector } from '../../catalogos/entities/rango-experiencia-sector.entity';
import { SubcategoriaProveedor } from './subcategoria-proveedor.entity';
import { EspecialidadProveedor } from './especialidad-proveedor.entity';

@Entity('perfiles_proveedor')
export class PerfilProveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  usuario_id: number;

  @Column({ type: 'text', nullable: true })
  descripcion_perfil: string;

  @Column({ nullable: true })
  experiencia_sector_id: number;

  @Column({ length: 255, nullable: true })
  sitio_web: string;

  @Column({ default: true })
  visible_directorio: boolean;

  @Column({ default: false })
  verificado: boolean;

  @Column({ type: 'varchar', length: 50, default: 'pendiente' })
  estado: string; // 'pendiente', 'aprobado', 'rechazado'

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'text', nullable: true })
  motivo_rechazo: string | null;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => RangoExperienciaSector)
  @JoinColumn({ name: 'experiencia_sector_id' })
  experiencia_sector: RangoExperienciaSector;

  // Relación many-to-many con subcategorías
  @ManyToMany(() => SubcategoriaProveedor)
  @JoinTable({
    name: 'perfil_proveedor_subcategorias',
    joinColumn: { name: 'perfil_proveedor_id' },
    inverseJoinColumn: { name: 'subcategoria_proveedor_id' },
  })
  subcategorias: SubcategoriaProveedor[];

  // Relación many-to-many con especialidades
  @ManyToMany(() => EspecialidadProveedor)
  @JoinTable({
    name: 'perfil_proveedor_especialidades',
    joinColumn: { name: 'perfil_proveedor_id' },
    inverseJoinColumn: { name: 'especialidad_proveedor_id' },
  })
  especialidades: EspecialidadProveedor[];
}
