/**
 * APP.CONFIG.TS — CONFIGURACIÓN GENERAL DE LA APLICACIÓN
 *
 * RESPONSABILIDADES:
 * 1. Centralizar y exponer todas las variables de entorno de la aplicación
 * 2. Proveer valores por defecto seguros para entornos de desarrollo
 * 3. Normalizar variables con nombres alternativos para mayor compatibilidad
 * 4. Configurar parámetros de negocio ajustables por entorno
 *
 * VARIABLES DE ENTORNO ACEPTADAS:
 * - Servidor:    PORT / APP_PORT (default: 3000)
 * - Entorno:     NODE_ENV / APP_ENV (default: 'development')
 * - API:         API_PREFIX (default: 'api/v1')
 * - JWT:         JWT_SECRET, JWT_EXPIRES_IN / JWT_EXPIRATION (default: '1d')
 * - Archivos:    MAX_FILE_SIZE_MB (default: 10), UPLOAD_DEST (default: './uploads')
 * - Negocio:     PORCENTAJE_ABONO_DEFAULT (default: 30)
 *                DIAS_HABILES_MIN (default: 5), DIAS_HABILES_MAX (default: 15)
 * - SMTP:        SMTP_HOST, SMTP_PORT (default: 587), SMTP_SECURE,
 *                SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_ADMIN_TO
 *
 * ADVERTENCIA DE SEGURIDAD:
 * - JWT_SECRET tiene un valor por defecto solo para desarrollo local
 * - En producción SIEMPRE debe definirse JWT_SECRET como variable de entorno segura
 * - Las credenciales SMTP deben configurarse vía variables de entorno, nunca en código
 *
 * INTEGRACIÓN:
 * - Registrado en AppModule con ConfigModule.forRoot({ load: [appConfig] })
 * - Accesible en cualquier servicio mediante ConfigService.get('app.propiedad')
 */

import { registerAs } from '@nestjs/config';

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
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT ?? '587', 10),
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  smtpFrom: process.env.SMTP_FROM,
  smtpAdminTo: process.env.SMTP_ADMIN_TO,
}));