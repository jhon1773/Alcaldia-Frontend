import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || process.env.DB_NAME || 'pufa_db',
});

type DemoProvider = {
  email: string;
  telefono: string;
  descripcion: string;
  sitioWeb: string;
  subcategoriaCodigo: string;
  especialidadCodigo: string;
};

const demoProviders: DemoProvider[] = [
  {
    email: 'demo.produccion@pufab.gov.co',
    telefono: '3101001001',
    descripcion:
      'Productora local especializada en coordinación de rodaje, permisos y logística para cine y series.',
    sitioWeb: 'https://demo-produccion-boyaca.example.com',
    subcategoriaCodigo: 'service_produccion',
    especialidadCodigo: 'esp_produccion',
  },
  {
    email: 'demo.locaciones@pufab.gov.co',
    telefono: '3101001002',
    descripcion:
      'Gestión de locaciones naturales en Boyacá para proyectos audiovisuales con scouting completo.',
    sitioWeb: 'https://demo-locaciones-boyaca.example.com',
    subcategoriaCodigo: 'loc_natural',
    especialidadCodigo: 'esp_busq_loc',
  },
  {
    email: 'demo.fotografia@pufab.gov.co',
    telefono: '3101001003',
    descripcion:
      'Equipo técnico para dirección de fotografía, cámara y luminotecnia en producciones nacionales.',
    sitioWeb: 'https://demo-foto-boyaca.example.com',
    subcategoriaCodigo: 'art_fotografia',
    especialidadCodigo: 'rol_dfp',
  },
];

async function seedDirectorioDemo() {
  await dataSource.initialize();
  const qr = dataSource.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  try {
    await qr.query(`
      INSERT INTO estados_cuenta (codigo, nombre, activo)
      VALUES ('activo', 'Activo', true)
      ON CONFLICT (codigo) DO NOTHING
    `);

    await qr.query(`
      INSERT INTO tipos_perfil (codigo, nombre, descripcion, activo)
      VALUES ('proveedor', 'Proveedor', 'Prestador de servicios audiovisuales', true)
      ON CONFLICT (codigo) DO NOTHING
    `);

    await qr.query(`
      INSERT INTO roles (codigo, nombre, descripcion, activo)
      VALUES ('proveedor', 'Proveedor', 'Gestiona su perfil en el directorio', true)
      ON CONFLICT (codigo) DO NOTHING
    `);

    await qr.query(`
      INSERT INTO rangos_experiencia_sector (nombre)
      VALUES ('1 a 3 años')
      ON CONFLICT DO NOTHING
    `);

    await qr.query(`
      INSERT INTO categorias_proveedor (codigo, nombre, descripcion, activo)
      VALUES
        ('service', 'Empresas de Service (Producción y Logística)', 'Soporte de producción', true),
        ('locaciones', 'Locaciones', 'Locaciones para cine y TV', true),
        ('artisticos_tecnicos', 'Servicios Artísticos y Técnicos', 'Talento técnico audiovisual', true)
      ON CONFLICT (codigo) DO NOTHING
    `);

    const [catService] = await qr.query(`SELECT id FROM categorias_proveedor WHERE codigo = 'service' LIMIT 1`);
    const [catLoc] = await qr.query(`SELECT id FROM categorias_proveedor WHERE codigo = 'locaciones' LIMIT 1`);
    const [catArt] = await qr.query(`SELECT id FROM categorias_proveedor WHERE codigo = 'artisticos_tecnicos' LIMIT 1`);

    await qr.query(
      `
      INSERT INTO subcategorias_proveedor (categoria_proveedor_id, codigo, nombre, descripcion, activo)
      VALUES
        ($1, 'service_produccion', 'Producción', 'Producción y coordinación de rodaje', true),
        ($2, 'loc_natural', 'Natural', 'Locaciones naturales en Boyacá', true),
        ($3, 'art_fotografia', 'Dirección de fotografía y cámara', 'Servicios de fotografía y cámara', true)
      ON CONFLICT (codigo) DO NOTHING
    `,
      [catService.id, catLoc.id, catArt.id],
    );

    const [subService] = await qr.query(`SELECT id FROM subcategorias_proveedor WHERE codigo = 'service_produccion' LIMIT 1`);
    const [subLoc] = await qr.query(`SELECT id FROM subcategorias_proveedor WHERE codigo = 'loc_natural' LIMIT 1`);
    const [subFoto] = await qr.query(`SELECT id FROM subcategorias_proveedor WHERE codigo = 'art_fotografia' LIMIT 1`);

    await qr.query(
      `
      INSERT INTO especialidades_proveedor (subcategoria_proveedor_id, codigo, nombre, activo)
      VALUES
        ($1, 'esp_produccion', 'Producción', true),
        ($2, 'esp_busq_loc', 'Búsqueda y evaluación de locaciones', true),
        ($3, 'rol_dfp', 'Director/a de fotografía', true)
      ON CONFLICT (codigo) DO NOTHING
    `,
      [subService.id, subLoc.id, subFoto.id],
    );

    const [estadoActivo] = await qr.query(`SELECT id FROM estados_cuenta WHERE codigo = 'activo' LIMIT 1`);
    const [tipoProveedor] = await qr.query(`SELECT id FROM tipos_perfil WHERE codigo = 'proveedor' LIMIT 1`);
    const [rolProveedor] = await qr.query(`SELECT id FROM roles WHERE codigo = 'proveedor' LIMIT 1`);
    const [rangoExp] = await qr.query(`SELECT id FROM rangos_experiencia_sector ORDER BY id ASC LIMIT 1`);

    if (!estadoActivo?.id || !tipoProveedor?.id || !rangoExp?.id) {
      throw new Error('Faltan catálogos base. Ejecuta primero el seed principal.');
    }

    const passwordHash = await bcrypt.hash('Proveedor2026!', 10);

    for (const item of demoProviders) {
      await qr.query(
        `
        INSERT INTO usuarios (tipo_persona, email, telefono, password_hash, estado_cuenta_id, tipo_perfil_id, activo)
        VALUES ('juridica', $1, $2, $3, $4, $5, true)
        ON CONFLICT (email)
        DO UPDATE SET
          telefono = EXCLUDED.telefono,
          tipo_perfil_id = EXCLUDED.tipo_perfil_id,
          estado_cuenta_id = EXCLUDED.estado_cuenta_id,
          activo = true
      `,
        [item.email, item.telefono, passwordHash, estadoActivo.id, tipoProveedor.id],
      );

      const [usuario] = await qr.query(`SELECT id FROM usuarios WHERE email = $1 LIMIT 1`, [item.email]);
      const [subcategoria] = await qr.query(
        `SELECT id FROM subcategorias_proveedor WHERE codigo = $1 LIMIT 1`,
        [item.subcategoriaCodigo],
      );
      const [especialidad] = await qr.query(
        `SELECT id FROM especialidades_proveedor WHERE codigo = $1 LIMIT 1`,
        [item.especialidadCodigo],
      );

      if (!usuario?.id || !subcategoria?.id) {
        throw new Error(`No se pudo resolver usuario/subcategoría para ${item.email}`);
      }

      if (rolProveedor?.id) {
        await qr.query(
          `
          INSERT INTO usuario_roles (usuario_id, rol_id, activo)
          SELECT $1, $2, true
          WHERE NOT EXISTS (
            SELECT 1 FROM usuario_roles ur WHERE ur.usuario_id = $1 AND ur.rol_id = $2
          )
        `,
          [usuario.id, rolProveedor.id],
        );
      }

      await qr.query(
        `
        INSERT INTO perfiles_proveedor (usuario_id, descripcion_perfil, experiencia_sector_id, sitio_web, visible_directorio, verificado)
        VALUES ($1, $2, $3, $4, true, true)
        ON CONFLICT (usuario_id)
        DO UPDATE SET
          descripcion_perfil = EXCLUDED.descripcion_perfil,
          experiencia_sector_id = EXCLUDED.experiencia_sector_id,
          sitio_web = EXCLUDED.sitio_web,
          visible_directorio = true,
          verificado = true
      `,
        [usuario.id, item.descripcion, rangoExp.id, item.sitioWeb],
      );

      const [perfil] = await qr.query(`SELECT id FROM perfiles_proveedor WHERE usuario_id = $1 LIMIT 1`, [usuario.id]);

      await qr.query(
        `
        INSERT INTO perfil_proveedor_subcategorias (perfil_proveedor_id, subcategoria_proveedor_id)
        SELECT $1, $2
        WHERE NOT EXISTS (
          SELECT 1 FROM perfil_proveedor_subcategorias ps
          WHERE ps.perfil_proveedor_id = $1 AND ps.subcategoria_proveedor_id = $2
        )
      `,
        [perfil.id, subcategoria.id],
      );

      if (especialidad?.id) {
        await qr.query(
          `
          INSERT INTO perfil_proveedor_especialidades (perfil_proveedor_id, especialidad_proveedor_id)
          SELECT $1, $2
          WHERE NOT EXISTS (
            SELECT 1 FROM perfil_proveedor_especialidades pe
            WHERE pe.perfil_proveedor_id = $1 AND pe.especialidad_proveedor_id = $2
          )
        `,
          [perfil.id, especialidad.id],
        );
      }
    }

    await qr.commitTransaction();
    console.log('Seed de directorio demo completado.');
    console.log('Usuarios demo:');
    console.log('- demo.produccion@pufab.gov.co');
    console.log('- demo.locaciones@pufab.gov.co');
    console.log('- demo.fotografia@pufab.gov.co');
    console.log('Password demo: Proveedor2026!');
  } catch (error) {
    await qr.rollbackTransaction();
    console.error('Error en seed de directorio demo:', error);
    throw error;
  } finally {
    await qr.release();
    await dataSource.destroy();
  }
}

seedDirectorioDemo();
