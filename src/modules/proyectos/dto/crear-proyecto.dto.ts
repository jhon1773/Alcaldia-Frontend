/**
 * CREAR-PROYECTO.DTO.TS — DTO PARA CREACIÓN DE PROYECTOS AUDIOVISUALES
 *
 * RESPONSABILIDADES:
 * 1. Validar datos para crear nuevo proyecto audiovisual
 * 2. Definir campos requeridos y opcionales para proyectos
 * 3. Aplicar validaciones de formato y lógica de negocio
 * 4. Usado por productores para registrar sus proyectos
 *
 * CAMPOS PRINCIPALES:
 * - tipo_produccion_id: Tipo de producción (documental, ficción, etc.)
 * - nombre_proyecto: Título del proyecto (requerido)
 * - sinopsis: Descripción breve del proyecto
 * - municipio_principal_id: Municipio donde se desarrolla
 * - fecha_inicio_prevista: Fecha estimada de inicio
 * - fecha_fin_prevista: Fecha estimada de finalización
 * - presupuesto_total: Presupuesto en pesos colombianos
 *
 * VALIDACIONES:
 * - nombre_proyecto requerido (@IsString)
 * - presupuesto_total positivo si se proporciona (@IsPositive)
 * - Fechas en formato válido (@IsDateString)
 * - IDs de catálogos válidos (@IsNumber)
 *
 * DIFERENCIA CON UpdateProyectoDto:
 * - Este DTO es para creación inicial
 * - UpdateProyectoDto permite modificar campos existentes
 * - Campos opcionales en creación pueden ser requeridos en actualización
 *
 * FLUJO DE USO:
 * 1. Productor completa formulario de creación
 * 2. DTO valida datos en frontend y backend
 * 3. Service crea proyecto con estado 'borrador'
 * 4. Proyecto queda listo para crear trámites PUFAB
 *
 * INTEGRACIÓN CON PUFAB:
 * - Proyecto es requisito para crear trámite
 * - Presupuesto determina monto de abono (30%)
 * - Tipo de producción afecta requisitos documentales
 * - Municipio puede requerir permisos adicionales
 */

import { IsString, IsOptional, IsNumber, IsDateString, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearProyectoDto {
  @ApiPropertyOptional({ example: 1, description: 'ID del tipo de producción (ver /catalogos/tipos-produccion)' })
  @IsOptional()
  @IsNumber()
  tipo_produccion_id?: number;

  @ApiProperty({ example: 'Las Montañas de Boyacá', description: 'Nombre del proyecto audiovisual' })
  @IsString()
  nombre_proyecto: string;

  @ApiPropertyOptional({ example: 'Documental sobre el páramo de Ocetá y sus comunidades campesinas.' })
  @IsOptional()
  @IsString()
  sinopsis?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID del municipio principal de rodaje (ver /catalogos/municipios)' })
  @IsOptional()
  @IsNumber()
  municipio_principal_id?: number;

  @ApiPropertyOptional({ example: '2026-06-01', description: 'Fecha prevista de inicio de rodaje (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  fecha_inicio_prevista?: string;

  @ApiPropertyOptional({ example: '2026-06-15' })
  @IsOptional()
  @IsDateString()
  fecha_fin_prevista?: string;

  @ApiPropertyOptional({ example: 50000000, description: 'Presupuesto total del proyecto en pesos colombianos' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  presupuesto_total?: number;
}
