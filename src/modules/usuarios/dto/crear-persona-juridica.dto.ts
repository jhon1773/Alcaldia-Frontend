/**
 * CREAR-PERSONA-JURIDICA.DTO.TS — DTO PARA CREACIÓN DE PERSONA JURÍDICA
 *
 * RESPONSABILIDADES:
 * 1. Validar datos para crear perfil de empresa/persona jurídica
 * 2. Definir campos requeridos para registro empresarial
 * 3. Aplicar validaciones de formato colombiano para empresas
 * 4. Usado en procesos de registro/administración
 *
 * CAMPOS EMPRESARIALES:
 * - razon_social: Nombre legal de la empresa (requerido)
 * - nit: Número de identificación tributaria (requerido)
 * - tipo_entidad_id: Tipo de entidad jurídica
 * - fecha_constitucion: Fecha de constitución
 * - objeto_social: Actividad principal
 *
 * CAMPOS DE UBICACIÓN:
 * - municipio_id: Municipio donde opera la empresa
 * - direccion: Dirección física de la empresa
 * - telefono: Teléfono de contacto
 * - email: Correo electrónico de la empresa
 *
 * CAMPOS DEL REPRESENTANTE LEGAL:
 * - nombre_representante_legal: Nombre del representante
 * - tipo_identificacion_representante_id: Tipo de documento del representante
 * - numero_identificacion_representante: Número de documento del representante
 *
 * CAMPOS DEL SECTOR AUDIOVISUAL:
 * - experiencia_sector: Años de experiencia en el sector
 * - tiempo_dedicacion_sector_id: Tiempo dedicado al sector
 * - ingresos_sector_id: Rango de ingresos del sector
 * - propiedad_equipos_id: Tipo de propiedad de equipos
 * - gama_equipos_id: Gama de equipos utilizados
 * - rango_experiencia_sector_id: Rango de experiencia
 *
 * VALIDACIONES:
 * - razon_social y nit requeridos
 * - Campos opcionales con @IsOptional()
 * - Referencias a catálogos válidas
 * - Formato de NIT colombiano
 *
 * DIFERENCIA CON CompletarPerfilJuridicaDto:
 * - Este DTO es para creación básica/administrativa
 * - CompletarPerfilJuridicaDto es para completar perfil post-registro
 * - Campos más detallados del sector audiovisual
 *
 * USO EN SISTEMA:
 * - Creación de perfiles empresariales por administradores
 * - Importación de datos de empresas
 * - Registro avanzado de productores jurídicos
 */

import {
  IsString, IsOptional, IsNumber, IsBoolean, IsDateString, IsEmail,
} from 'class-validator';

export class CrearPersonaJuridicaDto {
  @IsString({ message: 'La razón social debe ser un texto válido' })
  razon_social: string;

  @IsString({ message: 'El NIT debe ser un texto válido' })
  nit: string;

  @IsOptional()
  @IsNumber({}, { message: 'El tipo de entidad debe ser un número válido' })
  tipo_entidad_id?: number;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de constitución debe ser una fecha válida (YYYY-MM-DD)' })
  fecha_constitucion?: string;

  @IsOptional()
  @IsString({ message: 'El objeto social debe ser un texto válido' })
  objeto_social?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El municipio debe ser un número válido' })
  municipio_id?: number;

  @IsOptional()
  @IsString({ message: 'La dirección física debe ser un texto válido' })
  direccion_fisica?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un texto válido' })
  telefono_contacto?: string;

  @IsOptional()
  @IsString({ message: 'El correo institucional debe ser un texto válido' })
  correo_institucional?: string;

  @IsOptional()
  @IsString({ message: 'La página web debe ser un texto válido' })
  pagina_web?: string;

  @IsString({ message: 'El nombre del representante legal debe ser un texto válido' })
  nombre_representante_legal: string;

  @IsOptional()
  @IsNumber({}, { message: 'El tipo de documento debe ser un número válido' })
  tipo_documento_representante_id?: number;

  @IsString({ message: 'El número de documento del representante debe ser un texto válido' })
  numero_documento_representante: string;

  @IsOptional()
  @IsBoolean({ message: 'Debe indicar si está registrado en Soy Cultura (sí o no)' })
  registro_soy_cultura?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Debe indicar si está en el Observatorio Cultural de Boyacá (sí o no)' })
  registro_observatorio_cultural_boyaca?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Debe indicar si ha recibido estímulos o apoyos públicos (sí o no)' })
  ha_recibido_estimulos_apoyos_publicos?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Debe indicar si participa en redes o asociaciones (sí o no)' })
  participa_redes_asociaciones?: boolean;

  @IsOptional()
  @IsString({ message: 'Las redes o asociaciones deben ser un texto válido' })
  cuales_redes_asociaciones?: string;

  @IsOptional()
  @IsString({ message: 'La fecha de inicio del nombramiento debe ser válida' })
  fecha_inicio_nombramiento?: string;

  @IsOptional()
  @IsString({ message: 'La fecha de fin del nombramiento debe ser válida' })
  fecha_fin_nombramiento?: string;

  @IsOptional()
  @IsString({ message: 'Las áreas de trabajo deben ser un texto válido' })
  areas_trabajo?: string;

  @IsOptional()
  @IsString({ message: 'Los proyectos realizados deben ser un texto válido' })
  proyectos_realizados?: string;

  @IsOptional()
  @IsString({ message: 'Los proyectos en curso deben ser un texto válido' })
  proyectos_en_curso?: string;

  @IsOptional()
  @IsString({ message: 'El público objetivo y beneficiarios deben ser un texto válido' })
  publico_objetivo_beneficiarios?: string;
}
