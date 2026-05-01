/**
 * TIPO-PERFIL.ENTITY.TS — CATÁLOGO DE TIPOS DE PERFIL DE USUARIO
 *
 * RESPONSABILIDADES:
 * 1. Definir los perfiles disponibles para clasificar a los usuarios del sistema
 * 2. Servir como referencia para el control de acceso y la segmentación de funcionalidades
 * 3. Habilitar o deshabilitar perfiles según las necesidades del sistema
 *
 * CAMPOS:
 * - id:          ID único autoincremental
 * - codigo:      Código único para lógica de negocio (ej: 'productora', 'proveedor', 'academico')
 * - nombre:      Nombre descriptivo del tipo de perfil (ej: 'Productora', 'Proveedor de servicios')
 * - descripcion: Explicación del alcance y características del perfil (opcional)
 * - activo:      Si el tipo de perfil está disponible para asignarse a usuarios
 *
 * INTEGRACIÓN:
 * - Referenciado en Usuario para definir el tipo de perfil del usuario registrado
 * - AuthService verifica el tipo_perfil al hacer login con rolSolicitado
 * - JwtStrategy embebe el tipoPerfil en el payload del token JWT
 * - Usado en formularios de registro y en reportes de distribución de usuarios por perfil
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_perfil')
export class TipoPerfil {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  codigo: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;
}