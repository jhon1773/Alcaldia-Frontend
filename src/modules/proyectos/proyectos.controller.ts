import {
  Controller, Get, Post, Patch, Param, Body,
  Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CrearProyectoDto } from './dto/crear-proyecto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @Get()
  listar(
    @CurrentUser('id') usuarioId: number,
    @CurrentUser('roles') roles: string[],
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
  ) {
    return this.proyectosService.listar(usuarioId, roles, page, limit);
  }

  @Get(':id')
  obtenerPorId(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') usuarioId: number,
    @CurrentUser('roles') roles: string[],
  ) {
    return this.proyectosService.obtenerPorId(id, usuarioId, roles);
  }

  @Post()
  crear(
    @CurrentUser('id') usuarioId: number,
    @Body() dto: CrearProyectoDto,
  ) {
    return this.proyectosService.crear(usuarioId, dto);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') usuarioId: number,
    @CurrentUser('roles') roles: string[],
    @Body() dto: Partial<CrearProyectoDto>,
  ) {
    return this.proyectosService.actualizar(id, usuarioId, roles, dto);
  }
}
