import {
  IsString, IsOptional, IsNumber, IsBoolean, IsDateString, IsEmail,
} from 'class-validator';

export class CrearPersonaJuridicaDto {
  @IsString()
  razon_social: string;

  @IsString()
  nit: string;

  @IsOptional()
  @IsNumber()
  tipo_entidad_id?: number;

  @IsOptional()
  @IsDateString()
  fecha_constitucion?: string;

  @IsOptional()
  @IsString()
  objeto_social?: string;

  @IsOptional()
  @IsNumber()
  municipio_id?: number;

  @IsOptional()
  @IsString()
  direccion_fisica?: string;

  @IsString()
  nombre_representante_legal: string;

  @IsOptional()
  @IsNumber()
  tipo_documento_representante_id?: number;

  @IsString()
  numero_documento_representante: string;

  @IsOptional()
  @IsBoolean()
  registro_soy_cultura?: boolean;

  @IsOptional()
  @IsBoolean()
  ha_recibido_estimulos_apoyos_publicos?: boolean;

  @IsOptional()
  @IsBoolean()
  participa_redes_asociaciones?: boolean;

  @IsOptional()
  @IsString()
  cuales_redes_asociaciones?: string;
}
