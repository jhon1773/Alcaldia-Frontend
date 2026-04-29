const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { Client } = require('pg');

const envPath = path.join(process.cwd(), '.env');
dotenv.config({ path: envPath });

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`Falta la variable de entorno requerida: ${name}`);
  }
  return String(value).trim();
}

function parsePort(value, fallback) {
  const port = Number.parseInt(String(value ?? fallback), 10);
  return Number.isFinite(port) && port > 0 ? port : fallback;
}

async function main() {
  const client = new Client({
    host: requireEnv('DB_HOST'),
    port: parsePort(process.env.DB_PORT, 5432),
    user: requireEnv('DB_USERNAME'),
    password: requireEnv('DB_PASSWORD'),
    database: requireEnv('DB_DATABASE'),
  });

  await client.connect();
  await client.query('BEGIN');

  try {
    const [estadoActivo] = (await client.query(`SELECT id, codigo FROM estados_cuenta WHERE codigo = $1 LIMIT 1`, ['activo'])).rows;
    const [estadoPendiente] = (await client.query(`SELECT id, codigo FROM estados_cuenta WHERE codigo = $1 LIMIT 1`, ['pendiente'])).rows;
    const perfiles = await client.query(`SELECT id, codigo FROM tipos_perfil WHERE codigo = ANY($1::text[])`, [['admin', 'productora', 'proveedor', 'academico']]);
    const roles = await client.query(`SELECT id, codigo FROM roles WHERE codigo = ANY($1::text[])`, [['admin', 'solicitante', 'proveedor', 'academico']]);

    const tipoPerfilByCode = new Map(perfiles.rows.map((row) => [row.codigo, row.id]));
    const rolByCode = new Map(roles.rows.map((row) => [row.codigo, row.id]));

    if (!estadoActivo || !estadoPendiente) {
      throw new Error('No se encontraron los estados de cuenta requeridos (activo, pendiente).');
    }

    const demoUsers = [
      {
        email: 'admin@pufab.gov.co',
        password: 'Admin2026!',
        tipo_persona: 'natural',
        tipo_perfil: 'admin',
        rol: 'admin',
        telefono: '+57 310 555 9001',
        avatar_url: '/uploads/perfiles/admin-demo.svg',
        bio: 'Administradora institucional de la Comisión Fílmica de Boyacá. Supervisa aprobaciones, accesos y operación general del sistema.',
        personaNatural: {
          primer_nombre: 'Daniela',
          segundo_nombre: 'Andrea',
          primer_apellido: 'Rojas',
          segundo_apellido: 'Peñaloza',
          tipo_identificacion_id: 1,
          numero_documento: '1032456781',
          municipio_residencia_id: 1,
          direccion: 'Carrera 9 # 20-45, Tunja',
          lugar_nacimiento: 'Tunja',
          fecha_nacimiento: '1988-03-18',
          sexo_nacer_id: 2,
          identidad_genero_id: 2,
          nivel_educativo_id: 6,
          ingles_habla: 4,
          ingles_lee: 4,
          ingles_escribe: 4,
        },
      },
      {
        email: 'valeria.ramirez@luminafilms.co',
        password: 'Prod2026!',
        tipo_persona: 'natural',
        tipo_perfil: 'productora',
        rol: 'solicitante',
        telefono: '+57 311 488 2201',
        avatar_url: '/uploads/perfiles/productora-demo.svg',
        bio: 'Productora ejecutiva con experiencia en comerciales, documentales y servicios de producción para rodajes en escenarios patrimoniales.',
        personaNatural: {
          primer_nombre: 'Valeria',
          segundo_nombre: 'María',
          primer_apellido: 'Ramírez',
          segundo_apellido: 'Castro',
          tipo_identificacion_id: 1,
          numero_documento: '1034567890',
          municipio_residencia_id: 2,
          direccion: 'Calle 8 # 15-30, Duitama',
          lugar_nacimiento: 'Duitama',
          fecha_nacimiento: '1992-07-09',
          sexo_nacer_id: 2,
          identidad_genero_id: 2,
          nivel_educativo_id: 5,
          tiempo_dedicacion_sector_id: 1,
          ingresos_provienen_sector_id: 1,
          ingles_habla: 4,
          ingles_lee: 5,
          ingles_escribe: 4,
        },
      },
      {
        email: 'contacto@andescine.co',
        password: 'Prov2026!',
        tipo_persona: 'juridica',
        tipo_perfil: 'proveedor',
        rol: 'proveedor',
        telefono: '+57 321 777 4410',
        avatar_url: '/uploads/perfiles/proveedor-demo.svg',
        bio: 'Empresa de servicios de producción, logística y alquiler de equipos audiovisuales para rodajes en Boyacá.',
        personaJuridica: {
          razon_social: 'Andes Cine S.A.S.',
          nit: '901.812.334-1',
          tipo_entidad_id: 2,
          fecha_constitucion: '2019-05-12',
          objeto_social: 'Prestación de servicios de producción audiovisual, alquiler de equipos, logística y asistencia de rodaje.',
          municipio_id: 1,
          direccion_fisica: 'Calle 22 # 12-34, Tunja',
          telefono_contacto: '+57 321 777 4410',
          correo_institucional: 'contacto@andescine.co',
          pagina_web: 'https://andescine.co',
          nombre_representante_legal: 'Mauricio Velasco Pinto',
          tipo_documento_representante_id: 1,
          numero_documento_representante: '80123456',
          fecha_inicio_nombramiento: '2024-01-01',
          fecha_fin_nombramiento: '2028-12-31',
          areas_trabajo: 'Producción, logística, alquiler de cámaras e iluminación, casting y transporte',
          proyectos_realizados: 'Campañas publicitarias regionales, documentales institucionales y piezas de turismo cultural',
          proyectos_en_curso: 'Cobertura de rodajes para marcas nacionales y contenidos turísticos para el departamento',
          publico_objetivo_beneficiarios: 'Productoras, agencias, realizadores independientes y entidades públicas',
          registro_soy_cultura: true,
          registro_observatorio_cultural_boyaca: true,
          ha_recibido_estimulos_apoyos_publicos: false,
          participa_redes_asociaciones: true,
          cuales_redes_asociaciones: 'Red Audiovisual de Boyacá, Cámara de Comercio, Clúster Creativo',
        },
      },
      {
        email: 'coordinacion@universidadboyaca.edu.co',
        password: 'Acad2026!',
        tipo_persona: 'natural',
        tipo_perfil: 'academico',
        rol: 'academico',
        telefono: '+57 312 640 1189',
        avatar_url: '/uploads/perfiles/academico-demo.svg',
        bio: 'Coordinador académico de cine y medios digitales con experiencia en investigación, formación y acompañamiento de semilleros.',
        personaNatural: {
          primer_nombre: 'Andrés',
          segundo_nombre: 'Felipe',
          primer_apellido: 'Torres',
          segundo_apellido: 'Mendoza',
          tipo_identificacion_id: 1,
          numero_documento: '1019876543',
          municipio_residencia_id: 3,
          direccion: 'Avenida Universitaria # 10-22, Sogamoso',
          lugar_nacimiento: 'Sogamoso',
          fecha_nacimiento: '1985-11-02',
          sexo_nacer_id: 1,
          identidad_genero_id: 1,
          nivel_educativo_id: 7,
          tiempo_dedicacion_sector_id: 1,
          ingresos_provienen_sector_id: 1,
          ingles_habla: 4,
          ingles_lee: 5,
          ingles_escribe: 4,
        },
      },
    ];

    for (const demo of demoUsers) {
      const passwordHash = await bcrypt.hash(demo.password, 10);
      const estadoId = estadoActivo.id;
      const tipoPerfilId = tipoPerfilByCode.get(demo.tipo_perfil);
      const rolId = rolByCode.get(demo.rol);

      if (!tipoPerfilId) {
        throw new Error(`No existe el tipo de perfil: ${demo.tipo_perfil}`);
      }

      if (!rolId) {
        throw new Error(`No existe el rol: ${demo.rol}`);
      }

      const usuarioResult = await client.query(
        `
        INSERT INTO usuarios (
          tipo_persona,
          email,
          telefono,
          avatar_url,
          bio,
          password_hash,
          estado_cuenta_id,
          tipo_perfil_id,
          ultimo_login,
          fecha_aprobacion,
          activo,
          fecha_registro,
          fecha_actualizacion
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NULL,$9,$10,NOW(),NOW())
        ON CONFLICT (email) DO UPDATE SET
          tipo_persona = EXCLUDED.tipo_persona,
          telefono = EXCLUDED.telefono,
          avatar_url = EXCLUDED.avatar_url,
          bio = EXCLUDED.bio,
          password_hash = EXCLUDED.password_hash,
          estado_cuenta_id = EXCLUDED.estado_cuenta_id,
          tipo_perfil_id = EXCLUDED.tipo_perfil_id,
          fecha_aprobacion = EXCLUDED.fecha_aprobacion,
          activo = EXCLUDED.activo,
          fecha_actualizacion = NOW()
        RETURNING id
        `,
        [
          demo.tipo_persona,
          demo.email,
          demo.telefono,
          demo.avatar_url,
          demo.bio,
          passwordHash,
          estadoId,
          tipoPerfilId,
          new Date(),
          true,
        ],
      );

      const usuarioId = usuarioResult.rows[0].id;

      await client.query('DELETE FROM usuario_roles WHERE usuario_id = $1', [usuarioId]);
      await client.query(
        `INSERT INTO usuario_roles (usuario_id, rol_id, asignado_por, activo) VALUES ($1, $2, NULL, true)`,
        [usuarioId, rolId],
      );

      if (demo.tipo_persona === 'natural' && demo.personaNatural) {
        await client.query(
          `
          INSERT INTO personas_naturales (
            usuario_id,
            primer_nombre,
            segundo_nombre,
            primer_apellido,
            segundo_apellido,
            tipo_identificacion_id,
            numero_documento,
            municipio_residencia_id,
            direccion,
            lugar_nacimiento,
            fecha_nacimiento,
            sexo_nacer_id,
            identidad_genero_id,
            nivel_educativo_id,
            tiempo_dedicacion_sector_id,
            ingresos_provienen_sector_id,
            ingles_habla,
            ingles_lee,
            ingles_escribe,
            pertenece_grupo_etnico,
            tiene_discapacidad,
            vive_zona_rural,
            se_considera_campesino,
            victima_conflicto_armado,
            migrante_refugiado,
            fecha_creacion,
            fecha_actualizacion
          )
          VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,false,false,false,false,false,false,NOW(),NOW()
          )
          ON CONFLICT (usuario_id) DO UPDATE SET
            primer_nombre = EXCLUDED.primer_nombre,
            segundo_nombre = EXCLUDED.segundo_nombre,
            primer_apellido = EXCLUDED.primer_apellido,
            segundo_apellido = EXCLUDED.segundo_apellido,
            tipo_identificacion_id = EXCLUDED.tipo_identificacion_id,
            numero_documento = EXCLUDED.numero_documento,
            municipio_residencia_id = EXCLUDED.municipio_residencia_id,
            direccion = EXCLUDED.direccion,
            lugar_nacimiento = EXCLUDED.lugar_nacimiento,
            fecha_nacimiento = EXCLUDED.fecha_nacimiento,
            sexo_nacer_id = EXCLUDED.sexo_nacer_id,
            identidad_genero_id = EXCLUDED.identidad_genero_id,
            nivel_educativo_id = EXCLUDED.nivel_educativo_id,
            tiempo_dedicacion_sector_id = EXCLUDED.tiempo_dedicacion_sector_id,
            ingresos_provienen_sector_id = EXCLUDED.ingresos_provienen_sector_id,
            ingles_habla = EXCLUDED.ingles_habla,
            ingles_lee = EXCLUDED.ingles_lee,
            ingles_escribe = EXCLUDED.ingles_escribe,
            fecha_actualizacion = NOW()
          `,
          [
            usuarioId,
            demo.personaNatural.primer_nombre,
            demo.personaNatural.segundo_nombre || null,
            demo.personaNatural.primer_apellido,
            demo.personaNatural.segundo_apellido || null,
            demo.personaNatural.tipo_identificacion_id || null,
            demo.personaNatural.numero_documento,
            demo.personaNatural.municipio_residencia_id || null,
            demo.personaNatural.direccion || null,
            demo.personaNatural.lugar_nacimiento || null,
            demo.personaNatural.fecha_nacimiento || null,
            demo.personaNatural.sexo_nacer_id || null,
            demo.personaNatural.identidad_genero_id || null,
            demo.personaNatural.nivel_educativo_id || null,
            demo.personaNatural.tiempo_dedicacion_sector_id || null,
            demo.personaNatural.ingresos_provienen_sector_id || null,
            demo.personaNatural.ingles_habla ?? 0,
            demo.personaNatural.ingles_lee ?? 0,
            demo.personaNatural.ingles_escribe ?? 0,
          ],
        );
      }

      if (demo.tipo_persona === 'juridica' && demo.personaJuridica) {
        await client.query(
          `
          INSERT INTO personas_juridicas (
            usuario_id,
            razon_social,
            nit,
            tipo_entidad_id,
            fecha_constitucion,
            objeto_social,
            municipio_id,
            direccion_fisica,
            telefono_contacto,
            correo_institucional,
            pagina_web,
            nombre_representante_legal,
            tipo_documento_representante_id,
            numero_documento_representante,
            fecha_inicio_nombramiento,
            fecha_fin_nombramiento,
            areas_trabajo,
            proyectos_realizados,
            proyectos_en_curso,
            publico_objetivo_beneficiarios,
            registro_soy_cultura,
            registro_observatorio_cultural_boyaca,
            ha_recibido_estimulos_apoyos_publicos,
            participa_redes_asociaciones,
            cuales_redes_asociaciones,
            fecha_creacion,
            fecha_actualizacion
          )
          VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,NOW(),NOW()
          )
          ON CONFLICT (usuario_id) DO UPDATE SET
            razon_social = EXCLUDED.razon_social,
            nit = EXCLUDED.nit,
            tipo_entidad_id = EXCLUDED.tipo_entidad_id,
            fecha_constitucion = EXCLUDED.fecha_constitucion,
            objeto_social = EXCLUDED.objeto_social,
            municipio_id = EXCLUDED.municipio_id,
            direccion_fisica = EXCLUDED.direccion_fisica,
            telefono_contacto = EXCLUDED.telefono_contacto,
            correo_institucional = EXCLUDED.correo_institucional,
            pagina_web = EXCLUDED.pagina_web,
            nombre_representante_legal = EXCLUDED.nombre_representante_legal,
            tipo_documento_representante_id = EXCLUDED.tipo_documento_representante_id,
            numero_documento_representante = EXCLUDED.numero_documento_representante,
            fecha_inicio_nombramiento = EXCLUDED.fecha_inicio_nombramiento,
            fecha_fin_nombramiento = EXCLUDED.fecha_fin_nombramiento,
            areas_trabajo = EXCLUDED.areas_trabajo,
            proyectos_realizados = EXCLUDED.proyectos_realizados,
            proyectos_en_curso = EXCLUDED.proyectos_en_curso,
            publico_objetivo_beneficiarios = EXCLUDED.publico_objetivo_beneficiarios,
            registro_soy_cultura = EXCLUDED.registro_soy_cultura,
            registro_observatorio_cultural_boyaca = EXCLUDED.registro_observatorio_cultural_boyaca,
            ha_recibido_estimulos_apoyos_publicos = EXCLUDED.ha_recibido_estimulos_apoyos_publicos,
            participa_redes_asociaciones = EXCLUDED.participa_redes_asociaciones,
            cuales_redes_asociaciones = EXCLUDED.cuales_redes_asociaciones,
            fecha_actualizacion = NOW()
          `,
          [
            usuarioId,
            demo.personaJuridica.razon_social,
            demo.personaJuridica.nit,
            demo.personaJuridica.tipo_entidad_id || null,
            demo.personaJuridica.fecha_constitucion || null,
            demo.personaJuridica.objeto_social || null,
            demo.personaJuridica.municipio_id || null,
            demo.personaJuridica.direccion_fisica || null,
            demo.personaJuridica.telefono_contacto || null,
            demo.personaJuridica.correo_institucional || null,
            demo.personaJuridica.pagina_web || null,
            demo.personaJuridica.nombre_representante_legal,
            demo.personaJuridica.tipo_documento_representante_id || null,
            demo.personaJuridica.numero_documento_representante,
            demo.personaJuridica.fecha_inicio_nombramiento || null,
            demo.personaJuridica.fecha_fin_nombramiento || null,
            demo.personaJuridica.areas_trabajo || null,
            demo.personaJuridica.proyectos_realizados || null,
            demo.personaJuridica.proyectos_en_curso || null,
            demo.personaJuridica.publico_objetivo_beneficiarios || null,
            demo.personaJuridica.registro_soy_cultura ?? false,
            demo.personaJuridica.registro_observatorio_cultural_boyaca ?? false,
            demo.personaJuridica.ha_recibido_estimulos_apoyos_publicos ?? false,
            demo.personaJuridica.participa_redes_asociaciones ?? false,
            demo.personaJuridica.cuales_redes_asociaciones || null,
          ],
        );
      }

      console.log(`Se actualizó ${demo.email}`);
    }

    await client.query('COMMIT');
    console.log('\nCuentas demo sembradas correctamente.');
    console.log('Credenciales de prueba:');
    console.log('- admin@pufab.gov.co / Admin2026!');
    console.log('- valeria.ramirez@luminafilms.co / Prod2026!');
    console.log('- contacto@andescine.co / Prov2026!');
    console.log('- coordinacion@universidadboyaca.edu.co / Acad2026!');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Error sembrando cuentas demo:', error.message || error);
  process.exitCode = 1;
});
