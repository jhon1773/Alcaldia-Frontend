/**
 * TRAMITES.MODULE.TS — MÓDULO DEL DOMINIO DE TRÁMITES
 *
 * RESPONSABILIDADES:
 * 1. Agrupar y configurar todos los componentes del dominio de trámites
 * 2. Registrar las entidades TypeORM necesarias para las operaciones del módulo
 * 3. Exponer TramitesService para que otros módulos puedan consumirlo
 *
 * ENTIDADES REGISTRADAS:
 * - Tramite:              Entidad principal del trámite de permiso de rodaje
 * - TramiteLocacion:      Locaciones asociadas a cada trámite
 * - TramiteEquipoTecnico: Miembros del equipo técnico vinculados al trámite
 * - TramiteEntidad:       Entidades revisoras asignadas al trámite
 * - HistorialTramite:     Registro cronológico de cambios de estado del trámite
 * - EstadoTramite:        Catálogo de estados posibles del trámite (importado de catalogos)
 * - Usuario:              Requerido para notificaciones y trazabilidad del solicitante
 * - Proyecto:             Proyecto audiovisual al que pertenece el trámite
 *
 * INTEGRACIÓN:
 * - TramitesService se exporta para ser consumido por otros módulos que
 *   necesiten consultar o referenciar trámites existentes
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TramitesController } from './tramites.controller';
import { TramitesService } from './tramites.service';
import { Tramite } from './entities/tramite.entity';
import { TramiteLocacion } from './entities/tramite-locacion.entity';
import { TramiteEquipoTecnico } from './entities/tramite-equipo-tecnico.entity';
import { TramiteEntidad } from './entities/tramite-entidad.entity';
import { HistorialTramite } from './entities/historial-tramite.entity';
import { EstadoTramite } from '../catalogos/entities/estado-tramite.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Proyecto } from '../proyectos/entities/proyecto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tramite,
      TramiteLocacion,
      TramiteEquipoTecnico,
      TramiteEntidad,
      HistorialTramite,
      EstadoTramite,
      Usuario,
      Proyecto,
    ]),
  ],
  controllers: [TramitesController],
  providers: [TramitesService],
  exports: [TramitesService],
})
export class TramitesModule {}