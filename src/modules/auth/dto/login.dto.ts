/**
 * LOGIN.DTO.TS — DTO PARA AUTENTICACIÓN DE USUARIOS
 *
 * RESPONSABILIDADES:
 * 1. Validar las credenciales de acceso enviadas en la solicitud de login
 * 2. Verificar el formato del correo electrónico antes de consultar la base de datos
 * 3. Permitir opcionalmente seleccionar el rol activo para la sesión
 * 4. Exponer la estructura del payload en Swagger para facilitar las pruebas
 *
 * CAMPOS:
 * - email:         Correo electrónico registrado del usuario (requerido)
 * - password:      Contraseña del usuario, mínimo 6 caracteres (requerido)
 * - rolSolicitado: Rol con el que el usuario desea iniciar sesión (opcional)
 *                  Valores permitidos: 'admin' | 'productora' | 'proveedor' | 'academico'
 *
 * FLUJO DE AUTENTICACIÓN:
 * 1. Cliente envía email + password (+ rolSolicitado opcional)
 * 2. AuthService valida credenciales contra la base de datos
 * 3. Si rolSolicitado está presente, se verifica que el usuario tenga ese rol asignado
 * 4. Se genera y retorna el token JWT con el payload correspondiente
 *
 * INTEGRACIÓN:
 * - Usado en AuthController en el endpoint POST /auth/login
 * - Ruta marcada como @Public(), no requiere token previo
 * - El token generado incluye id, email y rol activo del usuario
 */

import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@pufa.gov.co', description: 'Correo electrónico del usuario' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @ApiProperty({ example: 'Admin2024!', description: 'Contraseña del usuario (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({ example: 'admin', description: 'Rol solicitado: admin, productora, proveedor, academico', required: false })
  @IsOptional()
  @IsIn(['admin', 'productora', 'proveedor', 'academico'], { message: 'Rol inválido. Debe ser: admin, productora, proveedor o academico' })
  rolSolicitado?: string;
}