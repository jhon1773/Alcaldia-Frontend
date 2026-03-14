import { IsString, IsOptional, IsNumber, IsEmail } from 'class-validator';

export class CrearEntidadDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsNumber()
  tipo_entidad_revision_id?: number;

  @IsOptional()
  @IsNumber()
  municipio_id?: number;

  @IsOptional()
  @IsEmail()
  correo_contacto?: string;

  @IsOptional()
  @IsString()
  telefono_contacto?: string;
}
