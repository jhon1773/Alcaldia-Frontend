import { IsNumber, IsOptional, IsString, IsDateString, IsPositive } from 'class-validator';

export class RegistrarPagoDto {
  @IsNumber()
  tramite_id: number;

  @IsOptional()
  @IsNumber()
  tipo_pago_id?: number;

  @IsNumber()
  @IsPositive()
  monto: number;

  @IsOptional()
  @IsString()
  referencia_pago?: string;

  @IsOptional()
  @IsNumber()
  soporte_pago_documento_id?: number;

  @IsOptional()
  @IsDateString()
  fecha_pago?: string;
}
