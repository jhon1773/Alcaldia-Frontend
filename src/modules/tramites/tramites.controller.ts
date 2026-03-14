import {
  Controller, Get, Post, Patch, Param, Body,
  Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { TramitesService } from './tramites.service';
import { CrearTramiteDto } from './dto/crear-tramite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tramites')
export class TramitesController {
  constructor(private readonly tramitesService: TramitesService) {}

  @Get()
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
  obtenerPorId(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') usuarioId: number,
    @CurrentUser('roles') roles: string[],
  ) {
    return this.tramitesService.obtenerPorId(id, usuarioId, roles);
  }

  @Post()
  crear(
    @CurrentUser('id') usuarioId: number,
    @Body() dto: CrearTramiteDto,
  ) {
    return this.tramitesService.crear(usuarioId, dto);
  }

  // Cambia el estado de un trámite — solo admin y revisor
  @Roles('admin', 'revisor')
  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') adminId: number,
    @Body('estado_id', ParseIntPipe) estadoId: number,
    @Body('observacion') observacion: string,
  ) {
    return this.tramitesService.cambiarEstado(id, adminId, estadoId, observacion);
  }
}
