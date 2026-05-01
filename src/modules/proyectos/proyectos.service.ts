/**
 * PROYECTOS.SERVICE.TS — SERVICIO DE NEGOCIO DEL MÓDULO DE PROYECTOS
 *
 * RESPONSABILIDADES:
 * 1. Contener la lógica de negocio relacionada con la gestión de proyectos audiovisuales
 * 2. Controlar el acceso a los proyectos según el rol del usuario autenticado
 * 3. Ejecutar las operaciones CRUD sobre la entidad Proyecto en la base de datos
 *
 * MÉTODOS:
 * - listar:        Retorna proyectos paginados; admin ve todos, productora solo los suyos
 * - obtenerPorId:  Busca un proyecto por ID y verifica que el usuario tenga acceso
 * - crear:         Registra un nuevo proyecto en estado 'borrador' asociado al usuario
 * - actualizar:    Aplica cambios parciales a un proyecto verificando pertenencia y permisos
 *
 * REGLAS DE NEGOCIO:
 * - Un usuario con rol 'admin' puede listar y acceder a cualquier proyecto
 * - Una productora solo puede ver y modificar sus propios proyectos
 * - Todo proyecto nuevo se crea con estado_proyecto = 'borrador'
 *
 * INTEGRACIÓN:
 * - Consume el repositorio de Proyecto (TypeORM) para todas las operaciones de persistencia
 * - Es invocado exclusivamente por ProyectosController
 * - Lanza NotFoundException si el proyecto no existe y ForbiddenException si el usuario no tiene acceso
 */

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { CrearProyectoDto } from './dto/crear-proyecto.dto';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private proyectosRepo: Repository<Proyecto>,
  ) {}

  // Lista proyectos del usuario autenticado con paginación
  async listar(usuarioId: number, roles: string[], page = 1, limit = 20) {
    const esAdmin = roles.includes('admin');
    const where = esAdmin ? {} : { usuario_id: usuarioId };

    const [data, total] = await this.proyectosRepo.findAndCount({
      where,
      relations: ['tipo_produccion', 'municipio_principal'],
      skip: (page - 1) * limit,
      take: limit,
      order: { fecha_creacion: 'DESC' },
    });

    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  // Obtiene un proyecto por ID verificando pertenencia
  async obtenerPorId(id: number, usuarioId: number, roles: string[]) {
    const proyecto = await this.proyectosRepo.findOne({
      where: { id },
      relations: ['tipo_produccion', 'municipio_principal', 'usuario'],
    });
    if (!proyecto) throw new NotFoundException(`Proyecto #${id} no encontrado`);

    const esAdmin = roles.includes('admin');
    if (!esAdmin && proyecto.usuario_id !== usuarioId) {
      throw new ForbiddenException('No tiene permiso para ver este proyecto');
    }

    return proyecto;
  }

  // Crea un nuevo proyecto para el usuario autenticado
  async crear(usuarioId: number, dto: CrearProyectoDto) {
    const proyecto = this.proyectosRepo.create({
      usuario_id: usuarioId,
      ...dto,
      estado_proyecto: 'borrador',
    });
    return this.proyectosRepo.save(proyecto);
  }

  // Actualiza un proyecto existente
  async actualizar(id: number, usuarioId: number, roles: string[], dto: Partial<CrearProyectoDto>) {
    const proyecto = await this.obtenerPorId(id, usuarioId, roles);
    await this.proyectosRepo.update(id, { ...dto });
    return this.proyectosRepo.findOne({ where: { id }, relations: ['tipo_produccion'] });
  }
}