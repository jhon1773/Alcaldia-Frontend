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

type DemoAuthUser = {
  email: string;
  tipoPersona: 'natural' | 'juridica';
  telefono: string;
  tipoPerfilCodigo: string;
  rolCodigo: string;
};

const demoUsers: DemoAuthUser[] = [
  {
    email: 'demo.admin@pufab.gov.co',
    tipoPersona: 'natural',
    telefono: '3102000001',
    tipoPerfilCodigo: 'admin',
    rolCodigo: 'admin',
  },
  {
    email: 'demo.productora@pufab.gov.co',
    tipoPersona: 'juridica',
    telefono: '3102000002',
    tipoPerfilCodigo: 'productora',
    rolCodigo: 'solicitante',
  },
  {
    email: 'demo.proveedor@pufab.gov.co',
    tipoPersona: 'juridica',
    telefono: '3102000003',
    tipoPerfilCodigo: 'proveedor',
    rolCodigo: 'proveedor',
  },
  {
    email: 'demo.academico@pufab.gov.co',
    tipoPersona: 'natural',
    telefono: '3102000004',
    tipoPerfilCodigo: 'academico',
    rolCodigo: 'academico',
  },
];

async function seedAuthDemo() {
  await dataSource.initialize();
  const qr = dataSource.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  try {
    await qr.query(`
      INSERT INTO tipos_perfil (codigo, nombre, descripcion, activo)
      VALUES
        ('admin', 'Administrador', 'Perfil administrativo', true),
        ('productora', 'Productora', 'Perfil de productora', true),
        ('proveedor', 'Proveedor', 'Perfil proveedor', true),
        ('academico', 'Académico', 'Perfil académico', true)
      ON CONFLICT (codigo) DO NOTHING
    `);

    await qr.query(`
      INSERT INTO roles (codigo, nombre, descripcion, activo)
      VALUES
        ('admin', 'Administrador', 'Rol administrativo', true),
        ('solicitante', 'Solicitante', 'Rol productor solicitante', true),
        ('proveedor', 'Proveedor', 'Rol proveedor', true),
        ('academico', 'Académico', 'Rol académico', true),
        ('revisor', 'Revisor', 'Rol de revisión', true)
      ON CONFLICT (codigo) DO NOTHING
    `);

    const [estadoActivo] = await qr.query(`SELECT id FROM estados_cuenta WHERE codigo = 'activo' LIMIT 1`);
    if (!estadoActivo?.id) {
      throw new Error('No existe estado_cuenta activo. Ejecuta primero el seed principal.');
    }

    const passwordHash = await bcrypt.hash('Demo2026!', 10);

    for (const user of demoUsers) {
      const [tipoPerfil] = await qr.query(
        `SELECT id FROM tipos_perfil WHERE codigo = $1 LIMIT 1`,
        [user.tipoPerfilCodigo],
      );
      const [rol] = await qr.query(`SELECT id FROM roles WHERE codigo = $1 LIMIT 1`, [user.rolCodigo]);

      if (!tipoPerfil?.id || !rol?.id) {
        throw new Error(`No se encontró tipo_perfil o rol para ${user.email}`);
      }

      await qr.query(
        `
        INSERT INTO usuarios (tipo_persona, email, telefono, password_hash, estado_cuenta_id, tipo_perfil_id, activo, fecha_aprobacion)
        VALUES ($1, $2, $3, $4, $5, $6, true, NOW())
        ON CONFLICT (email)
        DO UPDATE SET
          tipo_persona = EXCLUDED.tipo_persona,
          telefono = EXCLUDED.telefono,
          password_hash = EXCLUDED.password_hash,
          estado_cuenta_id = EXCLUDED.estado_cuenta_id,
          tipo_perfil_id = EXCLUDED.tipo_perfil_id,
          activo = true,
          fecha_aprobacion = NOW()
      `,
        [user.tipoPersona, user.email, user.telefono, passwordHash, estadoActivo.id, tipoPerfil.id],
      );

      const [usuario] = await qr.query(`SELECT id FROM usuarios WHERE email = $1 LIMIT 1`, [user.email]);

      await qr.query(
        `
        INSERT INTO usuario_roles (usuario_id, rol_id, activo)
        SELECT $1, $2, true
        WHERE NOT EXISTS (
          SELECT 1 FROM usuario_roles ur WHERE ur.usuario_id = $1 AND ur.rol_id = $2
        )
      `,
        [usuario.id, rol.id],
      );

      if (user.rolCodigo === 'admin') {
        const [rolRevisor] = await qr.query(`SELECT id FROM roles WHERE codigo = 'revisor' LIMIT 1`);
        if (rolRevisor?.id) {
          await qr.query(
            `
            INSERT INTO usuario_roles (usuario_id, rol_id, activo)
            SELECT $1, $2, true
            WHERE NOT EXISTS (
              SELECT 1 FROM usuario_roles ur WHERE ur.usuario_id = $1 AND ur.rol_id = $2
            )
          `,
            [usuario.id, rolRevisor.id],
          );
        }
      }
    }

    await qr.commitTransaction();

    console.log('Seed auth demo completado.');
    console.log('Credenciales de prueba (password unica): Demo2026!');
    console.log('- demo.admin@pufab.gov.co');
    console.log('- demo.productora@pufab.gov.co');
    console.log('- demo.proveedor@pufab.gov.co');
    console.log('- demo.academico@pufab.gov.co');
  } catch (error) {
    await qr.rollbackTransaction();
    console.error('Error en seed auth demo:', error);
    throw error;
  } finally {
    await qr.release();
    await dataSource.destroy();
  }
}

seedAuthDemo();
