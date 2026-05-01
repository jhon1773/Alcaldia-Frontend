/**
 * CAMBIAR-PASSWORD.DTO.TS — DTO PARA CAMBIO DE CONTRASEÑA
 *
 * RESPONSABILIDADES:
 * 1. Validar que se proporcione la contraseña actual antes de permitir el cambio
 * 2. Garantizar que la nueva contraseña cumpla el mínimo de seguridad (8 caracteres)
 * 3. Exponer la estructura del payload en Swagger para facilitar las pruebas
 *
 * CAMPOS:
 * - password_actual: Contraseña vigente del usuario (requerida para confirmar identidad)
 * - password_nuevo:  Nueva contraseña deseada (mínimo 8 caracteres)
 *
 * FLUJO DE VALIDACIÓN:
 * 1. Se recibe el DTO con ambos campos
 * 2. ValidationPipe verifica tipos y longitud mínima
 * 3. El servicio compara password_actual contra el hash almacenado
 * 4. Si coincide, se hashea y guarda password_nuevo
 * 5. Si no coincide, se lanza excepción de autorización
 *
 * INTEGRACIÓN:
 * - Usado en UsuariosController en el endpoint PATCH /usuarios/cambiar-password
 * - El usuario debe estar autenticado (requiere JwtAuthGuard)
 * - El servicio obtiene el usuario actual desde @CurrentUser()
 */

import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CambiarPasswordDto {
  @ApiProperty({ example: 'Admin2024!', description: 'Contraseña actual del usuario' })
  @IsString()
  password_actual: string;

  @ApiProperty({ example: 'NuevoPassword456!', description: 'Nueva contraseña (mínimo 8 caracteres)' })
  @IsString()
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  password_nuevo: string;
}