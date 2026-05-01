/**
 * DOCUMENTOS.MODULE.TS — MÓDULO DE GESTIÓN DE DOCUMENTOS
 *
 * RESPONSABILIDADES:
 * 1. Agrupar y configurar los componentes del dominio de documentos
 * 2. Registrar la entidad Documento para su uso con TypeORM
 * 3. Exportar DocumentosService para que otros módulos puedan gestionar documentos
 *
 * ENTIDADES REGISTRADAS:
 * - Documento → archivos adjuntos vinculados a trámites, usuarios o procesos del sistema
 *
 * PROVIDERS REGISTRADOS:
 * - DocumentosService → lógica de negocio para subida, consulta y eliminación de documentos
 *
 * EXPORTS:
 * - DocumentosService: disponible para módulos que necesiten adjuntar o consultar documentos
 *                      (ej: TrámitesModule, UsuariosModule)
 *
 * INTEGRACIÓN:
 * - Importado en AppModule como módulo del dominio de documentos
 * - DocumentosController expone los endpoints HTTP para la gestión de archivos
 * - Trabaja junto al módulo de almacenamiento de archivos (Multer / disco local)
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentosController } from './documentos.controller';
import { DocumentosService } from './documentos.service';
import { Documento } from './entities/documento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Documento])],
  controllers: [DocumentosController],
  providers: [DocumentosService],
  exports: [DocumentosService],
})
export class DocumentosModule {}