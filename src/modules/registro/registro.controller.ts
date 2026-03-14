import {
  Controller, Post, Get, Patch, Param, Body,
  Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { RegistroService } from './registro.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('registro')
export class RegistroController {
  constructor(private readonly registroService: RegistroService) {}

  // El usuario envía su solicitud de registro para revisión
  @Post('solicitudes')
  crearSolicitud(@CurrentUser('id') usuarioId: number) {
    return this.registroService.crearSolicitud(usuarioId);
  }

  // Admin lista todas las solicitudes con filtro opcional por estado
  @Roles('admin')
  @Get('solicitudes')
  listar(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    @Query('estado') estado?: string,
  ) {
    return this.registroService.listar(page, limit, estado);
  }

  // Admin revisa y decide sobre una solicitud
  @Roles('admin')
  @Patch('solicitudes/:id/revisar')
  revisar(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: 'aprobado' | 'rechazado' | 'subsanacion',
    @Body('observaciones') observaciones: string,
    @CurrentUser('id') adminId: number,
  ) {
    return this.registroService.revisarSolicitud(id, adminId, estado, observaciones);
  }
}
