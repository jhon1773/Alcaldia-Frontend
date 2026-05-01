/**
 * TRAMITES.CONTROLLER.TS — CONTROLADOR DEL MÓDULO DE TRÁMITES
 *
 * RESPONSABILIDADES:
 * 1. Exponer los endpoints HTTP del módulo de trámites (PUFA)
 * 2. Validar autenticación JWT y control de acceso por roles antes de procesar solicitudes
 * 3. Extraer el usuario autenticado y delegar la lógica al servicio correspondiente
 *
 * ENDPOINTS:
 * - GET    /tramites              → Listar trámites paginados con filtro opcional por estado
 * - GET    /tramites/:id          → Obtener un trámite completo con todas sus relaciones
 * - POST   /tramites              → Crear un nuevo trámite PUFA con número de radicado automático
 * - PATCH  /tramites/:id/estado   → Cambiar el estado de un trámite (solo admin y revisor)
 *
 * SEGURIDAD:
 * - Todos los endpoints están protegidos por JwtAuthGuard y RolesGuard
 * - El endpoint de cambio de estado está restringido a los roles 'admin' y 'revisor'
 * - El usuario autenticado se inyecta mediante el decorador @CurrentUser
 * - La autorización por rol (admin/revisor vs solicitante) se resuelve en el servicio
 *
 * INTEGRACIÓN:
 * - Delega toda la lógica de negocio a TramitesService
 * - Usa CrearTramiteDto para validar el cuerpo de las solicitudes de creación
 */

import {
  Controller, Get, Post, Patch, Param, Body,
  Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth,
  ApiParam, ApiQuery, ApiBody,
} from '@nestjs/swagger';
import { TramitesService } from './tramites.service';
import { CrearTramiteDto } from './dto/crear-tramite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('tramites')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tramites')
export class TramitesController {
  constructor(private readonly tramitesService: TramitesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar trámites', description: 'Solicitante ve sus propios trámites. Admin y revisor ven todos.' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'estado', required: false, description: 'Filtrar por ID de estado del trámite' })
  @ApiResponse({ status: 200, description: 'Listado paginado de trámites.' })
  listar(
    @CurrentUser('id') usuarioId: number,
    @CurrentUser('roles') roles: string[],
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    @Query('estado', new ParseIntPipe({ optional: true })) estadoId?: number,
  ) {
    return this.tramitesService.listar(usuarioId, roles, page, limit, estadoId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener trámite completo', description: 'Retorna el trámite con locaciones, equipo técnico e historial de estados.' })
  @ApiParam({ name: 'id', description: 'ID del trámite' })
  @ApiResponse({ status: 200, description: 'Trámite con todas sus relaciones.' })
  @ApiResponse({ status: 404, description: 'Trámite no encontrado.' })
  obtenerPorId(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') usuarioId: number,
    @CurrentUser('roles') roles: string[],
  ) {
    return this.tramitesService.obtenerPorId(id, usuarioId, roles);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear trámite PUFA',
    description: 'Crea una solicitud de permiso de rodaje. Genera número de radicado automático con formato PUFA-YYYYMMDD-XXXXXX. Los compromisos éticos son obligatorios.',
  })
  @ApiResponse({ status: 201, description: 'Trámite creado con número de radicado.' })
  @ApiResponse({ status: 400, description: 'Compromisos éticos no aceptados o datos inválidos.' })
  crear(
    @CurrentUser('id') usuarioId: number,
    @Body() dto: CrearTramiteDto,
  ) {
    return this.tramitesService.crear(usuarioId, dto);
  }

  @Roles('admin', 'revisor')
  @Patch(':id/estado')
  @ApiOperation({ summary: 'Cambiar estado del trámite', description: 'Solo admin y revisor. Registra el cambio en el historial del trámite.' })
  @ApiParam({ name: 'id', description: 'ID del trámite' })
  @ApiBody({
    schema: {
      properties: {
        estado_id: { type: 'number', example: 5, description: 'ID del nuevo estado (ver /catalogos/estados-tramite)' },
        observacion: { type: 'string', example: 'Documentación completa. Permiso aprobado.' },
      },
      required: ['estado_id', 'observacion'],
    },
  })
  @ApiResponse({ status: 200, description: 'Estado actualizado y registrado en historial.' })
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') adminId: number,
    @Body('estado_id', ParseIntPipe) estadoId: number,
    @Body('observacion') observacion: string,
  ) {
    return this.tramitesService.cambiarEstado(id, adminId, estadoId, observacion);
  }
}