/**
 * ACTUALIZAR-PERFIL.DTO.TS — DTO PARA ACTUALIZACIÓN DE PERFIL DE USUARIO
 *
 * RESPONSABILIDADES:
 * 1. Validar los campos opcionales que el usuario puede actualizar en su perfil
 * 2. Limitar la longitud máxima de los campos para proteger la base de datos
 * 3. Garantizar que los valores recibidos sean cadenas de texto válidas
 *
 * CAMPOS:
 * - telefono: Número de contacto del usuario (opcional, máx. 30 caracteres)
 * - bio:      Descripción o presentación personal (opcional, máx. 1000 caracteres)
 *
 * COMPORTAMIENTO:
 * - Todos los campos son opcionales: se puede actualizar uno, ambos o ninguno
 * - Si un campo se envía, se aplican todas sus validaciones
 * - Si un campo no se envía, se omite sin error
 *
 * INTEGRACIÓN:
 * - Usado en UsuariosController en el endpoint PATCH /usuarios/perfil
 * - Procesado por ValidationPipe global antes de llegar al controlador
 */

import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ActualizarPerfilDto {
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un texto válido' })
  @MaxLength(30, { message: 'El teléfono no puede superar 30 caracteres' })
  telefono?: string;

  @IsOptional()
  @IsString({ message: 'La biografía debe ser un texto válido' })
  @MaxLength(1000, { message: 'La biografía no puede superar 1000 caracteres' })
  bio?: string;
}