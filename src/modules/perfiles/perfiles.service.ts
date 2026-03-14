import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PerfilProveedor } from './entities/perfil-proveedor.entity';
import { PerfilProductora } from './entities/perfil-productora.entity';
import { PerfilAcademico } from './entities/perfil-academico.entity';
import { CategoriaProveedor } from './entities/categoria-proveedor.entity';
import { SubcategoriaProveedor } from './entities/subcategoria-proveedor.entity';
import { EspecialidadProveedor } from './entities/especialidad-proveedor.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class PerfilesService {
  constructor(
    @InjectRepository(PerfilProveedor) private perfilesProveedorRepo: Repository<PerfilProveedor>,
    @InjectRepository(PerfilProductora) private perfilesProductoraRepo: Repository<PerfilProductora>,
    @InjectRepository(PerfilAcademico) private perfilesAcademicoRepo: Repository<PerfilAcademico>,
    @InjectRepository(CategoriaProveedor) private categoriasRepo: Repository<CategoriaProveedor>,
    @InjectRepository(SubcategoriaProveedor) private subcategoriasRepo: Repository<SubcategoriaProveedor>,
    @InjectRepository(EspecialidadProveedor) private especialidadesRepo: Repository<EspecialidadProveedor>,
    @InjectRepository(Usuario) private usuariosRepo: Repository<Usuario>,
  ) {}

  // Obtiene el catálogo completo de categorías con subcategorías y especialidades
  async obtenerCatalogoCategorias() {
    return this.categoriasRepo.find({
      where: { activo: true },
      relations: ['subcategorias', 'subcategorias.especialidades'],
      order: { id: 'ASC' },
    });
  }

  // Crea o actualiza el perfil de proveedor
  async guardarPerfilProveedor(
    usuarioId: number,
    datos: Partial<PerfilProveedor> & { subcategoria_ids?: number[]; especialidad_ids?: number[] },
  ) {
    let perfil = await this.perfilesProveedorRepo.findOne({
      where: { usuario_id: usuarioId },
      relations: ['subcategorias', 'especialidades'],
    });

    if (!perfil) {
      perfil = this.perfilesProveedorRepo.create({ usuario_id: usuarioId });
    }

    // Actualiza campos básicos del perfil
    Object.assign(perfil, {
      descripcion_perfil: datos.descripcion_perfil,
      experiencia_sector_id: datos.experiencia_sector_id,
      sitio_web: datos.sitio_web,
      visible_directorio: datos.visible_directorio ?? true,
    });

    // Asigna subcategorías seleccionadas
    if (datos.subcategoria_ids?.length) {
      perfil.subcategorias = await this.subcategoriasRepo.find({
        where: { id: In(datos.subcategoria_ids) },
      });
    }

    // Asigna especialidades seleccionadas
    if (datos.especialidad_ids?.length) {
      perfil.especialidades = await this.especialidadesRepo.find({
        where: { id: In(datos.especialidad_ids) },
      });
    }

    return this.perfilesProveedorRepo.save(perfil);
  }

  // Crea o actualiza perfil de productora
  async guardarPerfilProductora(usuarioId: number, datos: Partial<PerfilProductora>) {
    let perfil = await this.perfilesProductoraRepo.findOne({ where: { usuario_id: usuarioId } });
    if (!perfil) {
      perfil = this.perfilesProductoraRepo.create({ usuario_id: usuarioId });
    }
    Object.assign(perfil, datos);
    return this.perfilesProductoraRepo.save(perfil);
  }

  // Lista proveedores en directorio con paginación
  async listarDirectorioProveedores(page = 1, limit = 20, subcategoriaId?: number) {
    const query = this.perfilesProveedorRepo
      .createQueryBuilder('perfil')
      .leftJoinAndSelect('perfil.usuario', 'usuario')
      .leftJoinAndSelect('perfil.subcategorias', 'subcategoria')
      .leftJoinAndSelect('perfil.especialidades', 'especialidad')
      .where('perfil.visible_directorio = true')
      .andWhere('perfil.verificado = true');

    if (subcategoriaId) {
      query.andWhere('subcategoria.id = :subcategoriaId', { subcategoriaId });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  // Verifica un proveedor (solo admin)
  async verificarProveedor(perfilId: number) {
    const perfil = await this.perfilesProveedorRepo.findOne({ where: { id: perfilId } });
    if (!perfil) throw new NotFoundException('Perfil de proveedor no encontrado');
    await this.perfilesProveedorRepo.update(perfilId, { verificado: true });
    return { mensaje: 'Proveedor verificado exitosamente' };
  }
}
