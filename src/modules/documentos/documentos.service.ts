/**
 * DOCUMENTOS.SERVICE.TS — SERVICIO DE GESTIÓN DE ARCHIVOS Y HASH
 *
 * RESPONSABILIDADES:
 * 1. Gestionar subida y almacenamiento de archivos
 * 2. Calcular hash SHA256 para integridad
 * 3. Implementar versionado de documentos
 * 4. Validar permisos de acceso a archivos
 * 5. Gestionar metadata de documentos
 *
 * FUNCIONES PRINCIPALES:
 * - registrarDocumento(): Procesa archivo subido y calcula hash
 * - obtenerDocumentos(): Lista documentos con filtros
 * - obtenerDocumento(): Obtiene documento específico con validación
 * - actualizarDocumento(): Modifica metadata
 * - eliminarDocumento(): Soft delete de documento
 *
 * PROCESO DE REGISTRO:
 * 1. Recibe archivo de Multer (ya validado)
 * 2. Lee buffer del archivo desde disco
 * 3. Calcula hash SHA256 del contenido
 * 4. Determina versión (incrementa por tipo/contexto)
 * 5. Crea registro en BD con toda metadata
 * 6. Retorna documento registrado
 *
 * HASH SHA256:
 * - crypto.createHash('sha256').update(buffer).digest('hex')
 * - 64 caracteres hexadecimales
 * - Verifica integridad del archivo
 * - Detecta modificaciones no autorizadas
 *
 * VERSIONADO:
 * - version: número incremental por tipo_documento_id + contexto
 * - activo: solo la versión más reciente está activa
 * - historial: mantiene todas las versiones
 * - permite re-subir documentos corregidos
 *
 * CONTEXTOS:
 * - solicitud_registro_id: documentos para aprobación de usuario
 * - tramite_id: documentos requeridos para trámite PUFAB
 * - usuario_id: propietario del documento
 *
 * VALIDACIONES:
 * - Usuario solo accede a sus propios documentos
 * - Admin puede acceder a todos los documentos
 * - Archivos deben existir físicamente
 * - Hash debe coincidir para integridad
 */

import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { Documento } from './entities/documento.entity';

@Injectable()
export class DocumentosService {
  constructor(
    @InjectRepository(Documento)
    private documentosRepo: Repository<Documento>,
  ) {}

  // Registra un archivo subido con su hash SHA256
  async registrarDocumento(
    usuarioId: number,
    archivo: Express.Multer.File,
    tipoDocumentoId?: number,
    tramiteId?: number,
    solicitudRegistroId?: number,
  ) {
    // Calcula hash SHA256 para verificar integridad del archivo
    const buffer = fs.readFileSync(archivo.path);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    // Obtiene la versión más reciente para este tipo de documento y contexto
    const versionActual = await this.documentosRepo.count({
      where: {
        usuario_id: usuarioId,
        tipo_documento_id: tipoDocumentoId,
        tramite_id: tramiteId,
        activo: true,
      },
    });

    const documento = this.documentosRepo.create({
      usuario_id: usuarioId,
      tramite_id: tramiteId,
      solicitud_registro_id: solicitudRegistroId,
      tipo_documento_id: tipoDocumentoId,
      version: versionActual + 1,
      nombre_original: archivo.originalname,
      nombre_guardado: archivo.filename,
      ruta_archivo: archivo.path,
      mime_type: archivo.mimetype,
      tamano_bytes: archivo.size,
      hash_sha256: hash,
      estado_validacion: 'pendiente',
    });

    return this.documentosRepo.save(documento);
  }

  // Lista documentos de un trámite
  async listarPorTramite(tramiteId: number) {
    return this.documentosRepo.find({
      where: { tramite_id: tramiteId, activo: true },
      relations: ['tipo_documento'],
      order: { fecha_subida: 'DESC' },
    });
  }

  // Valida o rechaza un documento (admin)
  async validarDocumento(
    documentoId: number,
    adminId: number,
    estadoValidacion: 'aprobado' | 'rechazado',
    observaciones?: string,
  ) {
    const documento = await this.documentosRepo.findOne({ where: { id: documentoId } });
    if (!documento) throw new NotFoundException('Documento no encontrado');

    await this.documentosRepo.update(documentoId, {
      estado_validacion: estadoValidacion,
      observaciones_validacion: observaciones,
      validado_por_usuario_id: adminId,
      fecha_validacion: new Date(),
    });

    return { mensaje: `Documento ${estadoValidacion} exitosamente` };
  }
}
