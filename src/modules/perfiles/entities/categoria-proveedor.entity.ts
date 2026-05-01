/**
 * Entidad TypeORM que representa una categoría de proveedores en el sistema PUFA.
 *
 * RESPONSABILIDADES:
 * - Definir las categorías principales de proveedores audiovisuales
 * - Servir como raíz de la jerarquía: Categoría → Subcategoría → Especialidad
 * - Mantener catálogo organizado para clasificación de proveedores
 *
 * FLUJO DE USO:
 * - Usada en formularios de registro de proveedores para selección de especialización
 * - Consultada públicamente para mostrar catálogo de servicios disponibles
 * - Base para filtros en directorio de proveedores
 *
 * CAMPOS IMPORTANTES:
 * - id: Identificador único autogenerado
 * - codigo: Código único de 50 caracteres (ej: "PROD", "POST", "SON", "ILU")
 * - nombre: Nombre descriptivo de la categoría (ej: "Producción", "Postproducción")
 * - descripcion: Texto explicativo opcional de la categoría
 * - activo: Flag para activar/desactivar categorías
 *
 * RELACIONES:
 * - OneToMany con SubcategoriaProveedor: Una categoría tiene múltiples subcategorías
 * - (Indirecta) ManyToMany con PerfilProveedor: Proveedores se especializan en categorías
 *
 * REGLAS DE NEGOCIO:
 * - Código debe ser único en toda la tabla
 * - Solo categorías activas se muestran en interfaces públicas
 * - Jerarquía de 3 niveles: Categoría → Subcategoría → Especialidad
 *
 * EJEMPLOS DE CATEGORÍAS:
 * - Producción: Dirección, Producción Ejecutiva, Asistencia de Dirección
 * - Postproducción: Edición, Colorización, Efectos Visuales
 * - Sonido: Grabación, Mezcla, Diseño Sonoro
 * - Iluminación: Dirección de Fotografía, Gaffer, Eléctrico
 */

import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';
import { SubcategoriaProveedor } from './subcategoria-proveedor.entity';

@Entity('categorias_proveedor')
export class CategoriaProveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  codigo: string;

  @Column({ length: 200 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => SubcategoriaProveedor, (s) => s.categoria)
  subcategorias: SubcategoriaProveedor[];
}
