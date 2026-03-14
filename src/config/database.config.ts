import { registerAs } from '@nestjs/config';

// Configuración de conexión a PostgreSQL vía TypeORM
// Acepta DB_DATABASE o DB_NAME, NODE_ENV o APP_ENV
export default registerAs('database', () => {
  const env = process.env.NODE_ENV ?? process.env.APP_ENV ?? 'development';
  return {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'password',
    database: process.env.DB_DATABASE ?? process.env.DB_NAME ?? 'pufa_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: env === 'development',
    logging: env === 'development',
    autoLoadEntities: true,
  };
});
