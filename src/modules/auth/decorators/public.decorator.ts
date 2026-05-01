/**
 * PUBLIC.DECORATOR.TS — DECORADOR PARA RUTAS PÚBLICAS
 *
 * RESPONSABILIDADES:
 * 1. Marcar endpoints específicos como públicos (sin autenticación requerida)
 * 2. Proveer la metadata necesaria para que JwtAuthGuard omita la validación
 * 3. Permitir acceso anónimo a rutas seleccionadas dentro de módulos protegidos
 *
 * USO EN CONTROLADORES:
 * @Public()
 * @Get('estado-servicio')
 * healthCheck() { ... }
 *
 * @Public()
 * @Post('login')
 * login(@Body() dto: LoginDto) { ... }
 *
 * COMPORTAMIENTO:
 * - Sin @Public(): JwtAuthGuard valida el token JWT obligatoriamente
 * - Con @Public(): JwtAuthGuard detecta la metadata y omite la validación
 * - La ruta queda completamente abierta, sin verificación de identidad
 *
 * INTEGRACIÓN:
 * - JwtAuthGuard lee IS_PUBLIC_KEY con Reflector para decidir si omite la guarda
 * - Compatible con guardas globales registradas en AppModule
 * - Usado típicamente en: login, registro, recuperación de contraseña, health checks
 */

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);