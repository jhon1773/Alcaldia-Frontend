/**
 * CREAR-TRAMITE.DTO.TS — DTO PARA CREACIÓN DE TRÁMITES PUFAB
 *
 * RESPONSABILIDADES:
 * 1. Validar estructura completa para crear trámite PUFAB
 * 2. Definir locaciones, equipo técnico y entidades involucradas
 * 3. Aplicar validaciones de negocio para permisos audiovisuales
 * 4. Estructurar datos complejos con arrays anidados
 *
 * CAMPOS PRINCIPALES:
 * - proyecto_id: ID del proyecto audiovisual base (requerido)
 * - tipo_tramite_id: Tipo específico de trámite PUFAB
 * - locaciones: Array de locaciones de rodaje
 * - equipo_tecnico: Array de miembros del equipo
 * - entidades: Array de entidades que deben revisar
 * - compromisos_eticos: Compromisos éticos del proyecto
 *
 * ESTRUCTURAS ANIDADAS:
 *
 * CrearTramiteLocacionDto:
 * - municipio_id: Municipio de la locación
 * - tipo_espacio_id: Tipo de espacio (público, privado, natural)
 * - nombre_lugar: Nombre específico del lugar
 * - direccion: Dirección detallada
 * - requiere_permiso_especial: Si necesita permisos adicionales
 * - observaciones: Notas especiales
 *
 * CrearTramiteEquipoDto:
 * - rol_equipo_tecnico_id: Rol específico (director, camarógrafo, etc.)
 * - nombre_completo: Nombre del integrante
 * - tipo_identificacion_id: Tipo de documento
 * - numero_identificacion: Número de documento
 * - telefono: Contacto del integrante
 * - email: Correo del integrante
 *
 * VALIDACIONES:
 * - proyecto_id requerido y debe pertenecer al usuario
 * - Arrays validados con @ValidateNested y @Type
 * - Campos opcionales marcados con @IsOptional
 * - Referencias a catálogos válidas
 *
 * FLUJO DE CREACIÓN:
 * 1. Usuario proporciona proyecto existente
 * 2. DTO valida estructura completa
 * 3. Service genera número de radicado PUFA-YYYYMMDD-XXXXXX
 * 4. Crea trámite con estado 'borrador'
 * 5. Registra locaciones, equipo y entidades relacionadas
 * 6. Crea entrada inicial en historial
 *
 * COMPLEJIDAD:
 * - DTO compuesto con múltiples sub-DTOs
 * - Validaciones anidadas complejas
 * - Relaciones múltiples a crear
 * - Lógica de negocio específica de PUFAB
 */

import {
  IsNumber, IsOptional, IsBoolean, IsString, IsArray, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearTramiteLocacionDto {
  @ApiPropertyOptional({ example: 1, description: 'ID del municipio (ver /catalogos/municipios)' })
  @IsOptional()
  @IsNumber()
  municipio_id?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID del tipo de espacio (ver /catalogos/tipos-espacio)' })
  @IsOptional()
  @IsNumber()
  tipo_espacio_id?: number;

  @ApiProperty({ example: 'Páramo de Ocetá', description: 'Nombre del lugar de rodaje' })
  @IsString()
  nombre_lugar: string;

  @ApiPropertyOptional({ example: 'Vereda El Bosque, Monguí, Boyacá' })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ example: false, description: 'Indica si el lugar requiere permiso especial de acceso' })
  @IsOptional()
  @IsBoolean()
  requiere_permiso_especial?: boolean;

  @ApiPropertyOptional({ example: 'Zona de páramo protegido — requiere aval de la CAR' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}

export class CrearTramiteEquipoDto {
  @ApiPropertyOptional({ example: 1, description: 'ID del rol del equipo técnico (ver /catalogos/roles-equipo-tecnico)' })
  @IsOptional()
  @IsNumber()
  rol_equipo_tecnico_id?: number;

  @ApiProperty({ example: 'Carlos Andrés Pinzón' })
  @IsString()
  nombre_completo: string;

  @ApiPropertyOptional({ example: '79512345' })
  @IsOptional()
  @IsString()
  identificacion?: string;

  @ApiPropertyOptional({ example: '3124567890' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ example: 'capin@email.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: true, description: 'Indica si es talento local boyacense (fomento local)' })
  @IsOptional()
  @IsBoolean()
  es_talento_local?: boolean;
}

export class CrearTramiteDto {
  @ApiProperty({ example: 1, description: 'ID del proyecto al que pertenece el trámite' })
  @IsNumber()
  proyecto_id: number;

  @ApiPropertyOptional({ example: 1, description: 'ID del tipo de trámite (ver /catalogos/tipos-tramite)' })
  @IsOptional()
  @IsNumber()
  tipo_tramite_id?: number;

  @ApiPropertyOptional({ example: false, description: 'Indica si la producción requiere seguro de responsabilidad civil' })
  @IsOptional()
  @IsBoolean()
  requiere_seguro_rc?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  requiere_aval_institucional?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Si usa drones, se generará requisito de permiso ante Aeronáutica Civil automáticamente' })
  @IsOptional()
  @IsBoolean()
  usa_drones?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Si requiere cierre de vías, se generará requisito de plan de manejo de tránsito' })
  @IsOptional()
  @IsBoolean()
  requiere_cierre_vias?: boolean;

  @ApiProperty({ example: true, description: 'OBLIGATORIO: Aceptación del compromiso ético (respeto al entorno cultural y natural)' })
  @IsBoolean()
  compromiso_etico_aceptado: boolean;

  @ApiProperty({ example: true, description: 'OBLIGATORIO: Aceptación del compromiso de manejo responsable de residuos' })
  @IsBoolean()
  manejo_residuos_aceptado: boolean;

  @ApiPropertyOptional({ example: false, description: 'Indica si hay comunidades étnicas en el área de rodaje' })
  @IsOptional()
  @IsBoolean()
  consentimiento_comunidades_aplica?: boolean;

  @ApiPropertyOptional({ example: 'Producción de documental sobre fauna del páramo.' })
  @IsOptional()
  @IsString()
  observaciones_generales?: string;

  @ApiPropertyOptional({ type: [CrearTramiteLocacionDto], description: 'Lista de locaciones donde se realizará el rodaje' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearTramiteLocacionDto)
  locaciones?: CrearTramiteLocacionDto[];

  @ApiPropertyOptional({ type: [CrearTramiteEquipoDto], description: 'Miembros del equipo técnico de la producción' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearTramiteEquipoDto)
  equipo_tecnico?: CrearTramiteEquipoDto[];
}
