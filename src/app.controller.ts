import { Body, Controller, Get, Param, Post, Query, Redirect } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataSource: DataSource,
  ) {}

  private async getPrimaryPerfilProveedorId() {
    const [perfil] = await this.dataSource.query(`
      SELECT p.id
      FROM perfiles_proveedor p
      WHERE p.visible_directorio = true
      ORDER BY p.id ASC
      LIMIT 1
    `);
    return perfil?.id ?? null;
  }

  private async ensureProveedorPortalTables(perfilId: number) {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS proveedor_disponibilidad (
        id SERIAL PRIMARY KEY,
        perfil_proveedor_id INTEGER NOT NULL,
        dia_semana VARCHAR(20) NOT NULL,
        estado VARCHAR(30) NOT NULL,
        horas VARCHAR(80) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE (perfil_proveedor_id, dia_semana)
      )
    `);

    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS proveedor_mensajes (
        id SERIAL PRIMARY KEY,
        perfil_proveedor_id INTEGER NOT NULL,
        titulo VARCHAR(200) NOT NULL,
        fecha DATE NOT NULL,
        texto TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const [dispCount] = await this.dataSource.query(
      `SELECT COUNT(*)::int AS total FROM proveedor_disponibilidad WHERE perfil_proveedor_id = $1`,
      [perfilId],
    );

    if ((dispCount?.total ?? 0) === 0) {
      await this.dataSource.query(
        `
        INSERT INTO proveedor_disponibilidad (perfil_proveedor_id, dia_semana, estado, horas)
        VALUES
          ($1, 'Lunes', 'Disponible', '08:00 - 18:00'),
          ($1, 'Martes', 'Disponible', '08:00 - 18:00'),
          ($1, 'Miércoles', 'Reservado', 'Rodaje en campo'),
          ($1, 'Jueves', 'Disponible', '10:00 - 18:00'),
          ($1, 'Viernes', 'Disponible', '08:00 - 16:00')
      `,
        [perfilId],
      );
    }
  }

  private async resolveEstadoTramiteId(keywords: string[]) {
    const likePatterns = keywords.map((k) => `%${k.toLowerCase()}%`);
    const [estado] = await this.dataSource.query(
      `
      SELECT id
      FROM estados_tramite
      WHERE LOWER(nombre) LIKE ANY($1)
      ORDER BY id ASC
      LIMIT 1
    `,
      [likePatterns],
    );
    return estado?.id ?? null;
  }

  private async ensureAdminLocacionesTable() {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS admin_locaciones (
        id SERIAL PRIMARY KEY,
        nombre_lugar VARCHAR(255) NOT NULL,
        municipio_id INTEGER NULL,
        tipo_espacio_id INTEGER NULL,
        observaciones TEXT NULL,
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }

  private async ensureAdminComitesTable() {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS admin_comites_tecnicos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        cargo VARCHAR(80) NOT NULL,
        especialidad VARCHAR(120) NOT NULL,
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }

  @Get()
  @Redirect('/', 302)
  getHello() {
    return { url: '/' };
  }

  @Get('directorio')
  @Redirect('/directorio/', 302)
  getDirectorio() {
    return { url: '/directorio/' };
  }

  @Get('contacto')
  @Redirect('/contacto/', 302)
  getContacto() {
    return { url: '/contacto/' };
  }

  @Get('iniciar-sesion')
  @Redirect('/iniciar-sesion/', 302)
  getIniciarSesion() {
    return { url: '/iniciar-sesion/' };
  }

  @Get('tramites')
  @Redirect('/tramites/', 302)
  getTramites() {
    return { url: '/tramites/' };
  }

  @Get('proveedor')
  @Redirect('/proveedor/', 302)
  getProveedor() {
    return { url: '/proveedor/' };
  }

  @Get('academico')
  @Redirect('/academico/', 302)
  getAcademico() {
    return { url: '/academico/' };
  }

  @Get('admin')
  @Redirect('/admin/', 302)
  getAdmin() {
    return { url: '/admin/' };
  }

  @Get('portal/productor/permisos')
  async getPortalPermisos(@Query('estado') estado?: string) {
    const permisos = await this.dataSource.query(`
      SELECT
        t.id,
        t.numero_radicado,
        COALESCE(p.nombre_proyecto, 'Proyecto sin nombre') AS proyecto,
        COALESCE(m.nombre, tl.nombre_lugar, 'Sin locación') AS locacion,
        COALESCE(e.nombre, 'Pendiente') AS estado_label,
        CASE
          WHEN LOWER(COALESCE(e.nombre, '')) LIKE '%aprob%' THEN 'aprobado'
          WHEN LOWER(COALESCE(e.nombre, '')) LIKE '%subsan%' OR LOWER(COALESCE(e.nombre, '')) LIKE '%corre%' THEN 'subsanacion'
          ELSE 'pendiente'
        END AS estado,
        t.fecha_solicitud::date AS fecha,
        COALESCE(t.fecha_respuesta::date, (t.fecha_solicitud + INTERVAL '7 day')::date) AS respuesta,
        CASE
          WHEN LOWER(COALESCE(e.nombre, '')) LIKE '%aprob%' THEN 100
          WHEN LOWER(COALESCE(e.nombre, '')) LIKE '%subsan%' THEN 75
          ELSE 55
        END AS progreso
      FROM tramites t
      LEFT JOIN proyectos p ON p.id = t.proyecto_id
      LEFT JOIN estados_tramite e ON e.id = t.estado_tramite_id
      LEFT JOIN LATERAL (
        SELECT l.*
        FROM tramite_locaciones l
        WHERE l.tramite_id = t.id
        ORDER BY l.id ASC
        LIMIT 1
      ) tl ON true
      LEFT JOIN municipios m ON m.id = tl.municipio_id
      ORDER BY t.fecha_solicitud DESC
      LIMIT 50
    `);

    const correccionesRaw = await this.dataSource.query(`
      SELECT h.tramite_id, h.observacion
      FROM historial_tramite h
      WHERE h.observacion IS NOT NULL
        AND (LOWER(h.accion) LIKE '%subsan%' OR LOWER(h.observacion) LIKE '%corre%')
      ORDER BY h.fecha_cambio DESC
    `);

    const mapCorrecciones: Record<number, string[]> = {};
    for (const row of correccionesRaw) {
      if (!mapCorrecciones[row.tramite_id]) {
        mapCorrecciones[row.tramite_id] = [];
      }
      mapCorrecciones[row.tramite_id].push(row.observacion);
    }

    const data = permisos.map((item: any) => ({
      ...item,
      correcciones: mapCorrecciones[item.id] ?? [],
    }));

    const filtered = estado && estado !== 'todos'
      ? data.filter((item: any) => item.estado === estado)
      : data;

    return { data: filtered, total: filtered.length };
  }

  @Get('portal/productor/locaciones')
  async getPortalLocaciones(
    @Query('buscar') buscar?: string,
    @Query('tipo') tipo?: string,
    @Query('provincia') provincia?: string,
  ) {
    await this.ensureAdminLocacionesTable();

    const rows = await this.dataSource.query(`
      SELECT
        tl.id,
        tl.nombre_lugar AS nombre,
        COALESCE(LOWER(te.nombre), 'natural') AS tipo,
        COALESCE(m.nombre, 'Boyacá') AS provincia,
        CASE
          WHEN LOWER(COALESCE(te.nombre, '')) LIKE '%patr%' THEN 300000
          WHEN LOWER(COALESCE(te.nombre, '')) LIKE '%interior%' THEN 250000
          WHEN LOWER(COALESCE(te.nombre, '')) LIKE '%urban%' THEN 320000
          ELSE 400000
        END AS precio
      FROM tramite_locaciones tl
      LEFT JOIN tipos_espacio te ON te.id = tl.tipo_espacio_id
      LEFT JOIN municipios m ON m.id = tl.municipio_id
      ORDER BY tl.id DESC
      LIMIT 60
    `);

    const manualRows = await this.dataSource.query(`
      SELECT
        l.id,
        l.nombre_lugar AS nombre,
        COALESCE(LOWER(te.nombre), 'natural') AS tipo,
        COALESCE(m.nombre, 'Boyacá') AS provincia,
        CASE
          WHEN LOWER(COALESCE(te.nombre, '')) LIKE '%patr%' THEN 300000
          WHEN LOWER(COALESCE(te.nombre, '')) LIKE '%interior%' THEN 250000
          WHEN LOWER(COALESCE(te.nombre, '')) LIKE '%urban%' THEN 320000
          ELSE 400000
        END AS precio
      FROM admin_locaciones l
      LEFT JOIN tipos_espacio te ON te.id = l.tipo_espacio_id
      LEFT JOIN municipios m ON m.id = l.municipio_id
      WHERE l.activo = true
      ORDER BY l.id DESC
      LIMIT 60
    `);

    const images = [
      '/assets/location-placeholder.svg',
      '/assets/location-placeholder.svg',
      '/assets/location-placeholder.svg',
      '/assets/location-placeholder.svg',
      '/assets/location-placeholder.svg',
      '/assets/location-placeholder.svg',
    ];

    const mixedRows = [...manualRows, ...rows];
    const locaciones = mixedRows.map((item: any, index: number) => ({
      ...item,
      imagen: images[index % images.length],
    }));

    const query = (buscar ?? '').toLowerCase().trim();
    const data = locaciones.filter((item: any) => {
      const byName = !query || item.nombre.toLowerCase().includes(query);
      const byTipo = !tipo || tipo === 'todos' || item.tipo.includes(tipo);
      const byProvincia = !provincia || provincia === 'todas' || item.provincia.toLowerCase() === provincia.toLowerCase();
      return byName && byTipo && byProvincia;
    });

    return { data, total: data.length };
  }

  @Get('portal/productor/evaluaciones')
  async getPortalEvaluaciones() {
    const [latest] = await this.dataSource.query(`
      SELECT
        h.tramite_id,
        h.observacion,
        h.fecha_cambio::date AS fecha_cambio,
        t.numero_radicado,
        p.nombre_proyecto,
        t.requiere_plan_manejo_transito,
        t.requiere_seguro_rc,
        t.consentimiento_comunidades_aplica
      FROM historial_tramite h
      LEFT JOIN tramites t ON t.id = h.tramite_id
      LEFT JOIN proyectos p ON p.id = t.proyecto_id
      WHERE h.observacion IS NOT NULL
      ORDER BY h.fecha_cambio DESC
      LIMIT 1
    `);

    const observaciones = latest?.observacion
      ? [latest.observacion]
      : ['No hay observaciones pendientes del comité por ahora.'];

    const docs = [] as string[];
    if (latest?.requiere_seguro_rc) docs.push('Certificado de Seguro Actualizado');
    if (latest?.requiere_plan_manejo_transito) docs.push('Plan de Manejo de Tránsito');
    if (latest?.consentimiento_comunidades_aplica) docs.push('Consentimiento de Comunidades');
    if (!docs.length) docs.push('Plan de Manejo Ambiental');

    return {
      codigo: latest?.numero_radicado ?? 'EVAL-SIN-DATOS',
      permiso: latest?.numero_radicado ?? 'N/A',
      proyecto: latest?.nombre_proyecto ?? 'Sin proyecto asociado',
      comite: 'Comité Técnico de Locaciones',
      fecha_limite: latest?.fecha_cambio ?? null,
      observaciones,
      documentos_requeridos: docs,
    };
  }

  @Get('portal/proveedor/panel')
  async getPortalProveedorPanel() {
    const [perfil] = await this.dataSource.query(`
      SELECT
        p.id,
        p.descripcion_perfil,
        p.sitio_web,
        p.verificado,
        u.email,
        u.telefono
      FROM perfiles_proveedor p
      INNER JOIN usuarios u ON u.id = p.usuario_id
      WHERE p.visible_directorio = true
      ORDER BY p.id ASC
      LIMIT 1
    `);

    const servicios = await this.dataSource.query(`
      SELECT e.nombre
      FROM perfil_proveedor_especialidades pe
      INNER JOIN especialidades_proveedor e ON e.id = pe.especialidad_proveedor_id
      WHERE pe.perfil_proveedor_id = $1
      ORDER BY e.nombre ASC
      LIMIT 6
    `, [perfil?.id ?? 0]);

    const solicitudesRaw = await this.dataSource.query(`
      SELECT
        t.numero_radicado AS codigo,
        COALESCE(e.nombre, 'Pendiente') AS estado,
        COALESCE(p.nombre_proyecto, 'Proyecto') AS proyecto,
        COALESCE(t.fecha_solicitud::date, CURRENT_DATE) AS fecha,
        COALESCE(p.presupuesto_total, 750000)::numeric AS valor
      FROM tramites t
      LEFT JOIN proyectos p ON p.id = t.proyecto_id
      LEFT JOIN estados_tramite e ON e.id = t.estado_tramite_id
      ORDER BY t.fecha_solicitud DESC
      LIMIT 4
    `);

    const solicitudes = solicitudesRaw.map((row: any) => ({
      ...row,
      cliente: 'Productora Asociada',
      dias: 3,
    }));

    const metricas = {
      proyectos: solicitudes.length,
      solicitudes: solicitudes.filter((s: any) => String(s.estado).toLowerCase().includes('pend')).length,
      reseñas: 47,
      tarifaBase: 180000,
    };

    return {
      nombre: perfil?.email ? String(perfil.email).split('@')[0].replaceAll('.', ' ') : 'Proveedor',
      rol: 'Proveedor Audiovisual',
      ciudad: 'Boyacá, Colombia',
      rating: perfil?.verificado ? 4.9 : 4.5,
      resenas: metricas.reseñas,
      descripcion:
        perfil?.descripcion_perfil ?? 'Perfil profesional para servicios audiovisuales en Boyacá.',
      metricas,
      servicios: servicios.length
        ? servicios.map((s: any, idx: number) => ({ nombre: s.nombre, precio: 150000 + idx * 50000 }))
        : [
          { nombre: 'Servicio audiovisual', precio: 180000 },
          { nombre: 'Soporte técnico', precio: 220000 },
        ],
      solicitudes,
      contacto: {
        email: perfil?.email ?? 'proveedor@pufab.gov.co',
        telefono: perfil?.telefono ?? '3000000000',
        sitio_web: perfil?.sitio_web,
      },
    };
  }

  @Get('portal/proveedor/portafolio')
  async getPortalProveedorPortafolio() {
    const panel = await this.getPortalProveedorPanel();
    const galeria = [
      {
        titulo: 'Rodaje documental en Villa de Leyva',
        imagen: '/assets/location-placeholder.svg',
        categoria: 'Documental',
      },
      {
        titulo: 'Scouting de locaciones rurales',
        imagen: '/assets/location-placeholder.svg',
        categoria: 'Locaciones',
      },
      {
        titulo: 'Producción en centro histórico',
        imagen: '/assets/location-placeholder.svg',
        categoria: 'Producción',
      },
    ];

    return {
      nombre: panel.nombre,
      rol: panel.rol,
      descripcion: panel.descripcion,
      servicios: panel.servicios,
      galeria,
    };
  }

  @Get('portal/proveedor/disponibilidad')
  async getPortalProveedorDisponibilidad() {
    const panel = await this.getPortalProveedorPanel();
    const perfilId = await this.getPrimaryPerfilProveedorId();
    if (!perfilId) {
      return { nombre: panel.nombre, ciudad: panel.ciudad, semana: [] };
    }

    await this.ensureProveedorPortalTables(perfilId);
    const semana = await this.dataSource.query(
      `
      SELECT dia_semana AS dia, estado, horas
      FROM proveedor_disponibilidad
      WHERE perfil_proveedor_id = $1
      ORDER BY CASE dia_semana
        WHEN 'Lunes' THEN 1
        WHEN 'Martes' THEN 2
        WHEN 'Miércoles' THEN 3
        WHEN 'Jueves' THEN 4
        WHEN 'Viernes' THEN 5
        WHEN 'Sábado' THEN 6
        WHEN 'Domingo' THEN 7
        ELSE 8
      END
    `,
      [perfilId],
    );

    return {
      nombre: panel.nombre,
      ciudad: panel.ciudad,
      semana,
    };
  }

  @Get('portal/proveedor/solicitudes')
  async getPortalProveedorSolicitudes() {
    const panel = await this.getPortalProveedorPanel();
    return {
      total: panel.solicitudes.length,
      solicitudes: panel.solicitudes,
    };
  }

  @Get('portal/proveedor/mensajes')
  async getPortalProveedorMensajes() {
    const panel = await this.getPortalProveedorPanel();
    const perfilId = await this.getPrimaryPerfilProveedorId();
    if (!perfilId) {
      return { total: 0, mensajes: [] };
    }

    await this.ensureProveedorPortalTables(perfilId);

    const [msgCount] = await this.dataSource.query(
      `SELECT COUNT(*)::int AS total FROM proveedor_mensajes WHERE perfil_proveedor_id = $1`,
      [perfilId],
    );

    if ((msgCount?.total ?? 0) === 0) {
      for (const [idx, item] of panel.solicitudes.entries()) {
        await this.dataSource.query(
          `
          INSERT INTO proveedor_mensajes (perfil_proveedor_id, titulo, fecha, texto)
          VALUES ($1, $2, $3, $4)
        `,
          [
            perfilId,
            item.proyecto,
            item.fecha,
            idx % 2 === 0
              ? `Hola ${panel.nombre}, queremos confirmar tu disponibilidad para el servicio solicitado.`
              : `Gracias por tu respuesta. Adjuntamos detalles adicionales del rodaje para ${item.proyecto}.`,
          ],
        );
      }
    }

    const mensajes = await this.dataSource.query(
      `
      SELECT titulo, fecha, texto
      FROM proveedor_mensajes
      WHERE perfil_proveedor_id = $1
      ORDER BY fecha DESC, id DESC
      LIMIT 20
    `,
      [perfilId],
    );

    return {
      total: mensajes.length,
      mensajes,
    };
  }

  @Get('portal/admin/resumen')
  async getPortalAdminResumen() {
    const [stats] = await this.dataSource.query(`
      SELECT
        (SELECT COUNT(*)::int FROM usuarios WHERE activo = true) AS usuarios,
        (SELECT COUNT(*)::int FROM tramites WHERE estado_tramite_id IS NULL) AS permisos_pendientes,
        COALESCE((SELECT SUM(COALESCE(presupuesto_total, 0))::numeric FROM proyectos), 0) AS reservas,
        (SELECT ROUND(AVG(CASE WHEN p.verificado THEN 100 ELSE 88 END), 0)::int FROM perfiles_proveedor p) AS satisfaccion
    `);

    const notificaciones = await this.dataSource.query(`
      SELECT
        CONCAT('Trámite ', t.numero_radicado, ' actualizado') AS texto,
        COALESCE(t.fecha_solicitud::text, CURRENT_DATE::text) AS fecha
      FROM tramites t
      ORDER BY t.fecha_solicitud DESC
      LIMIT 3
    `);

    return {
      stats: {
        usuarios: stats?.usuarios ?? 0,
        permisos_pendientes: stats?.permisos_pendientes ?? 0,
        reservas: Number(stats?.reservas ?? 0),
        satisfaccion: stats?.satisfaccion ?? 94,
      },
      acciones: [
        { titulo: 'Revisar Permisos', detalle: '23 pendientes' },
        { titulo: 'Verificar Perfiles', detalle: '8 por revisar' },
        { titulo: 'Pagos', detalle: '5 por confirmar' },
        { titulo: 'Notificaciones', detalle: '12 sin leer' },
      ],
      notificaciones,
    };
  }

  @Get('portal/admin/usuarios')
  async getPortalAdminUsuarios(@Query('q') q?: string) {
    const search = `%${(q ?? '').trim().toLowerCase()}%`;
    const rows = await this.dataSource.query(
      `
      SELECT
        u.id,
        split_part(u.email, '@', 1) AS nombre,
        u.email,
        COALESCE(tp.nombre, 'Sin rol') AS rol,
        CASE WHEN u.activo THEN 'Activo' ELSE 'Inactivo' END AS estado,
        COALESCE(u.fecha_actualizacion::text, CURRENT_DATE::text) AS ultimo_acceso
      FROM usuarios u
      LEFT JOIN tipos_perfil tp ON tp.id = u.tipo_perfil_id
      WHERE ($1 = '%%' OR LOWER(u.email) LIKE $1)
      ORDER BY u.id ASC
      LIMIT 20
    `,
      [search],
    );

    return { data: rows, total: rows.length };
  }

  @Post('portal/admin/usuarios/:id/toggle')
  async togglePortalAdminUsuarioEstado(@Param('id') id: string) {
    await this.dataSource.query(
      `
      UPDATE usuarios
      SET activo = NOT activo,
          updated_at = NOW()
      WHERE id = $1::int
    `,
      [id],
    );

    const [usuario] = await this.dataSource.query(
      `SELECT id, activo FROM usuarios WHERE id = $1::int LIMIT 1`,
      [id],
    );

    return {
      ok: true,
      id: usuario?.id ?? Number(id),
      estado: usuario?.activo ? 'Activo' : 'Inactivo',
    };
  }

  @Get('portal/admin/verificacion')
  async getPortalAdminVerificacion() {
    const rows = await this.dataSource.query(`
      SELECT
        p.id,
        split_part(u.email, '@', 1) AS nombre,
        COALESCE(tp.nombre, 'Proveedor') AS tipo,
        COALESCE(p.fecha_actualizacion::date, CURRENT_DATE) AS fecha,
        CASE WHEN p.verificado THEN 'Aprobado' ELSE 'Pendiente' END AS estado
      FROM perfiles_proveedor p
      INNER JOIN usuarios u ON u.id = p.usuario_id
      LEFT JOIN tipos_perfil tp ON tp.id = u.tipo_perfil_id
      ORDER BY p.id DESC
      LIMIT 12
    `);

    return { data: rows, total: rows.length };
  }

  @Post('portal/admin/verificacion/:id/aprobar')
  async aprobarPortalAdminVerificacion(@Param('id') id: string) {
    await this.dataSource.query(
      `
      UPDATE perfiles_proveedor
      SET verificado = true,
          fecha_actualizacion = NOW()
      WHERE id = $1::int
    `,
      [id],
    );

    return { ok: true, id: Number(id), estado: 'Aprobado' };
  }

  @Post('portal/admin/verificacion/:id/rechazar')
  async rechazarPortalAdminVerificacion(@Param('id') id: string) {
    await this.dataSource.query(
      `
      UPDATE perfiles_proveedor
      SET verificado = false,
          fecha_actualizacion = NOW()
      WHERE id = $1::int
    `,
      [id],
    );

    return { ok: true, id: Number(id), estado: 'Pendiente' };
  }

  @Get('portal/admin/activos')
  async getPortalAdminActivos() {
    await this.ensureAdminLocacionesTable();

    const tramiteRows = await this.dataSource.query(`
      SELECT
        'tramite'::text AS origen,
        tl.id,
        tl.nombre_lugar AS locacion,
        COALESCE(m.nombre, 'Sin ubicación') AS ubicacion,
        CASE
          WHEN COALESCE(tl.observaciones, '') ILIKE '%[mantenimiento]%' THEN 'En mantenimiento'
          WHEN COUNT(t.id) > 0 THEN 'Activo'
          ELSE 'Activo'
        END AS estado,
        COUNT(t.id)::int AS reservas
      FROM tramite_locaciones tl
      LEFT JOIN municipios m ON m.id = tl.municipio_id
      LEFT JOIN tramites t ON t.id = tl.tramite_id
      GROUP BY tl.id, tl.nombre_lugar, m.nombre, tl.observaciones
      ORDER BY tl.id DESC
      LIMIT 15
    `);

    const manualRows = await this.dataSource.query(`
      SELECT
        'manual'::text AS origen,
        l.id,
        l.nombre_lugar AS locacion,
        COALESCE(m.nombre, 'Sin ubicación') AS ubicacion,
        CASE WHEN l.activo THEN 'Activo' ELSE 'Inactivo' END AS estado,
        0::int AS reservas
      FROM admin_locaciones l
      LEFT JOIN municipios m ON m.id = l.municipio_id
      ORDER BY l.id DESC
      LIMIT 30
    `);

    const rows = [...manualRows, ...tramiteRows];

    return { data: rows, total: rows.length };
  }

  @Post('portal/admin/activos/:id/toggle-mantenimiento')
  async togglePortalAdminActivo(@Param('id') id: string, @Body() body?: { origen?: 'tramite' | 'manual' }) {
    const origen = body?.origen ?? 'tramite';

    if (origen === 'manual') {
      const [manual] = await this.dataSource.query(
        `SELECT id, activo FROM admin_locaciones WHERE id = $1::int LIMIT 1`,
        [id],
      );

      if (!manual?.id) {
        return { ok: false, message: 'Locación manual no encontrada' };
      }

      await this.dataSource.query(
        `
        UPDATE admin_locaciones
        SET activo = NOT activo,
            updated_at = NOW()
        WHERE id = $1::int
      `,
        [id],
      );

      return {
        ok: true,
        id: Number(id),
        estado: manual.activo ? 'Inactivo' : 'Activo',
      };
    }

    const [loc] = await this.dataSource.query(
      `SELECT id, COALESCE(observaciones, '') AS observaciones FROM tramite_locaciones WHERE id = $1::int LIMIT 1`,
      [id],
    );

    if (!loc?.id) {
      return { ok: false, message: 'Activo no encontrado' };
    }

    const current = String(loc.observaciones || '');
    const inMaintenance = current.toLowerCase().includes('[mantenimiento]');
    const updated = inMaintenance
      ? current.replace(/\[mantenimiento\]\s*/gi, '').trim()
      : `[mantenimiento] ${current}`.trim();

    await this.dataSource.query(
      `
      UPDATE tramite_locaciones
      SET observaciones = $2,
          fecha_actualizacion = NOW()
      WHERE id = $1::int
    `,
      [id, updated],
    );

    return {
      ok: true,
      id: Number(id),
      estado: inMaintenance ? 'Activo' : 'En mantenimiento',
    };
  }

  @Post('portal/admin/locaciones')
  async crearPortalAdminLocacion(
    @Body()
    body?: {
      nombre_lugar?: string;
      municipio_id?: number;
      tipo_espacio_id?: number;
      observaciones?: string;
    },
  ) {
    await this.ensureAdminLocacionesTable();

    const nombre = String(body?.nombre_lugar ?? '').trim();
    if (!nombre) {
      return { ok: false, message: 'El nombre de la locación es obligatorio' };
    }

    const [inserted] = await this.dataSource.query(
      `
      INSERT INTO admin_locaciones (nombre_lugar, municipio_id, tipo_espacio_id, observaciones, activo)
      VALUES ($1, $2, $3, $4, true)
      RETURNING id, nombre_lugar
    `,
      [
        nombre,
        body?.municipio_id ?? null,
        body?.tipo_espacio_id ?? null,
        body?.observaciones ?? null,
      ],
    );

    return { ok: true, data: inserted };
  }

  @Get('portal/admin/flujo-permisos')
  async getPortalAdminFlujoPermisos(@Query('q') q?: string) {
    const base = await this.dataSource.query(`
      SELECT
        t.id,
        t.numero_radicado,
        COALESCE(p.nombre_proyecto, 'Proyecto sin nombre') AS proyecto,
        COALESCE(p.productora, 'Productora') AS productora,
        COALESCE(m.nombre, 'Boyacá') AS ciudad,
        COALESCE(e.nombre, 'Pendiente') AS estado,
        COALESCE(t.fecha_solicitud::date, CURRENT_DATE) AS fecha
      FROM tramites t
      LEFT JOIN proyectos p ON p.id = t.proyecto_id
      LEFT JOIN estados_tramite e ON e.id = t.estado_tramite_id
      LEFT JOIN LATERAL (
        SELECT l.*
        FROM tramite_locaciones l
        WHERE l.tramite_id = t.id
        ORDER BY l.id ASC
        LIMIT 1
      ) tl ON true
      LEFT JOIN municipios m ON m.id = tl.municipio_id
      ORDER BY t.fecha_solicitud DESC
      LIMIT 30
    `);

    const query = (q ?? '').toLowerCase().trim();
    const data = query
      ? base.filter((item: any) => `${item.numero_radicado} ${item.proyecto}`.toLowerCase().includes(query))
      : base;

    const normalize = (value: string) => {
      const n = String(value || '').toLowerCase();
      if (n.includes('aprob')) return 'Aprobado';
      if (n.includes('rech')) return 'Rechazado';
      if (n.includes('subsan') || n.includes('corre')) return 'En corrección';
      return 'Pendiente';
    };

    const resumen = {
      pendientes: data.filter((i: any) => normalize(i.estado) === 'Pendiente').length,
      revision: data.filter((i: any) => normalize(i.estado) === 'En corrección').length,
      aprobados: data.filter((i: any) => normalize(i.estado) === 'Aprobado').length,
      rechazados: data.filter((i: any) => normalize(i.estado) === 'Rechazado').length,
    };

    return {
      resumen,
      data: data.map((item: any) => ({ ...item, estado_ui: normalize(item.estado) })),
      total: data.length,
    };
  }

  @Post('portal/admin/flujo-permisos/:id/estado')
  async actualizarPortalAdminFlujoPermiso(
    @Param('id') id: string,
    @Body() body?: { accion?: 'aprobar' | 'rechazar' | 'correccion' },
  ) {
    const accion = body?.accion ?? 'correccion';
    const estadoActual = await this.dataSource.query(
      `SELECT estado_tramite_id FROM tramites WHERE id = $1::int LIMIT 1`,
      [id],
    );

    const estadoAnteriorId = estadoActual?.[0]?.estado_tramite_id ?? null;
    let estadoNuevoId: number | null = null;

    if (accion === 'aprobar') {
      estadoNuevoId = await this.resolveEstadoTramiteId(['aprob']);
    } else if (accion === 'rechazar') {
      estadoNuevoId = await this.resolveEstadoTramiteId(['rech']);
    } else {
      estadoNuevoId = await this.resolveEstadoTramiteId(['subsan', 'corre']);
    }

    if (!estadoNuevoId) {
      return { ok: false, message: 'No se encontró estado de trámite compatible para la acción.' };
    }

    await this.dataSource.query(
      `
      UPDATE tramites
      SET estado_tramite_id = $2::int,
          fecha_actualizacion = NOW()
      WHERE id = $1::int
    `,
      [id, estadoNuevoId],
    );

    await this.dataSource.query(
      `
      INSERT INTO historial_tramite (tramite_id, estado_anterior_id, estado_nuevo_id, accion, observacion)
      VALUES ($1::int, $2::int, $3::int, $4, $5)
    `,
      [
        id,
        estadoAnteriorId,
        estadoNuevoId,
        `admin_${accion}`,
        `Actualización administrativa de estado: ${accion}`,
      ],
    );

    return { ok: true, id: Number(id), accion };
  }

  @Get('portal/admin/comites')
  async getPortalAdminComites() {
    await this.ensureAdminComitesTable();

    const [count] = await this.dataSource.query(`SELECT COUNT(*)::int AS total FROM admin_comites_tecnicos`);
    if ((count?.total ?? 0) === 0) {
      await this.dataSource.query(`
        INSERT INTO admin_comites_tecnicos (nombre, cargo, especialidad, activo)
        VALUES
          ('Dr. Fernando Ruiz', 'Presidente', 'Derecho Cinematográfico', true),
          ('Dra. Carmen Vargas', 'Vocal', 'Medio Ambiente', true),
          ('Ing. Miguel Torres', 'Vocal', 'Infraestructura', false)
      `);
    }

    const data = await this.dataSource.query(`
      SELECT id, nombre, cargo, especialidad,
      CASE WHEN activo THEN 'Activo' ELSE 'Inactivo' END AS estado
      FROM admin_comites_tecnicos
      ORDER BY id ASC
    `);

    return { data, total: data.length };
  }

  @Post('portal/admin/comites')
  async crearPortalAdminComite(
    @Body()
    body?: {
      nombre?: string;
      cargo?: string;
      especialidad?: string;
      estado?: string;
    },
  ) {
    await this.ensureAdminComitesTable();

    const nombre = String(body?.nombre ?? '').trim();
    const cargo = String(body?.cargo ?? '').trim();
    const especialidad = String(body?.especialidad ?? '').trim();
    const estado = String(body?.estado ?? 'Activo').trim().toLowerCase();

    if (!nombre || !cargo || !especialidad) {
      return { ok: false, message: 'Nombre, cargo y especialidad son obligatorios.' };
    }

    const [inserted] = await this.dataSource.query(
      `
      INSERT INTO admin_comites_tecnicos (nombre, cargo, especialidad, activo)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre, cargo, especialidad,
      CASE WHEN activo THEN 'Activo' ELSE 'Inactivo' END AS estado
    `,
      [nombre, cargo, especialidad, estado !== 'inactivo'],
    );

    return { ok: true, data: inserted };
  }

  @Post('portal/admin/comites/:id/toggle')
  async togglePortalAdminComite(@Param('id') id: string) {
    await this.ensureAdminComitesTable();

    await this.dataSource.query(`
      UPDATE admin_comites_tecnicos
      SET activo = NOT activo,
          updated_at = NOW()
      WHERE id = $1::int
    `, [id]);

    return { ok: true, id: Number(id) };
  }

  @Get('portal/admin/finanzas')
  async getPortalAdminFinanzas() {
    const [metrics] = await this.dataSource.query(`
      SELECT
        COALESCE(SUM(COALESCE(p.presupuesto_total, 0)), 0)::numeric AS ingresos_mes,
        COALESCE(SUM(CASE WHEN LOWER(COALESCE(e.nombre, '')) LIKE '%pend%' THEN COALESCE(p.presupuesto_total, 0) ELSE 0 END), 0)::numeric AS pendientes,
        COALESCE(SUM(CASE WHEN LOWER(COALESCE(e.nombre, '')) LIKE '%rech%' THEN COALESCE(p.presupuesto_total, 0) ELSE 0 END), 0)::numeric AS reembolsos,
        COUNT(DISTINCT t.id)::int AS reservas_activas
      FROM tramites t
      LEFT JOIN proyectos p ON p.id = t.proyecto_id
      LEFT JOIN estados_tramite e ON e.id = t.estado_tramite_id
      WHERE t.fecha_solicitud >= (CURRENT_DATE - INTERVAL '90 days')
    `);

    const reservas = await this.dataSource.query(`
      SELECT
        t.numero_radicado AS id,
        COALESCE(p.productora, 'Productora') AS cliente,
        COALESCE(l.nombre_lugar, 'Locación por definir') AS servicio,
        COALESCE(p.presupuesto_total, 0)::numeric AS monto,
        CASE
          WHEN LOWER(COALESCE(e.nombre, '')) LIKE '%aprob%' THEN 'Pagado'
          WHEN LOWER(COALESCE(e.nombre, '')) LIKE '%rech%' THEN 'Reembolsado'
          ELSE 'Pendiente'
        END AS estado
      FROM tramites t
      LEFT JOIN proyectos p ON p.id = t.proyecto_id
      LEFT JOIN estados_tramite e ON e.id = t.estado_tramite_id
      LEFT JOIN LATERAL (
        SELECT tl.nombre_lugar
        FROM tramite_locaciones tl
        WHERE tl.tramite_id = t.id
        ORDER BY tl.id ASC
        LIMIT 1
      ) l ON true
      ORDER BY t.fecha_solicitud DESC
      LIMIT 8
    `);

    return {
      metrics: {
        ingresos_mes: Number(metrics?.ingresos_mes ?? 0),
        pendientes: Number(metrics?.pendientes ?? 0),
        reembolsos: Number(metrics?.reembolsos ?? 0),
        reservas_activas: metrics?.reservas_activas ?? 0,
      },
      reservas,
    };
  }

  @Get('portal/admin/kpis')
  async getPortalAdminKpis() {
    const [stats] = await this.dataSource.query(`
      SELECT
        COALESCE(ROUND(AVG(EXTRACT(DAY FROM (COALESCE(t.fecha_respuesta, CURRENT_DATE) - t.fecha_solicitud))), 1), 0) AS tiempo_respuesta,
        COALESCE(ROUND(AVG(CASE WHEN p.verificado THEN 100 ELSE 88 END), 0), 0) AS satisfaccion,
        COALESCE(ROUND(100.0 * SUM(CASE WHEN LOWER(COALESCE(e.nombre, '')) LIKE '%aprob%' THEN 1 ELSE 0 END) / NULLIF(COUNT(t.id), 0), 0), 0) AS permisos_aprobados,
        COALESCE(ROUND(100.0 * SUM(CASE WHEN LOWER(COALESCE(e.nombre, '')) LIKE '%cancel%' THEN 1 ELSE 0 END) / NULLIF(COUNT(t.id), 0), 0), 0) AS tasa_cancelacion
      FROM tramites t
      LEFT JOIN estados_tramite e ON e.id = t.estado_tramite_id
      LEFT JOIN perfiles_proveedor p ON p.visible_directorio = true
    `);

    const permisosProcesados = await this.dataSource.query(`
      SELECT TO_CHAR(date_trunc('month', t.fecha_solicitud), 'Mon') AS mes, COUNT(*)::int AS total
      FROM tramites t
      WHERE t.fecha_solicitud >= (CURRENT_DATE - INTERVAL '6 months')
      GROUP BY date_trunc('month', t.fecha_solicitud)
      ORDER BY date_trunc('month', t.fecha_solicitud)
      LIMIT 6
    `);

    const ingresosMensuales = await this.dataSource.query(`
      SELECT TO_CHAR(date_trunc('month', t.fecha_solicitud), 'Mon') AS mes,
      COALESCE(SUM(COALESCE(p.presupuesto_total, 0)), 0)::numeric AS total
      FROM tramites t
      LEFT JOIN proyectos p ON p.id = t.proyecto_id
      WHERE t.fecha_solicitud >= (CURRENT_DATE - INTERVAL '6 months')
      GROUP BY date_trunc('month', t.fecha_solicitud)
      ORDER BY date_trunc('month', t.fecha_solicitud)
      LIMIT 6
    `);

    return {
      permisosProcesados,
      ingresosMensuales: ingresosMensuales.map((i: any) => ({ ...i, total: Number(i.total) })),
      indicadores: {
        tiempo_respuesta: Number(stats?.tiempo_respuesta ?? 0),
        satisfaccion: Number(stats?.satisfaccion ?? 0),
        permisos_aprobados: Number(stats?.permisos_aprobados ?? 0),
        tasa_cancelacion: Number(stats?.tasa_cancelacion ?? 0),
      },
    };
  }

  @Get('portal/admin/comunicaciones')
  async getPortalAdminComunicaciones() {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS admin_config_notificaciones (
        id SERIAL PRIMARY KEY,
        codigo VARCHAR(80) UNIQUE NOT NULL,
        nombre VARCHAR(160) NOT NULL,
        activo BOOLEAN DEFAULT true,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const defaults = [
      ['nuevo_usuario', 'Nuevo registro de usuario', true],
      ['solicitud_permiso', 'Solicitud de permiso P.U.F.A.B.', true],
      ['pago_confirmado', 'Pago confirmado', true],
      ['perfil_pendiente', 'Perfil pendiente de verificación', false],
      ['reserva_cancelada', 'Reserva cancelada', true],
    ];

    for (const item of defaults) {
      await this.dataSource.query(
        `
        INSERT INTO admin_config_notificaciones (codigo, nombre, activo)
        VALUES ($1, $2, $3)
        ON CONFLICT (codigo) DO NOTHING
      `,
        item,
      );
    }

    const data = await this.dataSource.query(`
      SELECT id, codigo, nombre, activo
      FROM admin_config_notificaciones
      ORDER BY id ASC
    `);

    return { data, total: data.length };
  }

  @Post('portal/admin/comunicaciones/:id/toggle')
  async togglePortalAdminComunicaciones(@Param('id') id: string) {
    await this.dataSource.query(`
      UPDATE admin_config_notificaciones
      SET activo = NOT activo,
          updated_at = NOW()
      WHERE id = $1::int
    `, [id]);

    return { ok: true, id: Number(id) };
  }

  @Get('portal/academico/panel')
  async getPortalAcademicoPanel() {
    const [stats] = await this.dataSource.query(`
      SELECT
        (SELECT COUNT(*)::int FROM proyectos) AS producciones,
        (SELECT COUNT(*)::int FROM perfiles_proveedor WHERE visible_directorio = true) AS tutoriales,
        (SELECT COUNT(*)::int FROM tramites WHERE fecha_solicitud >= (CURRENT_DATE - INTERVAL '90 days')) AS pasantias,
        (SELECT COUNT(*)::int FROM historial_tramite WHERE observacion IS NOT NULL) AS documentos
    `);

    const aplicaciones = await this.dataSource.query(`
      SELECT
        COALESCE(p.nombre_proyecto, 'Proyecto sin nombre') AS titulo,
        CASE
          WHEN LOWER(COALESCE(e.nombre, '')) LIKE '%aprob%' THEN 'Aceptada'
          WHEN LOWER(COALESCE(e.nombre, '')) LIKE '%subsan%' THEN 'En revisión'
          ELSE 'En revisión'
        END AS estado
      FROM tramites t
      LEFT JOIN proyectos p ON p.id = t.proyecto_id
      LEFT JOIN estados_tramite e ON e.id = t.estado_tramite_id
      ORDER BY t.fecha_solicitud DESC
      LIMIT 3
    `);

    return {
      stats: {
        producciones: stats?.producciones ?? 0,
        tutoriales: stats?.tutoriales ?? 0,
        pasantias: stats?.pasantias ?? 0,
        documentos: stats?.documentos ?? 0,
      },
      acciones: [
        'Ver Estadísticas del Sector',
        'Acceder a Tutoriales',
        'Buscar Pasantías',
      ],
      aplicaciones,
    };
  }

  @Get('portal/academico/observatorio')
  async getPortalAcademicoObservatorio() {
    const [metrics] = await this.dataSource.query(`
      SELECT
        COALESCE(SUM(COALESCE(p.presupuesto_total, 0)), 0)::numeric AS inversion,
        (SELECT COUNT(*)::int FROM tramites) AS tramites,
        (SELECT COUNT(*)::int FROM perfiles_proveedor WHERE visible_directorio = true) AS equipos,
        (SELECT ROUND(AVG(EXTRACT(DAY FROM (COALESCE(t.fecha_respuesta, CURRENT_DATE) - t.fecha_solicitud))), 1)
         FROM tramites t
         WHERE t.fecha_solicitud IS NOT NULL) AS respuesta_promedio
      FROM proyectos p
    `);

    const porTipo = await this.dataSource.query(`
      SELECT
        COALESCE(LOWER(te.nombre), 'natural') AS tipo,
        COUNT(*)::int AS total
      FROM tramite_locaciones tl
      LEFT JOIN tipo_espacio te ON te.id = tl.tipo_espacio_id
      GROUP BY COALESCE(LOWER(te.nombre), 'natural')
      ORDER BY total DESC
      LIMIT 5
    `);

    const porProvincia = await this.dataSource.query(`
      SELECT
        COALESCE(m.nombre, 'Sin municipio') AS provincia,
        COUNT(*)::int AS total
      FROM tramite_locaciones tl
      LEFT JOIN municipios m ON m.id = tl.municipio_id
      GROUP BY COALESCE(m.nombre, 'Sin municipio')
      ORDER BY total DESC
      LIMIT 5
    `);

    return {
      metrics: {
        inversion: Number(metrics?.inversion ?? 0),
        tramites: metrics?.tramites ?? 0,
        equipos: metrics?.equipos ?? 0,
        respuesta_promedio: Number(metrics?.respuesta_promedio ?? 0),
      },
      porTipo,
      porProvincia,
      tendencia: [12, 15, 18, 22, 28, 24],
      documentos: [
        { titulo: 'Ley de Cine 814 de 2003', tipo: 'Normativa' },
        { titulo: 'Decreto 392 de 2018', tipo: 'Incentivos' },
        { titulo: 'Guía PUFAB 2024', tipo: 'Trámites' },
      ],
    };
  }

  @Get('portal/academico/capacitacion')
  async getPortalAcademicoCapacitacion(@Query('q') q?: string) {
    const cursos = [
      {
        titulo: 'Introducción al P.U.F.A.B.',
        nivel: 'Básico',
        duracion: '15 min',
        rating: 4.8,
        imagen: 'https://www.figma.com/api/mcp/asset/4715cfab-dc09-4f64-aeae-b1bc228dc5f4',
      },
      {
        titulo: 'Scouting de Locaciones en Boyacá',
        nivel: 'Intermedio',
        duracion: '28 min',
        rating: 4.9,
        imagen: 'https://www.figma.com/api/mcp/asset/b76e7138-8273-4407-97de-35e83a360c53',
      },
      {
        titulo: 'Gestión de Permisos Ambientales',
        nivel: 'Avanzado',
        duracion: '22 min',
        rating: 4.7,
        imagen: 'https://www.figma.com/api/mcp/asset/9f93a85f-ea22-4330-97cf-0c1fafa30488',
      },
      {
        titulo: 'Producción Sostenible',
        nivel: 'Intermedio',
        duracion: '18 min',
        rating: 4.6,
        imagen: 'https://www.figma.com/api/mcp/asset/8257c48e-90f6-4530-902f-9b452baf5417',
      },
    ];

    const search = (q ?? '').toLowerCase().trim();
    const data = search
      ? cursos.filter((c) => c.titulo.toLowerCase().includes(search))
      : cursos;

    return { data, total: data.length };
  }

  @Get('portal/academico/pasantias')
  async getPortalAcademicoPasantias() {
    const vacantes = await this.dataSource.query(`
      SELECT
        t.numero_radicado AS codigo,
        COALESCE(p.nombre_proyecto, 'Proyecto sin nombre') AS proyecto,
        COALESCE(m.nombre, 'Boyacá') AS ciudad,
        COALESCE(t.fecha_solicitud::date, CURRENT_DATE) AS inicio,
        COALESCE((t.fecha_solicitud + INTERVAL '45 days')::date, CURRENT_DATE) AS cierre,
        COALESCE(e.nombre, 'En revisión') AS estado
      FROM tramites t
      LEFT JOIN proyectos p ON p.id = t.proyecto_id
      LEFT JOIN estados_tramite e ON e.id = t.estado_tramite_id
      LEFT JOIN LATERAL (
        SELECT l.*
        FROM tramite_locaciones l
        WHERE l.tramite_id = t.id
        ORDER BY l.id ASC
        LIMIT 1
      ) tl ON true
      LEFT JOIN municipios m ON m.id = tl.municipio_id
      ORDER BY t.fecha_solicitud DESC
      LIMIT 5
    `);

    return { data: vacantes, total: vacantes.length };
  }

  @Get('portal/academico/recursos')
  async getPortalAcademicoRecursos() {
    const [stats] = await this.dataSource.query(`
      SELECT
        (SELECT COUNT(*)::int FROM historial_tramite WHERE observacion IS NOT NULL) AS documentos,
        (SELECT COUNT(*)::int FROM perfiles_proveedor WHERE visible_directorio = true) AS tutoriales,
        (SELECT COUNT(*)::int FROM tramites) AS estadisticas
    `);

    return {
      documentos: {
        total: stats?.documentos ?? 0,
        descripcion: 'Accede a leyes, decretos y reglamentos del sector cinematográfico.',
      },
      tutoriales: {
        total: stats?.tutoriales ?? 0,
        descripcion: 'Aprende con nuestros tutoriales sobre trámites y producción.',
      },
      estadisticas: {
        total: stats?.estadisticas ?? 0,
        descripcion: 'Datos actualizados sobre la industria cinematográfica en Boyacá.',
      },
    };
  }
}
