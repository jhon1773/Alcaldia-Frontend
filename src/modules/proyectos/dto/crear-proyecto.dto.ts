import { IsString, IsOptional, IsNumber, IsDateString, IsPositive } from 'class-validator';

export class CrearProyectoDto {
  @IsOptional()
  @IsNumber()
  tipo_produccion_id?: number;

  @IsString()
  nombre_proyecto: string;

  @IsOptional()
  @IsString()
  sinopsis?: string;

  @IsOptional()
  @IsNumber()
  municipio_principal_id?: number;

  @IsOptional()
  @IsDateString()
  fecha_inicio_prevista?: string;

  @IsOptional()
  @IsDateString()
  fecha_fin_prevista?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  presupuesto_total?: number;
}
