import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudRegistro } from './entities/solicitud-registro.entity';
import { HistorialSolicitudRegistro } from './entities/historial-solicitud-registro.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { EstadoCuenta } from '../catalogos/entities/estado-cuenta.entity';

@Injectable()
export class RegistroService {
  constructor(
    @InjectRepository(SolicitudRegistro)
    private solicitudesRepo: Repository<SolicitudRegistro>,
    @InjectRepository(HistorialSolicitudRegistro)
    private historialRepo: Repository<HistorialSolicitudRegistro>,
    @InjectRepository(Usuario)
    private usuariosRepo: Repository<Usuario>,
    @InjectRepository(EstadoCuenta)
    private estadosCuentaRepo: Repository<EstadoCuenta>,
  ) {}

  // Crea solicitud de registro para el usuario autenticado
  async crearSolicitud(usuarioId: number) {
    const existente = await this.solicitudesRepo.findOne({
      where: { usuario_id: usuarioId, estado_solicitud: 'pendiente' },
    });
    if (existente) {
      throw new BadRequestException('Ya tiene una solicitud de registro pendiente');
    }

    const solicitud = this.solicitudesRepo.create({
      usuario_id: usuarioId,
      estado_solicitud: 'pendiente',
    });
    const guardada = await this.solicitudesRepo.save(solicitud);

    await this.registrarHistorial(
      guardada.id, undefined, 'pendiente', usuarioId, 'ENVIO_SOLICITUD', 'Solicitud enviada por el usuario',
    );

    return guardada;
  }

  // Lista solicitudes pendientes para revisión del admin
  async listar(page = 1, limit = 20, estado?: string) {
    const where = estado ? { estado_solicitud: estado } : {};
    const [data, total] = await this.solicitudesRepo.findAndCount({
      where,
      relations: ['usuario'],
      skip: (page - 1) * limit,
      take: limit,
      order: { fecha_envio: 'DESC' },
    });
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  // Admin revisa y aprueba o rechaza una solicitud
  async revisarSolicitud(
    solicitudId: number,
    adminId: number,
    nuevoEstado: 'aprobado' | 'rechazado' | 'subsanacion',
    observaciones: string,
  ) {
    const solicitud = await this.solicitudesRepo.findOne({
      where: { id: solicitudId },
    });
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');

    const estadoAnterior = solicitud.estado_solicitud;
    solicitud.estado_solicitud = nuevoEstado;
    solicitud.admin_revisor_id = adminId;
    solicitud.observaciones_admin = observaciones;
    solicitud.fecha_respuesta = new Date();

    if (nuevoEstado === 'subsanacion') {
      solicitud.numero_subsanaciones += 1;
    }

    await this.solicitudesRepo.save(solicitud);

    // Si se aprueba, activa la cuenta del usuario
    if (nuevoEstado === 'aprobado') {
      const estadoActivo = await this.estadosCuentaRepo.findOne({ where: { codigo: 'activo' } });
      if (estadoActivo) {
        await this.usuariosRepo.update(solicitud.usuario_id, {
          estado_cuenta_id: estadoActivo.id,
          fecha_aprobacion: new Date(),
        });
      }
    }

    await this.registrarHistorial(
      solicitudId, estadoAnterior, nuevoEstado, adminId,
      `REVISION_${nuevoEstado.toUpperCase()}`, observaciones,
    );

    return { mensaje: `Solicitud actualizada a estado: ${nuevoEstado}` };
  }

  // Registra cada cambio de estado en el historial
  private async registrarHistorial(
    solicitudId: number,
    estadoAnterior: string | undefined,
    estadoNuevo: string,
    usuarioActorId: number,
    accion: string,
    observacion: string,
  ) {
    const entrada = this.historialRepo.create({
      solicitud_registro_id: solicitudId,
      estado_anterior: estadoAnterior,
      estado_nuevo: estadoNuevo,
      usuario_actor_id: usuarioActorId,
      accion,
      observacion,
    });
    await this.historialRepo.save(entrada);
  }
}
