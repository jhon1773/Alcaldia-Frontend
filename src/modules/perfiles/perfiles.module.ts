/**
 * PERFILES.MODULE.TS — MÓDULO DE GESTIÓN DE PERFILES
 *
 * RESPONSABILIDADES:
 * 1. Agrupar y configurar todos los componentes del dominio de perfiles
 * 2. Registrar las entidades de perfiles y categorías para su uso con TypeORM
 * 3. Exportar PerfilesService y TypeOrmModule para uso en otros módulos
 *
 * ENTIDADES REGISTRADAS:
 * - PerfilProveedor              → perfil público del proveedor de servicios audiovisuales
 * - PerfilProductora             → perfil público de la productora audiovisual
 * - PerfilAcademico              → perfil del usuario con rol académico
 * - CategoriaProveedor           → categorías principales del directorio de proveedores
 * - SubcategoriaProveedor        → subcategorías agrupadas bajo cada categoría
 * - EspecialidadProveedor        → especialidades específicas dentro de cada subcategoría
 * - PersonaNaturalConvocatoria   → datos de persona natural en el contexto de convocatorias
 * - Usuario                      → entidad de usuario requerida para relacionar perfiles
 *
 * CONTROLADORES REGISTRADOS:
 * - PerfilesController → endpoints públicos y de usuario autenticado
 * - AdminController    → endpoints exclusivos para administradores (verificación de perfiles)
 *
 * PROVIDERS REGISTRADOS:
 * - PerfilesService → lógica de negocio para creación, actualización y verificación de perfiles
 *
 * EXPORTS:
 * - PerfilesService: disponible para módulos que necesiten consultar o gestionar perfiles
 * - TypeOrmModule:   expone los repositorios para inyección en otros módulos
 *                    (ej: TrámitesModule puede necesitar consultar perfiles de proveedores)
 *
 * INTEGRACIÓN:
 * - Importado en AppModule como módulo del dominio de perfiles
 * - Depende de AuthModule para los guards JwtAuthGuard y RolesGuard
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilesController } from './perfiles.controller';
import { AdminController } from './admin.controller';
import { PerfilesService } from './perfiles.service';
import { PerfilProveedor } from './entities/perfil-proveedor.entity';
import { PerfilProductora } from './entities/perfil-productora.entity';
import { PerfilAcademico } from './entities/perfil-academico.entity';
import { CategoriaProveedor } from './entities/categoria-proveedor.entity';
import { SubcategoriaProveedor } from './entities/subcategoria-proveedor.entity';
import { EspecialidadProveedor } from './entities/especialidad-proveedor.entity';
import { PersonaNaturalConvocatoria } from './entities/persona-natural-convocatoria.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PerfilProveedor,
      PerfilProductora,
      PerfilAcademico,
      CategoriaProveedor,
      SubcategoriaProveedor,
      EspecialidadProveedor,
      PersonaNaturalConvocatoria,
      Usuario,
    ]),
  ],
  controllers: [PerfilesController, AdminController],
  providers: [PerfilesService],
  exports: [PerfilesService, TypeOrmModule],
})
export class PerfilesModule {}