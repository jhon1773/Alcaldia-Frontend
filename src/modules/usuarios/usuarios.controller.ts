import {
  Controller, Get, Post, Patch, Param, Body,
  Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearPersonaNaturalDto } from './dto/crear-persona-natural.dto';
import { CrearPersonaJuridicaDto } from './dto/crear-persona-juridica.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Lista todos los usuarios (solo admin)
  @Roles('admin')
  @Get()
  listar(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
  ) {
    return this.usuariosService.listar(page, limit);
  }

  // Obtiene un usuario por ID (solo admin)
  @Roles('admin')
  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.obtenerPorId(id);
  }

  // El usuario autenticado completa su perfil de persona natural
  @Patch('perfil/natural')
  completarPerfilNatural(
    @CurrentUser('id') usuarioId: number,
    @Body() dto: CrearPersonaNaturalDto,
  ) {
    return this.usuariosService.completarPerfilNatural(usuarioId, dto);
  }

  // El usuario autenticado completa su perfil de persona jurídica
  @Patch('perfil/juridica')
  completarPerfilJuridica(
    @CurrentUser('id') usuarioId: number,
    @Body() dto: CrearPersonaJuridicaDto,
  ) {
    return this.usuariosService.completarPerfilJuridica(usuarioId, dto);
  }

  // Admin aprueba o rechaza un usuario
  @Roles('admin')
  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: string,
    @Body('observaciones') observaciones: string,
    @CurrentUser('id') adminId: number,
  ) {
    return this.usuariosService.cambiarEstado(id, estado, adminId, observaciones);
  }

  // Admin asigna rol a un usuario
  @Roles('admin')
  @Post(':id/roles/:rolId')
  asignarRol(
    @Param('id', ParseIntPipe) usuarioId: number,
    @Param('rolId', ParseIntPipe) rolId: number,
    @CurrentUser('id') adminId: number,
  ) {
    return this.usuariosService.asignarRol(usuarioId, rolId, adminId);
  }
}
