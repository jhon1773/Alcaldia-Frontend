/**
 * Entidad TypeORM que representa una subcategoría de proveedores en el sistema PUFA.
 *
 * RESPONSABILIDADES:
 * - Definir subcategorías dentro de cada categoría de proveedores
 * - Nivel intermedio de la jerarquía: Categoría → Subcategoría → Especialidad
 * - Permitir clasificación granular de especializaciones profesionales
 *
 * FLUJO DE USO:
 * - Seleccionada por proveedores durante registro de perfil
 * - Usada para filtrado avanzado en directorio de proveedores
 * - Base para estadísticas de distribución de especializaciones
 *
 * CAMPOS IMPORTANTES:
 * - id: Identificador único autogenerado
 * - categoria_proveedor_id: FK a la categoría padre
 * - codigo: Código único de 50 caracteres dentro de la categoría
 * - nombre: Nombre descriptivo de la subcategoría
 * - descripcion: Texto explicativo opcional
 * - activo: Flag para activar/desactivar subcategorías
 *
 * RELACIONES:
 * - ManyToOne con CategoriaProveedor: Pertenencia a una categoría
 * - OneToMany con EspecialidadProveedor: Contiene múltiples especialidades
 * - ManyToMany con PerfilProveedor: Proveedores pueden tener múltiples subcategorías
 *
 * REGLAS DE NEGOCIO:
 * - Código debe ser único en toda la tabla (no solo por categoría)
 * - Solo subcategorías activas se muestran en interfaces
 * - Un proveedor puede seleccionar múltiples subcategorías de diferentes categorías
 *
 * EJEMPLOS DE SUBCATEGORÍAS:
 * - Producción: Dirección de Actores, Dirección de Fotografía, Producción Ejecutiva
 * - Postproducción: Edición Lineal, Edición No Lineal, Color Grading
 * - Sonido: Grabación en Set, Foley, Mezcla Final
 * - Iluminación: Iluminación de Studio, Iluminación de Locación, Luces Prácticas
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { CategoriaProveedor } from './categoria-proveedor.entity';
import { EspecialidadProveedor } from './especialidad-proveedor.entity';

@Entity('subcategorias_proveedor')
export class SubcategoriaProveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoria_proveedor_id: number;

  @Column({ length: 50, unique: true })
  codigo: string;

  @Column({ length: 200 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => CategoriaProveedor, (c) => c.subcategorias)
  @JoinColumn({ name: 'categoria_proveedor_id' })
  categoria: CategoriaProveedor;

  @OneToMany(() => EspecialidadProveedor, (e) => e.subcategoria)
  especialidades: EspecialidadProveedor[];
}
