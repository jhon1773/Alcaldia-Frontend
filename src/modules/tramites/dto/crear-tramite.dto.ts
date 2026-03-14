import {
  IsNumber, IsOptional, IsBoolean, IsString, IsArray, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CrearTramiteLocacionDto {
  @IsOptional()
  @IsNumber()
  municipio_id?: number;

  @IsOptional()
  @IsNumber()
  tipo_espacio_id?: number;

  @IsString()
  nombre_lugar: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsBoolean()
  requiere_permiso_especial?: boolean;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

export class CrearTramiteEquipoDto {
  @IsOptional()
  @IsNumber()
  rol_equipo_tecnico_id?: number;

  @IsString()
  nombre_completo: string;

  @IsOptional()
  @IsString()
  identificacion?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsBoolean()
  es_talento_local?: boolean;
}

export class CrearTramiteDto {
  @IsNumber()
  proyecto_id: number;

  @IsOptional()
  @IsNumber()
  tipo_tramite_id?: number;

  @IsOptional()
  @IsBoolean()
  requiere_seguro_rc?: boolean;

  @IsOptional()
  @IsBoolean()
  requiere_aval_institucional?: boolean;

  @IsOptional()
  @IsBoolean()
  usa_drones?: boolean;

  @IsOptional()
  @IsBoolean()
  requiere_cierre_vias?: boolean;

  // Compromisos éticos — deben aceptarse todos para proceder
  @IsBoolean()
  compromiso_etico_aceptado: boolean;

  @IsBoolean()
  manejo_residuos_aceptado: boolean;

  @IsOptional()
  @IsBoolean()
  consentimiento_comunidades_aplica?: boolean;

  @IsOptional()
  @IsString()
  observaciones_generales?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearTramiteLocacionDto)
  locaciones?: CrearTramiteLocacionDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearTramiteEquipoDto)
  equipo_tecnico?: CrearTramiteEquipoDto[];
}
