/**
 * USUARIOS.MODULE.TS — MÓDULO DEL DOMINIO DE USUARIOS
 *
 * RESPONSABILIDADES:
 * 1. Agrupar y configurar todos los componentes del dominio de usuarios
 * 2. Registrar las entidades TypeORM necesarias para las operaciones del módulo
 * 3. Exportar UsuariosService y TypeOrmModule para que otros módulos puedan consumirlos
 *
 * ENTIDADES REGISTRADAS:
 * - Usuario:          Entidad base de autenticación y acceso al sistema
 * - PersonaNatural:   Perfil extendido para usuarios de tipo persona natural
 * - PersonaJuridica:  Perfil extendido para usuarios de tipo persona jurídica
 * - VigenciaEstimulo: Estímulos o apoyos públicos recibidos por personas jurídicas
 * - EstadoCuenta:     Catálogo de estados posibles de una cuenta (importado de catalogos)
 * - TipoPerfil:       Catálogo de roles o perfiles del sistema (importado de catalogos)
 * - UsuarioRol:       Relación entre usuarios y roles asignados (importado de auth)
 *
 * INTEGRACIÓN:
 * - UsuariosService se exporta para ser consumido por el módulo de autenticación
 *   y cualquier otro módulo que necesite consultar o validar datos de usuarios
 * - TypeOrmModule se exporta para que módulos dependientes accedan al repositorio
 *   de Usuario sin necesidad de redeclararlo
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entities/usuario.entity';
import { PersonaNatural } from './entities/persona-natural.entity';
import { PersonaJuridica } from './entities/persona-juridica.entity';
import { VigenciaEstimulo } from './entities/vigencia-estimulo.entity';
import { EstadoCuenta } from '../catalogos/entities/estado-cuenta.entity';
import { TipoPerfil } from '../catalogos/entities/tipo-perfil.entity';
import { UsuarioRol } from '../auth/entities/usuario-rol.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      PersonaNatural,
      PersonaJuridica,
      VigenciaEstimulo,
      EstadoCuenta,
      TipoPerfil,
      UsuarioRol,
    ]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService, TypeOrmModule],
})
export class UsuariosModule {}