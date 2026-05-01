/**
 * Entidad TypeORM que representa una especialidad específica de proveedores en el sistema PUFA.
 *
 * RESPONSABILIDADES:
 * - Definir especialidades técnicas más específicas dentro de subcategorías
 * - Nivel más granular de la jerarquía: Categoría → Subcategoría → Especialidad
 * - Permitir clasificación muy detallada de habilidades profesionales
 *
 * FLUJO DE USO:
 * - Seleccionada por proveedores para mostrar especialización técnica precisa
 * - Usada para búsquedas muy específicas en directorio de proveedores
 * - Base para matching automático en convocatorias de proyectos
 *
 * CAMPOS IMPORTANTES:
 * - id: Identificador único autogenerado
 * - subcategoria_proveedor_id: FK a la subcategoría padre
 * - codigo: Código único de 50 caracteres dentro del sistema
 * - nombre: Nombre técnico específico de la especialidad
 * - descripcion: Explicación detallada de la especialidad
 * - activo: Flag para activar/desactivar especialidades
 *
 * RELACIONES:
 * - ManyToOne con SubcategoriaProveedor: Pertenencia a una subcategoría
 * - ManyToMany con PerfilProveedor: Proveedores pueden tener múltiples especialidades
 *
 * REGLAS DE NEGOCIO:
 * - Código debe ser único en toda la tabla
 * - Solo especialidades activas se muestran en interfaces
 * - Un proveedor puede tener múltiples especialidades de diferentes subcategorías
 * - Especialidades permiten matching muy preciso para necesidades técnicas específicas
 *
 * EJEMPLOS DE ESPECIALIDADES:
 * - Dirección: Dirección de Cine, Dirección de Documental, Dirección de Comercial
 * - Fotografía: Cinematografía Digital, Fotografía de Producto, Drone Operator
 * - Edición: Edición Avid, Edición Premiere, Edición DaVinci Resolve
 * - Sonido: Boom Operator, Sound Designer, Re-recording Mixer
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { SubcategoriaProveedor } from './subcategoria-proveedor.entity';

@Entity('especialidades_proveedor')
export class EspecialidadProveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subcategoria_proveedor_id: number;

  @Column({ length: 50, unique: true })
  codigo: string;

  @Column({ length: 200 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => SubcategoriaProveedor, (s) => s.especialidades)
  @JoinColumn({ name: 'subcategoria_proveedor_id' })
  subcategoria: SubcategoriaProveedor;
}
