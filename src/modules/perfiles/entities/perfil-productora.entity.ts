/**
 * Entidad TypeORM que representa el perfil de una productora audiovisual en el sistema PUFA.
 *
 * RESPONSABILIDADES:
 * - Almacenar información corporativa de productoras cinematográficas
 * - Gestionar presencia pública en el directorio de productoras
 * - Mantener datos de contacto y experiencia sectorial
 * - Controlar visibilidad y verificación administrativa
 *
 * FLUJO DE USO:
 * - Creado por productoras durante proceso de registro
 * - Actualizado por usuarios con rol 'productora'
 * - Mostrado en directorio público si verificado y visible
 * - Usado para networking y colaboración entre productoras
 *
 * CAMPOS IMPORTANTES:
 * - id: Identificador único autogenerado
 * - usuario_id: FK única al usuario corporativo (OneToOne)
 * - nombre_publico: Nombre comercial de la productora
 * - experiencia_sector_id: FK a catálogo de rangos de experiencia
 * - descripcion_empresa: Historia y enfoque de la productora
 * - sitio_web: URL del sitio web oficial
 * - visible_directorio: Control de aparición en directorio público
 * - verificado: Flag de verificación por administrador
 *
 * RELACIONES:
 * - OneToOne con Usuario: Usuario corporativo propietario
 * - ManyToOne con RangoExperienciaSector: Nivel de experiencia organizacional
 *
 * REGLAS DE NEGOCIO:
 * - Un usuario corporativo solo puede tener un perfil de productora
 * - Solo perfiles verificados aparecen en directorio público
 * - Campos de auditoría automáticos (fechas creación/actualización)
 * - Verificación opcional (productoras pueden operar sin verificación inicial)
 *
 * DIFERENCIAS CON PERFIL PROVEEDOR:
 * - Enfocado en empresa vs. profesional independiente
 * - Menos especializaciones técnicas (productoras contratan proveedores)
 * - Verificación menos estricta que proveedores individuales
 * - Enfoque en networking corporativo vs. servicios técnicos
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToOne, ManyToOne, JoinColumn,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { RangoExperienciaSector } from '../../catalogos/entities/rango-experiencia-sector.entity';

@Entity('perfiles_productora')
export class PerfilProductora {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  usuario_id: number;

  @Column({ length: 255, nullable: true })
  nombre_publico: string;

  @Column({ nullable: true })
  experiencia_sector_id: number;

  @Column({ type: 'text', nullable: true })
  descripcion_empresa: string;

  @Column({ length: 255, nullable: true })
  sitio_web: string;

  @Column({ default: true })
  visible_directorio: boolean;

  @Column({ default: false })
  verificado: boolean;

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
}
