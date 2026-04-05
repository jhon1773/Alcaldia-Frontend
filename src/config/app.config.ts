import { registerAs } from '@nestjs/config';

// Configuración general de la aplicación
// Acepta PORT o APP_PORT, NODE_ENV o APP_ENV, JWT_EXPIRES_IN o JWT_EXPIRATION
export default registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? process.env.APP_PORT ?? '3000', 10),
  env: process.env.NODE_ENV ?? process.env.APP_ENV ?? 'development',
  prefix: process.env.API_PREFIX ?? 'api/v1',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me',
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB ?? '10', 10),
  uploadDest: process.env.UPLOAD_DEST ?? './uploads',
  porcentajeAbonoDefault: parseFloat(process.env.PORCENTAJE_ABONO_DEFAULT ?? '30'),
  diasHabilesMin: parseInt(process.env.DIAS_HABILES_MIN ?? '5', 10),
  diasHabilesMax: parseInt(process.env.DIAS_HABILES_MAX ?? '15', 10),
  jwtExpiracion: process.env.JWT_EXPIRES_IN ?? process.env.JWT_EXPIRATION ?? '1d',
}));
