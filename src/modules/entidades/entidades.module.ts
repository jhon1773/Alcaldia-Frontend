/**
 * Módulo NestJS que encapsula toda la funcionalidad de gestión de entidades revisoras.
 *
 * RESPONSABILIDADES:
 * - Configurar dependencias del módulo entidades
 * - Registrar entidades TypeORM para acceso a BD
 * - Exportar servicios para uso en otros módulos
 * - Gestionar inyección de dependencias del dominio
 *
 * COMPONENTES REGISTRADOS:
 * - EntidadesController: Exposición de endpoints REST
 * - EntidadesService: Lógica de negocio y acceso a datos
 * - Entidad: Entidad TypeORM para mapeo de BD
 *
 * IMPORTS:
 * - TypeOrmModule.forFeature([Entidad]): Registra repositorio de Entidad
 * - (Implícito) CatalogosModule: Para relaciones con tipos y municipios
 *
 * EXPORTS:
 * - EntidadesService: Disponible para inyección en otros módulos
 * - (Potencial) EntidadesController: Si otros módulos necesitan endpoints
 *
 * DEPENDENCIAS EXTERNAS:
 * - CatalogosModule: Para validación de FKs (tipo_entidad_revision, municipio)
 * - AuthModule: Para guards y permisos en controlador
 *
 * CONFIGURACIÓN DE BD:
 * - Tabla: entidades
 * - Relaciones: FK a tipos_entidad_revision, municipios
 * - Soft delete: campo 'activo' para desactivación lógica
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntidadesController } from './entidades.controller';
import { EntidadesService } from './entidades.service';
import { Entidad } from './entities/entidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entidad])],
  controllers: [EntidadesController],
  providers: [EntidadesService],
  exports: [EntidadesService],
})
export class EntidadesModule {}
