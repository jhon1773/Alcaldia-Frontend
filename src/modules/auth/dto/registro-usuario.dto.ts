/**
 * REGISTRO-USUARIO.DTO.TS — DTO PARA REGISTRO PÚBLICO DE USUARIOS
 *
 * RESPONSABILIDADES:
 * 1. Validar los datos de registro de nuevos usuarios en el sistema
 * 2. Soportar registro de personas naturales y jurídicas con perfiles anidados
 * 3. Restringir el registro público a roles no administrativos
 * 4. Exponer la estructura completa del payload en Swagger
 *
 * CAMPOS PRINCIPALES:
 * - email:         Correo único del usuario (requerido)
 * - password:      Contraseña de acceso, mínimo 8 caracteres (requerido)
 * - nombre:        Nombre completo del usuario (opcional)
 * - tipo_persona:  'natural' o 'juridica' — determina qué perfil se crea (opcional)
 * - telefono:      Número de contacto (opcional)
 * - rolSolicitado: Rol inicial del usuario (opcional, por defecto asignado por el sistema)
 *                  Valores permitidos: 'productora' | 'proveedor' | 'academico'
 *                  Nota: 'admin' NO está permitido en el registro público
 *
 * PERFILES ANIDADOS (mutuamente excluyentes según tipo_persona):
 * - perfilNatural:  Datos de persona natural → CrearPersonaNaturalDto
 * - perfilJuridica: Datos de persona jurídica → CrearPersonaJuridicaDto
 *
 * FLUJO DE REGISTRO:
 * 1. Cliente envía el DTO con email, password y datos opcionales de perfil
 * 2. ValidationPipe valida campos y estructuras anidadas con @ValidateNested
 * 3. AuthService crea el usuario, hashea la contraseña y asigna el rol
 * 4. Si se provee perfilNatural o perfilJuridica, se crea el perfil asociado
 * 5. Se retorna el usuario creado sin datos sensibles
 *
 * INTEGRACIÓN:
 * - Usado en AuthController en el endpoint POST /auth/registro
 * - Ruta marcada como @Public(), no requiere token previo
 * - @Type() de class-transformer es necesario para validar los DTOs anidados
 */

import { Type } from 'class-transformer';
import {
  IsEmail, IsString, MinLength, IsIn, IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CrearPersonaNaturalDto } from '../../usuarios/dto/crear-persona-natural.dto';
import { CrearPersonaJuridicaDto } from '../../usuarios/dto/crear-persona-juridica.dto';

export class RegistroUsuarioDto {
  @ApiProperty({ example: 'productora@email.com', description: 'Correo electrónico único del usuario' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @ApiProperty({ example: 'MiPassword123!', description: 'Contraseña (mínimo 8 caracteres)' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @ApiPropertyOptional({ example: 'Juan Pérez García', description: 'Nombre completo del usuario' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({ enum: ['natural', 'juridica'], example: 'natural', description: 'Tipo de persona del usuario' })
  @IsIn(['natural', 'juridica'], { message: 'El tipo de persona debe ser natural o juridica' })
  @IsOptional()
  tipo_persona?: 'natural' | 'juridica';

  @ApiPropertyOptional({ example: '3101234567', description: 'Número de teléfono de contacto' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({
    description: 'Datos completos de perfil para persona natural',
    type: () => CrearPersonaNaturalDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CrearPersonaNaturalDto)
  perfilNatural?: CrearPersonaNaturalDto;

  @ApiPropertyOptional({
    description: 'Datos completos de perfil para persona jurídica',
    type: () => CrearPersonaJuridicaDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CrearPersonaJuridicaDto)
  perfilJuridica?: CrearPersonaJuridicaDto;

  @ApiPropertyOptional({
    enum: ['productora', 'proveedor', 'academico'],
    example: 'productora',
    description: 'Rol inicial de registro (admin no permitido en registro público)',
  })
  @IsOptional()
  @IsIn(['productora', 'proveedor', 'academico'], {
    message: 'El rol inicial debe ser productora, proveedor o academico',
  })
  rolSolicitado?: 'productora' | 'proveedor' | 'academico';
}