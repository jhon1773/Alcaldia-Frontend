/**
 * DATABASE.CONFIG.TS — CONFIGURACIÓN DE CONEXIÓN A BASE DE DATOS
 *
 * RESPONSABILIDADES:
 * 1. Construir la configuración de TypeORM para PostgreSQL según el entorno
 * 2. Soportar conexión mediante DATABASE_URL o variables individuales
 * 3. Validar que las variables de entorno requeridas estén presentes
 * 4. Activar sincronización y logging automático solo en desarrollo
 *
 * MODOS DE CONEXIÓN (en orden de prioridad):
 * 1. DATABASE_URL: URL completa de conexión (típico en servicios cloud como Railway o Render)
 * 2. Variables individuales: DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE / DB_NAME
 *
 * VARIABLES DE ENTORNO:
 * - DATABASE_URL:   URL completa de PostgreSQL (opcional, tiene prioridad)
 * - DB_HOST:        Host del servidor de base de datos (requerido si no hay DATABASE_URL)
 * - DB_PORT:        Puerto PostgreSQL (requerido si no hay DATABASE_URL)
 * - DB_USERNAME:    Usuario de la base de datos (requerido si no hay DATABASE_URL)
 * - DB_PASSWORD:    Contraseña del usuario (requerido si no hay DATABASE_URL)
 * - DB_DATABASE / DB_NAME: Nombre de la base de datos (siempre requerido)
 * - NODE_ENV / APP_ENV: Controla synchronize y logging (activos solo en 'development')
 *
 * COMPORTAMIENTO POR ENTORNO:
 * - development: synchronize: true (auto-migra esquema), logging: true
 * - production:  synchronize: false (requiere migraciones manuales), logging: false
 *
 * ADVERTENCIA:
 * - synchronize: true en producción puede causar pérdida de datos
 * - Siempre usar migraciones en entornos productivos
 *
 * INTEGRACIÓN:
 * - Registrado en AppModule con ConfigModule.forRoot({ load: [databaseConfig] })
 * - Usado por TypeOrmModule.forRootAsync() para inicializar la conexión
 */

import { registerAs } from '@nestjs/config';

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Falta la variable de entorno requerida: ${name}`);
  }
  return value.trim();
}

export default registerAs('database', () => {
  const env = process.env.NODE_ENV ?? process.env.APP_ENV ?? 'development';
  const database = process.env.DB_DATABASE?.trim() || process.env.DB_NAME?.trim();
  if (!database) {
    throw new Error('Falta la variable de entorno requerida: DB_DATABASE o DB_NAME');
  }

  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: env === 'development',
      logging: env === 'development',
      autoLoadEntities: true,
    };
  }

  return {
    type: 'postgres',
    host: requireEnv('DB_HOST'),
    port: parseInt(requireEnv('DB_PORT'), 10),
    username: requireEnv('DB_USERNAME'),
    password: requireEnv('DB_PASSWORD'),
    database,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: env === 'development',
    logging: env === 'development',
    autoLoadEntities: true,
  };
});