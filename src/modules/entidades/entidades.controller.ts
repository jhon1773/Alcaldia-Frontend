import {
  Controller, Get, Post, Patch, Delete, Param, Body,
  Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { EntidadesService } from './entidades.service';
import { CrearEntidadDto } from './dto/crear-entidad.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('entidades')
export class EntidadesController {
  constructor(private readonly entidadesService: EntidadesService) {}

  @Public()
  @Get()
  listar(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 50,
  ) {
    return this.entidadesService.listar(page, limit);
  }

  @Roles('admin')
  @Post()
  crear(@Body() dto: CrearEntidadDto) {
    return this.entidadesService.crear(dto);
  }

  @Roles('admin')
  @Patch(':id')
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CrearEntidadDto>) {
    return this.entidadesService.actualizar(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.entidadesService.desactivar(id);
  }
}
