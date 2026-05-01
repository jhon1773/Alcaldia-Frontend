/**
 * PROYECTOS.MODULE.TS — MÓDULO DE GESTIÓN DE PROYECTOS AUDIOVISUALES
 *
 * RESPONSABILIDADES:
 * 1. Configurar acceso a BD para entidades de proyectos
 * 2. Registrar controlador y servicio de proyectos
 * 3. Gestionar dependencias de TypeORM para proyectos
 * 4. Proporcionar servicios de gestión de proyectos
 *
 * COMPONENTES REGISTRADOS:
 * - ProyectosController: Endpoints REST para gestión de proyectos
 * - ProyectosService: Lógica de negocio de proyectos
 * - Proyecto: Entidad principal de proyectos
 *
 * ENTIDADES CONFIGURADAS:
 * - Proyecto: Proyectos audiovisuales de productores
 *
 * DEPENDENCIAS:
 * - TypeOrmModule: Para acceso a entidad Proyecto
 * - AuthModule: Para guards y entidades relacionadas
 * - CatalogosModule: Para tipos de producción y municipios
 *
 * FUNCIONALIDADES:
 * - CRUD completo de proyectos
 * - Validación de propiedad por usuario
 * - Asociación con trámites PUFAB
 * - Gestión de estados de proyecto
 *
 * INTEGRACIÓN CON SISTEMA:
 * - Base para creación de trámites PUFAB
 * - Gestiona proyectos de productores
 * - Proporciona datos para reportes
 * - Soporta diferentes tipos de producción
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectosController } from './proyectos.controller';
import { ProyectosService } from './proyectos.service';
import { Proyecto } from './entities/proyecto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto])],
  controllers: [ProyectosController],
  providers: [ProyectosService],
  exports: [ProyectosService],
})
export class ProyectosModule {}
