import {
  IsString, IsOptional, IsNumber, IsBoolean,
  IsDateString, Min, Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearPersonaNaturalDto {
  @ApiProperty({ example: 'María', description: 'Primer nombre' })
  @IsString()
  primer_nombre: string;

  @ApiPropertyOptional({ example: 'Fernanda' })
  @IsOptional()
  @IsString()
  segundo_nombre?: string;

  @ApiProperty({ example: 'González' })
  @IsString()
  primer_apellido: string;

  @ApiPropertyOptional({ example: 'Torres' })
  @IsOptional()
  @IsString()
  segundo_apellido?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID del tipo de identificación (ver /catalogos/tipos-identificacion)' })
  @IsOptional()
  @IsNumber()
  tipo_identificacion_id?: number;

  @ApiProperty({ example: '1012345678', description: 'Número de documento de identidad' })
  @IsString()
  numero_documento: string;

  @ApiPropertyOptional({ example: 1, description: 'ID del municipio de residencia (ver /catalogos/municipios)' })
  @IsOptional()
  @IsNumber()
  municipio_residencia_id?: number;

  @ApiPropertyOptional({ example: 'Calle 10 # 5-30, Tunja' })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ example: '1995-06-15', description: 'Fecha de nacimiento (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID del sexo al nacer (ver /catalogos/sexos-nacer)' })
  @IsOptional()
  @IsNumber()
  sexo_nacer_id?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID de identidad de género (ver /catalogos/identidades-genero)' })
  @IsOptional()
  @IsNumber()
  identidad_genero_id?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  pertenece_grupo_etnico?: boolean;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsNumber()
  grupo_etnico_id?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  tiene_discapacidad?: boolean;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsNumber()
  tipo_discapacidad_id?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  vive_zona_rural?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  se_considera_campesino?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  victima_conflicto_armado?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  migrante_refugiado?: boolean;

  @ApiPropertyOptional({ example: 5, description: 'ID del nivel educativo (ver /catalogos/niveles-educativos)' })
  @IsOptional()
  @IsNumber()
  nivel_educativo_id?: number;

  @ApiPropertyOptional({ example: 3, description: 'Nivel de inglés hablado del 0 (ninguno) al 5 (nativo)' })
  @IsOptional()
  @IsNumber()
  @Min(0) @Max(5)
  ingles_habla?: number;

  @ApiPropertyOptional({ example: 4, description: 'Nivel de inglés de lectura del 0 al 5' })
  @IsOptional()
  @IsNumber()
  @Min(0) @Max(5)
  ingles_lee?: number;

  @ApiPropertyOptional({ example: 2, description: 'Nivel de inglés escrito del 0 al 5' })
  @IsOptional()
  @IsNumber()
  @Min(0) @Max(5)
  ingles_escribe?: number;
}
