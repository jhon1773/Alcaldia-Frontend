import {
  IsString, IsOptional, IsNumber, IsBoolean,
  IsDateString, IsIn, Min, Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CrearPersonaNaturalDto {
  @IsString()
  primer_nombre: string;

  @IsOptional()
  @IsString()
  segundo_nombre?: string;

  @IsString()
  primer_apellido: string;

  @IsOptional()
  @IsString()
  segundo_apellido?: string;

  @IsOptional()
  @IsNumber()
  tipo_identificacion_id?: number;

  @IsString()
  numero_documento: string;

  @IsOptional()
  @IsNumber()
  municipio_residencia_id?: number;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @IsOptional()
  @IsNumber()
  sexo_nacer_id?: number;

  @IsOptional()
  @IsNumber()
  identidad_genero_id?: number;

  @IsOptional()
  @IsBoolean()
  pertenece_grupo_etnico?: boolean;

  @IsOptional()
  @IsNumber()
  grupo_etnico_id?: number;

  @IsOptional()
  @IsBoolean()
  tiene_discapacidad?: boolean;

  @IsOptional()
  @IsNumber()
  tipo_discapacidad_id?: number;

  @IsOptional()
  @IsBoolean()
  vive_zona_rural?: boolean;

  @IsOptional()
  @IsBoolean()
  se_considera_campesino?: boolean;

  @IsOptional()
  @IsBoolean()
  victima_conflicto_armado?: boolean;

  @IsOptional()
  @IsBoolean()
  migrante_refugiado?: boolean;

  @IsOptional()
  @IsNumber()
  nivel_educativo_id?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  ingles_habla?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  ingles_lee?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  ingles_escribe?: number;
}
