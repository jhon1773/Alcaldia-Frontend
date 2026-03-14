import {
  IsEmail, IsString, MinLength, IsIn, IsOptional, IsPhoneNumber,
} from 'class-validator';

export class RegistroUsuarioDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @IsIn(['natural', 'juridica'], { message: 'El tipo de persona debe ser natural o juridica' })
  tipo_persona: 'natural' | 'juridica';

  @IsOptional()
  @IsString()
  telefono?: string;
}
