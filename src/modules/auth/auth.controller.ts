import {
  Controller, Post, Get, Body, UseGuards, Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistroUsuarioDto } from './dto/registro-usuario.dto';
import { CambiarPasswordDto } from './dto/cambiar-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Registro público — no requiere autenticación
  @Public()
  @Post('register')
  registrar(@Body() dto: RegistroUsuarioDto) {
    return this.authService.registrar(dto);
  }

  // Login público — retorna JWT con roles y permisos embebidos
  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Retorna el perfil del usuario autenticado
  @UseGuards(JwtAuthGuard)
  @Get('me')
  obtenerPerfil(@CurrentUser('id') usuarioId: number) {
    return this.authService.obtenerPerfil(usuarioId);
  }

  // Permite al usuario cambiar su contraseña
  @UseGuards(JwtAuthGuard)
  @Patch('cambiar-password')
  cambiarPassword(
    @CurrentUser('id') usuarioId: number,
    @Body() dto: CambiarPasswordDto,
  ) {
    return this.authService.cambiarPassword(usuarioId, dto);
  }
}
