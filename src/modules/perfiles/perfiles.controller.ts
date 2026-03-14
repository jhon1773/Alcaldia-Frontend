import {
  Controller, Get, Post, Patch, Param, Body,
  Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { PerfilesService } from './perfiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('perfiles')
export class PerfilesController {
  constructor(private readonly perfilesService: PerfilesService) {}

  // Catálogo de categorías/subcategorías/especialidades de proveedores (público)
  @Public()
  @Get('categorias')
  obtenerCategorias() {
    return this.perfilesService.obtenerCatalogoCategorias();
  }

  // Directorio público de proveedores verificados
  @Public()
  @Get('proveedores/directorio')
  directorio(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    @Query('subcategoria', new ParseIntPipe({ optional: true })) subcategoriaId?: number,
  ) {
    return this.perfilesService.listarDirectorioProveedores(page, limit, subcategoriaId);
  }

  // Proveedor crea o actualiza su propio perfil
  @Patch('proveedor')
  guardarPerfilProveedor(
    @CurrentUser('id') usuarioId: number,
    @Body() datos: any,
  ) {
    return this.perfilesService.guardarPerfilProveedor(usuarioId, datos);
  }

  // Productora crea o actualiza su propio perfil
  @Patch('productora')
  guardarPerfilProductora(
    @CurrentUser('id') usuarioId: number,
    @Body() datos: any,
  ) {
    return this.perfilesService.guardarPerfilProductora(usuarioId, datos);
  }

  // Admin verifica un proveedor
  @Roles('admin')
  @Patch('proveedores/:id/verificar')
  verificar(@Param('id', ParseIntPipe) id: number) {
    return this.perfilesService.verificarProveedor(id);
  }
}
