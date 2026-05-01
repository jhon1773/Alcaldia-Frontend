/**
 * Servicio de negocio para gestión de entidades revisoras externas en el sistema PUFA.
 *
 * RESPONSABILIDADES:
 * - Implementar lógica CRUD para entidades revisoras
 * - Gestionar consultas a base de datos con TypeORM
 * - Aplicar reglas de negocio específicas del dominio
 * - Manejar paginación y relaciones de entidades
 *
 * OPERACIONES PRINCIPALES:
 * - listar(): Consulta paginada de entidades activas con relaciones
 * - crear(): Creación de nuevas entidades con validación
 * - actualizar(): Modificación de entidades existentes
 * - desactivar(): Soft delete (desactivación lógica)
 *
 * REGLAS DE NEGOCIO:
 * - Solo entidades activas son retornadas en listados
 * - Actualización requiere existencia previa de la entidad
 * - Desactivación es lógica (activo=false) para preservar integridad
 * - Relaciones con catálogos se cargan automáticamente
 *
 * PAGINACIÓN:
 * - Parámetros: page (página actual), limit (elementos por página)
 * - Respuesta: { data, total, page, lastPage }
 * - Default: page=1, limit=50
 *
 * RELACIONES CARGADAS:
 * - tipo_entidad_revision: Información del tipo de entidad
 * - municipio: Datos del municipio de operación
 *
 * MANEJO DE ERRORES:
 * - NotFoundException: Cuando entidad no existe para actualización
 * - Validación automática vía DTOs en controlador
 *
 * DEPENDENCIAS:
 * - Repository<Entidad>: Acceso a datos de entidades
 * - TypeORM: ORM para consultas y operaciones de BD
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entidad } from './entities/entidad.entity';
import { CrearEntidadDto } from './dto/crear-entidad.dto';

@Injectable()
export class EntidadesService {
  constructor(
    @InjectRepository(Entidad)
    private entidadesRepo: Repository<Entidad>,
  ) {}

  /**
   * Lista entidades revisoras activas con paginación.
   *
   * @param page - Número de página (default: 1)
   * @param limit - Elementos por página (default: 50)
   * @returns Objeto con data paginada, total, página actual y última página
   */
  async listar(page = 1, limit = 50) {
    const [data, total] = await this.entidadesRepo.findAndCount({
      where: { activo: true },
      relations: ['tipo_entidad_revision', 'municipio'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  /**
   * Crea una nueva entidad revisora.
   *
   * @param dto - Datos validados de la nueva entidad
   * @returns Entidad creada con ID asignado
   */
  async crear(dto: CrearEntidadDto) {
    const entidad = this.entidadesRepo.create(dto);
    return this.entidadesRepo.save(entidad);
  }

  /**
   * Actualiza datos de una entidad existente.
   *
   * @param id - ID de la entidad a actualizar
   * @param dto - Datos a modificar (parciales)
   * @returns Entidad actualizada
   * @throws NotFoundException si la entidad no existe
   */
  async actualizar(id: number, dto: Partial<CrearEntidadDto>) {
    const entidad = await this.entidadesRepo.findOne({ where: { id } });
    if (!entidad) throw new NotFoundException('Entidad no encontrada');
    await this.entidadesRepo.update(id, dto);
    return this.entidadesRepo.findOne({ where: { id } });
  }

  /**
   * Desactiva lógicamente una entidad revisora.
   *
   * @param id - ID de la entidad a desactivar
   * @returns Mensaje de confirmación
   */
  async desactivar(id: number) {
    await this.entidadesRepo.update(id, { activo: false });
    return { mensaje: 'Entidad desactivada' };
  }
}
