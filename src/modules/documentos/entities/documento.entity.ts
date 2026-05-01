/**
 * DOCUMENTO.ENTITY.TS — ENTIDAD PARA GESTIÓN DE ARCHIVOS SUBIDOS
 *
 * RESPONSABILIDADES:
 * 1. Almacenar metadata de archivos subidos al sistema
 * 2. Mantener integridad con hash SHA256
 * 3. Gestionar versionado de documentos
 * 4. Relacionar documentos con usuarios y contextos
 *
 * CAMPOS PRINCIPALES:
 * - id: ID único autoincremental
 * - usuario_id: Propietario del documento
 * - tramite_id: Trámite PUFAB asociado (opcional)
 * - solicitud_registro_id: Solicitud de registro asociada (opcional)
 * - tipo_documento_id: Tipo de documento del catálogo
 * - version: Número de versión (incremental por tipo/contexto)
 * - nombre_original: Nombre original del archivo
 * - nombre_guardado: Nombre único generado en servidor
 * - ruta_archivo: Path completo al archivo en disco
 * - mime_type: Tipo MIME del archivo
 * - tamano_bytes: Tamaño en bytes
 * - hash_sha256: Hash SHA256 para integridad
 * - activo: Si la versión está activa
 *
 * RELACIONES:
 * - usuario: Usuario propietario (ManyToOne)
 * - tipo_documento: Tipo del catálogo (ManyToOne)
 * - tramite: Trámite asociado (ManyToOne, opcional)
 *
 * VERSIONADO:
 * - Cada subida incrementa versión por combinación:
 *   usuario_id + tipo_documento_id + tramite_id/solicitud_registro_id
 * - Solo la versión más alta está activa
 * - Permite re-subir documentos corregidos
 * - Mantiene historial completo
 *
 * HASH SHA256:
 * - Calculado del buffer completo del archivo
 * - 64 caracteres hexadecimales
 * - Verifica integridad al descargar/verificar
 * - Detecta modificaciones no autorizadas
 *
 * CONTEXTOS DE USO:
 * - Registro de usuario: solicitud_registro_id presente
 * - Trámite PUFAB: tramite_id presente
 * - Documentos generales: tramite_id y solicitud_registro_id null
 *
 * SEGURIDAD:
 * - Control de acceso por usuario_id
 * - Hash para verificar integridad
 * - Rutas de archivo no expuestas directamente
 * - Descargas validadas por permisos
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { TipoDocumento } from '../../catalogos/entities/tipo-documento.entity';

@Entity('documentos')
export class Documento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  usuario_id: number;

  // Documento puede pertenecer a solicitud de registro o a trámite
  @Column({ nullable: true })
  solicitud_registro_id: number;

  @Column({ nullable: true })
  tramite_id: number;

  @Column({ nullable: true })
  tipo_documento_id: number;

  // Versioning: permite subir nueva versión del mismo documento
  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ length: 255 })
  nombre_original: string;

  @Column({ length: 255 })
  nombre_guardado: string;

  @Column({ length: 500 })
  ruta_archivo: string;

  @Column({ length: 100, nullable: true })
  mime_type: string;

  @Column({ type: 'bigint', nullable: true })
  tamano_bytes: number;

  // Hash SHA256 para verificación de integridad del archivo
  @Column({ length: 64, nullable: true })
  hash_sha256: string;

  @Column({ length: 50, default: 'pendiente' })
  estado_validacion: string;

  @Column({ type: 'text', nullable: true })
  observaciones_validacion: string;

  @Column({ nullable: true })
  validado_por_usuario_id: number;

  @Column({ type: 'timestamp', nullable: true })
  fecha_validacion: Date;

  @CreateDateColumn()
  fecha_subida: Date;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => TipoDocumento)
  @JoinColumn({ name: 'tipo_documento_id' })
  tipo_documento: TipoDocumento;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'validado_por_usuario_id' })
  validado_por: Usuario;
}
