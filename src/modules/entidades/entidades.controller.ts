/**
 * Controlador REST para gestión de entidades revisoras externas en el sistema PUFA.
 *
 * RESPONSABILIDADES:
 * - Exponer endpoints CRUD para administración de entidades revisoras
 * - Gestionar permisos de acceso según roles de usuario
 * - Validar requests y delegar lógica de negocio al servicio
 *
 * ENDPOINTS EXPUESTOS:
 * - GET /api/v1/entidades - Listar entidades activas (público)
 * - POST /api/v1/entidades - Crear nueva entidad (admin)
 * - PATCH /api/v1/entidades/:id - Actualizar entidad (admin)
 * - DELETE /api/v1/entidades/:id - Desactivar entidad (admin)
 *
 * AUTORIZACIÓN:
 * - Endpoint público: listar entidades (sin autenticación requerida)
 * - Endpoints de escritura: Requieren rol 'admin' y token JWT válido
 * - Guards aplicados: JwtAuthGuard + RolesGuard
 *
 * VALIDACIÓN:
 * - DTOs validados automáticamente con class-validator
 * - Parámetros de ruta parseados como números enteros
 * - Paginación obligatoria en listados (page, limit)
 *
 * RESPUESTAS ESTÁNDAR:
 * - 200: Operaciones exitosas con datos
 * - 201: Creación exitosa
 * - 401: No autorizado (token inválido)
 * - 403: Prohibido (rol insuficiente)
 * - 404: Recurso no encontrado
 * - 400: Datos inválidos
 *
 * INTERCEPTOR APLICADO:
 * - RespuestaInterceptor: Formatea respuestas con estructura estándar
 */

import {
  Controller, Get, Post, Patch, Delete, Param, Body,
  Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth,
  ApiParam, ApiQuery,
} from '@nestjs/swagger';
import { EntidadesService } from './entidades.service';
import { CrearEntidadDto } from './dto/crear-entidad.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('entidades')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('entidades')
export class EntidadesController {
  constructor(private readonly entidadesService: EntidadesService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Listar entidades revisoras activas',
    description: 'Retorna listado paginado de entidades externas que participan en revisión de trámites. Endpoint público para que productores puedan consultar entidades disponibles.'
  })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Número de página (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, example: 50, description: 'Elementos por página (default: 50)' })
  @ApiResponse({
    status: 200,
    description: 'Listado exitoso de entidades activas con paginación.',
    schema: {
      example: {
        data: [{ id: 1, nombre: 'Alcaldía de Tunja', activo: true }],
        total: 25,
        page: 1,
        lastPage: 1
      }
    }
  })
  listar(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 50,
  ) {
    return this.entidadesService.listar(page, limit);
  }

  @ApiBearerAuth('JWT')
  @Roles('admin')
  @Post()
  @ApiOperation({
    summary: 'Crear nueva entidad revisora',
    description: 'Permite a administradores crear entidades externas para participación en revisiones de trámites.'
  })
  @ApiResponse({ status: 201, description: 'Entidad creada exitosamente.' })
  crear(@Body() dto: CrearEntidadDto) {
    return this.entidadesService.crear(dto);
  }

  @ApiBearerAuth('JWT')
  @Roles('admin')
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar datos de entidad revisora',
    description: 'Permite modificar información de contacto o configuración de entidades existentes.'
  })
  @ApiParam({ name: 'id', description: 'ID único de la entidad a actualizar' })
  @ApiResponse({ status: 200, description: 'Entidad actualizada exitosamente.' })
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CrearEntidadDto>) {
    return this.entidadesService.actualizar(id, dto);
  }

  @ApiBearerAuth('JWT')
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({
    summary: 'Desactivar entidad revisora',
    description: 'Realiza soft delete de la entidad (cambia activo=false). No elimina físicamente para preservar integridad referencial.'
  })
  @ApiParam({ name: 'id', description: 'ID único de la entidad a desactivar' })
  @ApiResponse({ status: 200, description: 'Entidad desactivada exitosamente.' })
  desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.entidadesService.desactivar(id);
  }
}
