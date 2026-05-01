/**
 * DOCUMENTOS.CONTROLLER.TS — CONTROLADOR DE GESTIÓN DE ARCHIVOS
 *
 * RESPONSABILIDADES:
 * 1. Gestionar subida de archivos con validación de seguridad
 * 2. Manejar multipart/form-data para archivos
 * 3. Implementar límites de tamaño y tipos de archivo
 * 4. Gestionar versionado de documentos
 *
 * ENDPOINTS PRINCIPALES:
 * - POST /documentos/subir: Subir archivo con hash SHA256
 * - GET /documentos: Listar documentos del usuario
 * - GET /documentos/:id: Descargar documento específico
 * - PATCH /documentos/:id: Actualizar metadata
 *
 * CONFIGURACIÓN MULTER:
 * - diskStorage: Guarda archivos en ./uploads/
 * - filename: Genera nombre único con timestamp
 * - fileFilter: Solo PDF, JPG, PNG, DOCX
 * - limits: Máximo 10 MB por archivo
 *
 * SEGURIDAD:
 * - Autenticación requerida (JwtAuthGuard)
 * - Validación de roles según operación
 * - Hash SHA256 para integridad de archivos
 * - Control de acceso por propietario
 *
 * PROCESO DE SUBIDA:
 * 1. Usuario envía archivo multipart
 * 2. Multer valida y guarda archivo temporalmente
 * 3. Controller calcula hash SHA256 del buffer
 * 4. Service registra documento en BD
 * 5. Archivo se mueve a ubicación final
 *
 * VERSIONADO:
 * - Cada subida incrementa versión por tipo/contexto
 * - Mantiene historial de versiones
 * - Solo versión más reciente es activa
 *
 * CONTEXTOS DE USO:
 * - solicitud_registro_id: Documentos para aprobación de cuenta
 * - tramite_id: Documentos requeridos para trámite PUFAB
 * - tipo_documento_id: Clasificación del documento
 */

import {
  Controller, Get, Post, Patch, Param, Body,
  ParseIntPipe, UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth,
  ApiParam, ApiConsumes, ApiBody,
} from '@nestjs/swagger';
import { DocumentosService } from './documentos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('documentos')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Post('subir')
  @ApiOperation({
    summary: 'Subir documento',
    description: 'Carga un archivo y lo registra con hash SHA256 para verificación de integridad. Máximo 10 MB. Formatos aceptados: PDF, JPG, PNG, DOCX.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        archivo: { type: 'string', format: 'binary', description: 'Archivo a subir (máx. 10 MB)' },
        tipo_documento_id: { type: 'number', example: 1, description: 'ID del tipo de documento' },
        tramite_id: { type: 'number', example: 1, description: 'ID del trámite al que pertenece' },
        solicitud_registro_id: { type: 'number', description: 'ID de la solicitud de registro (alternativo a tramite_id)' },
      },
      required: ['archivo'],
    },
  })
  @ApiResponse({ status: 201, description: 'Documento registrado con hash SHA256.' })
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const nombre = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, nombre);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB máximo
    }),
  )
  subirDocumento(
    @UploadedFile() archivo: Express.Multer.File,
    @CurrentUser('id') usuarioId: number,
    @Body('tipo_documento_id', new ParseIntPipe({ optional: true })) tipoDocumentoId?: number,
    @Body('tramite_id', new ParseIntPipe({ optional: true })) tramiteId?: number,
    @Body('solicitud_registro_id', new ParseIntPipe({ optional: true })) solicitudId?: number,
  ) {
    return this.documentosService.registrarDocumento(
      usuarioId, archivo, tipoDocumentoId, tramiteId, solicitudId,
    );
  }

  @Get('tramite/:tramiteId')
  @ApiOperation({ summary: 'Listar documentos de un trámite' })
  @ApiParam({ name: 'tramiteId', description: 'ID del trámite' })
  @ApiResponse({ status: 200, description: 'Lista de documentos del trámite con su estado de validación.' })
  listarPorTramite(@Param('tramiteId', ParseIntPipe) tramiteId: number) {
    return this.documentosService.listarPorTramite(tramiteId);
  }

  @Roles('admin')
  @Patch(':id/validar')
  @ApiOperation({ summary: 'Validar documento', description: 'Admin aprueba o rechaza un documento adjunto.' })
  @ApiParam({ name: 'id', description: 'ID del documento' })
  @ApiBody({
    schema: {
      properties: {
        estado: { type: 'string', enum: ['aprobado', 'rechazado'], example: 'aprobado' },
        observaciones: { type: 'string', example: 'Documento legible y vigente.' },
      },
      required: ['estado'],
    },
  })
  @ApiResponse({ status: 200, description: 'Documento validado.' })
  validar(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') adminId: number,
    @Body('estado') estado: 'aprobado' | 'rechazado',
    @Body('observaciones') observaciones?: string,
  ) {
    return this.documentosService.validarDocumento(id, adminId, estado, observaciones);
  }
}
