/**
 * CATALOGOS.MODULE.TS — MÓDULO DE CATÁLOGOS DEL SISTEMA
 *
 * RESPONSABILIDADES:
 * 1. Agrupar y registrar todas las entidades de catálogo del sistema
 * 2. Exponer CatalogosService y TypeOrmModule para uso en otros módulos
 * 3. Centralizar la configuración de dependencias del dominio de catálogos
 *
 * ENTIDADES REGISTRADAS (29 catálogos):
 *
 * Geográficos:
 * - Municipio                → municipios del departamento de Boyacá
 *
 * Estados y flujos:
 * - EstadoTramite            → estados del ciclo de vida de un trámite
 * - EstadoPago               → estados del proceso de pago
 * - EstadoAbono              → estados del proceso de abono
 * - EstadoCuenta             → estados de la cuenta de usuario
 * - EstadoRevisionEntidad    → estados de la revisión institucional con semáforo visual
 *
 * Tipos de entidad y perfil:
 * - TipoPerfil               → tipos de perfil de usuario (productora, proveedor, académico)
 * - TipoEntidad              → clasificación jurídica de entidades
 * - TipoEntidadRevision      → tipos de entidad que participan en revisiones
 *
 * Tipos de proceso:
 * - TipoTramite              → clasificación de trámites del sistema
 * - TipoPago                 → formas de pago aceptadas
 * - TipoConvocatoria         → clasificación de convocatorias
 * - TipoEspacio              → tipos de espacio físico o virtual
 * - TipoProduccion           → géneros o formatos de producción audiovisual
 * - TipoProduccionParticipa  → tipos de producción en los que se ha participado
 * - TipoDocumento            → tipos de documentos del sistema
 *
 * Caracterización de personas:
 * - TipoIdentificacion       → documentos de identidad válidos
 * - IdentidadGenero          → identidades de género
 * - SexoNacer                → sexo biológico registrado al nacer
 * - GrupoEtnico              → grupos étnicos para autorreconocimiento
 * - TipoDiscapacidad         → tipos de discapacidad
 * - NivelEducativo           → niveles de formación académica
 *
 * Caracterización sectorial:
 * - TiempoDedicacionSector   → dedicación al sector audiovisual
 * - TipoIngresosSector       → fuentes de ingreso dentro del sector
 * - RangoExperienciaSector   → rangos de experiencia en el sector
 *
 * Equipos técnicos:
 * - RolEquipoTecnico         → roles del equipo técnico en producciones
 * - GamaEquipos              → gamas o niveles de calidad de equipos
 * - TipoPropiedadEquipos     → modalidad de tenencia de equipos
 *
 * EXPORTS:
 * - CatalogosService: disponible para módulos que necesiten consultar catálogos
 * - TypeOrmModule:    expone los repositorios para inyección en otros módulos
 *
 * INTEGRACIÓN:
 * - Importado en AppModule como módulo del dominio de catálogos
 * - AuthModule, UsuariosModule y TrámitesModule consumen sus entidades exportadas
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogosController } from './catalogos.controller';
import { CatalogosService } from './catalogos.service';
import { Municipio } from './entities/municipio.entity';
import { TipoProduccion } from './entities/tipo-produccion.entity';
import { EstadoTramite } from './entities/estado-tramite.entity';
import { TipoEspacio } from './entities/tipo-espacio.entity';
import { RolEquipoTecnico } from './entities/rol-equipo-tecnico.entity';
import { TipoIdentificacion } from './entities/tipo-identificacion.entity';
import { IdentidadGenero } from './entities/identidad-genero.entity';
import { NivelEducativo } from './entities/nivel-educativo.entity';
import { TipoTramite } from './entities/tipo-tramite.entity';
import { TipoPago } from './entities/tipo-pago.entity';
import { EstadoPago } from './entities/estado-pago.entity';
import { EstadoAbono } from './entities/estado-abono.entity';
import { EstadoCuenta } from './entities/estado-cuenta.entity';
import { TipoPerfil } from './entities/tipo-perfil.entity';
import { TipoEntidad } from './entities/tipo-entidad.entity';
import { GrupoEtnico } from './entities/grupo-etnico.entity';
import { SexoNacer } from './entities/sexo-nacer.entity';
import { TipoDiscapacidad } from './entities/tipo-discapacidad.entity';
import { TiempoDedicacionSector } from './entities/tiempo-dedicacion-sector.entity';
import { TipoIngresosSector } from './entities/tipo-ingresos-sector.entity';
import { TipoPropiedadEquipos } from './entities/tipo-propiedad-equipos.entity';
import { GamaEquipos } from './entities/gama-equipos.entity';
import { RangoExperienciaSector } from './entities/rango-experiencia-sector.entity';
import { TipoProduccionParticipa } from './entities/tipo-produccion-participa.entity';
import { TipoDocumento } from './entities/tipo-documento.entity';
import { TipoEntidadRevision } from './entities/tipo-entidad-revision.entity';
import { EstadoRevisionEntidad } from './entities/estado-revision-entidad.entity';
import { TipoConvocatoria } from './entities/tipo-convocatoria.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Municipio, TipoProduccion, EstadoTramite, TipoEspacio,
      RolEquipoTecnico, TipoIdentificacion, IdentidadGenero,
      NivelEducativo, TipoTramite, TipoPago, EstadoPago, EstadoAbono,
      EstadoCuenta, TipoPerfil, TipoEntidad, GrupoEtnico, SexoNacer,
      TipoDiscapacidad, TiempoDedicacionSector, TipoIngresosSector,
      TipoPropiedadEquipos, GamaEquipos, RangoExperienciaSector,
      TipoProduccionParticipa, TipoDocumento, TipoEntidadRevision,
      EstadoRevisionEntidad, TipoConvocatoria,
    ]),
  ],
  controllers: [CatalogosController],
  providers: [CatalogosService],
  exports: [CatalogosService, TypeOrmModule],
})
export class CatalogosModule {}