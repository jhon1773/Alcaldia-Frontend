/**
 * DTO de validación para la creación de entidades revisoras en el sistema PUFA.
 *
 * RESPONSABILIDADES:
 * - Validar datos de entrada para crear entidades externas que participan en la revisión de trámites
 * - Definir estructura de datos requeridos para entidades como alcaldías, entidades ambientales, etc.
 *
 * FLUJO DE USO:
 * - Usado en POST /api/v1/entidades para crear nuevas entidades revisoras
 * - Validado automáticamente por class-validator antes de llegar al servicio
 *
 * CAMPOS IMPORTANTES:
 * - nombre: Identificador único de la entidad (ej: "Alcaldía de Tunja")
 * - tipo_entidad_revision_id: Referencia a catálogo de tipos (alcaldía, ambiental, etc.)
 * - municipio_id: Municipio donde opera la entidad
 * - correo_contacto/telefono_contacto: Datos para notificaciones del trámite
 *
 * VALIDACIONES:
 * - nombre: Requerido, string no vacío
 * - tipo_entidad_revision_id, municipio_id: Opcionales, números enteros
 * - correo_contacto: Opcional, formato email válido
 * - telefono_contacto: Opcional, string
 *
 * RELACIONES CON OTROS MÓDULOS:
 * - CatalogosModule: Para validar tipo_entidad_revision_id y municipio_id
 * - TramitesModule: Las entidades creadas aquí se asignan a trámites para revisión
 */

import { IsString, IsOptional, IsNumber, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearEntidadDto {
  @ApiProperty({
    example: 'Alcaldía de Villa de Leyva',
    description: 'Nombre oficial de la entidad revisora externa'
  })
  @IsString()
  nombre: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID del tipo de entidad revisora (ver catálogo tipos-entidad-revision)'
  })
  @IsOptional()
  @IsNumber()
  tipo_entidad_revision_id?: number;

  @ApiPropertyOptional({
    example: 6,
    description: 'ID del municipio donde opera la entidad (ver catálogo municipios)'
  })
  @IsOptional()
  @IsNumber()
  municipio_id?: number;

  @ApiPropertyOptional({
    example: 'permisos@villadeleyva.gov.co',
    description: 'Correo electrónico de contacto para notificaciones del trámite'
  })
  @IsOptional()
  @IsEmail()
  correo_contacto?: string;

  @ApiPropertyOptional({
    example: '3123456789',
    description: 'Número telefónico de contacto para consultas sobre el trámite'
  })
  @IsOptional()
  @IsString()
  telefono_contacto?: string;
}
