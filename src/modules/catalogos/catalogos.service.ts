import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

// Servicio de catálogos — datos de referencia sin lógica de negocio compleja
@Injectable()
export class CatalogosService {
  constructor(
    @InjectRepository(Municipio) private municipiosRepo: Repository<Municipio>,
    @InjectRepository(TipoProduccion) private tiposProduccionRepo: Repository<TipoProduccion>,
    @InjectRepository(EstadoTramite) private estadosTramiteRepo: Repository<EstadoTramite>,
    @InjectRepository(TipoEspacio) private tiposEspacioRepo: Repository<TipoEspacio>,
    @InjectRepository(RolEquipoTecnico) private rolesEquipoRepo: Repository<RolEquipoTecnico>,
    @InjectRepository(TipoIdentificacion) private tiposIdRepo: Repository<TipoIdentificacion>,
    @InjectRepository(IdentidadGenero) private identidadesGeneroRepo: Repository<IdentidadGenero>,
    @InjectRepository(NivelEducativo) private nivelesEducativosRepo: Repository<NivelEducativo>,
    @InjectRepository(TipoTramite) private tiposTramiteRepo: Repository<TipoTramite>,
    @InjectRepository(TipoPago) private tiposPagoRepo: Repository<TipoPago>,
    @InjectRepository(EstadoPago) private estadosPagoRepo: Repository<EstadoPago>,
  ) {}

  async obtenerMunicipios() {
    const municipios = await this.municipiosRepo.find({ order: { nombre: 'ASC' } });
    if (municipios.length > 0) return municipios;

    await this.municipiosRepo.save(
      this.municipiosRepo.create([
        { nombre: 'Tunja', departamento: 'Boyacá' },
        { nombre: 'Duitama', departamento: 'Boyacá' },
        { nombre: 'Sogamoso', departamento: 'Boyacá' },
        { nombre: 'Chiquinquirá', departamento: 'Boyacá' },
        { nombre: 'Paipa', departamento: 'Boyacá' },
        { nombre: 'Villa de Leyva', departamento: 'Boyacá' },
        { nombre: 'Samacá', departamento: 'Boyacá' },
        { nombre: 'Moniquirá', departamento: 'Boyacá' },
        { nombre: 'Soatá', departamento: 'Boyacá' },
        { nombre: 'Garagoa', departamento: 'Boyacá' },
        { nombre: 'Aquitania', departamento: 'Boyacá' },
        { nombre: 'Nobsa', departamento: 'Boyacá' },
        { nombre: 'Tibasosa', departamento: 'Boyacá' },
        { nombre: 'Ráquira', departamento: 'Boyacá' },
        { nombre: 'Tenza', departamento: 'Boyacá' },
      ]),
    );

    return this.municipiosRepo.find({ order: { nombre: 'ASC' } });
  }

  async obtenerTiposProduccion() {
    const tipos = await this.tiposProduccionRepo.find({ where: { activo: true }, order: { nombre: 'ASC' } });
    if (tipos.length > 0) return tipos;

    await this.tiposProduccionRepo.save(
      this.tiposProduccionRepo.create([
        { nombre: 'Largometraje', descripcion: 'Producción cinematográfica de larga duración', activo: true },
        { nombre: 'Cortometraje', descripcion: 'Producción audiovisual de corta duración', activo: true },
        { nombre: 'Serie', descripcion: 'Serie para televisión o plataformas digitales', activo: true },
        { nombre: 'Documental', descripcion: 'Producción documental', activo: true },
        { nombre: 'Comercial', descripcion: 'Pieza publicitaria audiovisual', activo: true },
        { nombre: 'Videoclip', descripcion: 'Producción musical audiovisual', activo: true },
        { nombre: 'Institucional', descripcion: 'Contenido institucional', activo: true },
        { nombre: 'Académico', descripcion: 'Proyecto audiovisual de formación', activo: true },
        { nombre: 'Otro', descripcion: 'Otro tipo de producción', activo: true },
      ]),
    );

    return this.tiposProduccionRepo.find({ where: { activo: true }, order: { nombre: 'ASC' } });
  }

  obtenerEstadosTramite() {
    return this.estadosTramiteRepo.find({ where: { activo: true }, order: { orden: 'ASC' } });
  }

  obtenerTiposEspacio() {
    return this.tiposEspacioRepo.find({ where: { activo: true } });
  }

  obtenerRolesEquipoTecnico() {
    return this.rolesEquipoRepo.find({ where: { activo: true }, order: { nombre: 'ASC' } }).then(async (roles) => {
      if (roles.length > 0) return roles;

      await this.rolesEquipoRepo.save(
        this.rolesEquipoRepo.create([
          { nombre: 'Director/a', descripcion: 'Dirección general del proyecto', activo: true },
          { nombre: 'Productor/a', descripcion: 'Gestión de recursos y ejecución', activo: true },
          { nombre: 'Director/a de Fotografía', descripcion: 'Diseño visual y cámara', activo: true },
          { nombre: 'Sonidista', descripcion: 'Captura y control de sonido', activo: true },
          { nombre: 'Gaffer', descripcion: 'Iluminación técnica del set', activo: true },
          { nombre: 'Arte / Escenografía', descripcion: 'Dirección de arte y ambientación', activo: true },
          { nombre: 'Maquillaje y Vestuario', descripcion: 'Caracterización y vestuario', activo: true },
          { nombre: 'Asistente de Producción', descripcion: 'Apoyo logístico en rodaje', activo: true },
        ]),
      );

      return this.rolesEquipoRepo.find({ where: { activo: true }, order: { nombre: 'ASC' } });
    });
  }

  obtenerTiposIdentificacion() {
    return this.tiposIdRepo.find();
  }

  obtenerIdentidadesGenero() {
    return this.identidadesGeneroRepo.find();
  }

  obtenerNivelesEducativos() {
    return this.nivelesEducativosRepo.find();
  }

  obtenerTiposTramite() {
    return this.tiposTramiteRepo.find({ where: { activo: true } });
  }

  obtenerTiposPago() {
    return this.tiposPagoRepo.find({ where: { activo: true } });
  }

  obtenerEstadosPago() {
    return this.estadosPagoRepo.find({ where: { activo: true } });
  }
}
