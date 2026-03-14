import { Controller, Get, UseGuards } from '@nestjs/common';
import { CatalogosService } from './catalogos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

// Los catálogos son públicos para facilitar el llenado de formularios
@Controller('catalogos')
export class CatalogosController {
  constructor(private readonly catalogosService: CatalogosService) {}

  @Public()
  @Get('municipios')
  municipios() {
    return this.catalogosService.obtenerMunicipios();
  }

  @Public()
  @Get('tipos-produccion')
  tiposProduccion() {
    return this.catalogosService.obtenerTiposProduccion();
  }

  @Public()
  @Get('estados-tramite')
  estadosTramite() {
    return this.catalogosService.obtenerEstadosTramite();
  }

  @Public()
  @Get('tipos-espacio')
  tiposEspacio() {
    return this.catalogosService.obtenerTiposEspacio();
  }

  @Public()
  @Get('roles-equipo-tecnico')
  rolesEquipoTecnico() {
    return this.catalogosService.obtenerRolesEquipoTecnico();
  }

  @Public()
  @Get('tipos-identificacion')
  tiposIdentificacion() {
    return this.catalogosService.obtenerTiposIdentificacion();
  }

  @Public()
  @Get('identidades-genero')
  identidadesGenero() {
    return this.catalogosService.obtenerIdentidadesGenero();
  }

  @Public()
  @Get('niveles-educativos')
  nivelesEducativos() {
    return this.catalogosService.obtenerNivelesEducativos();
  }

  @Public()
  @Get('tipos-tramite')
  tiposTramite() {
    return this.catalogosService.obtenerTiposTramite();
  }

  @Public()
  @Get('tipos-pago')
  tiposPago() {
    return this.catalogosService.obtenerTiposPago();
  }

  @Public()
  @Get('estados-pago')
  estadosPago() {
    return this.catalogosService.obtenerEstadosPago();
  }
}
