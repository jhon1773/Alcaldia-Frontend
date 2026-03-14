import {
  Controller, Get, Post, Patch, Param, Body,
  ParseIntPipe, UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentosService } from './documentos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  // Sube un archivo y lo registra como documento del trámite
  @Post('subir')
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

  // Lista documentos de un trámite específico
  @Get('tramite/:tramiteId')
  listarPorTramite(@Param('tramiteId', ParseIntPipe) tramiteId: number) {
    return this.documentosService.listarPorTramite(tramiteId);
  }

  // Admin valida o rechaza un documento
  @Roles('admin')
  @Patch(':id/validar')
  validar(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') adminId: number,
    @Body('estado') estado: 'aprobado' | 'rechazado',
    @Body('observaciones') observaciones?: string,
  ) {
    return this.documentosService.validarDocumento(id, adminId, estado, observaciones);
  }
}
