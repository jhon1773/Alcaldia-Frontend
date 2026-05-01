/**
 * AUTH.CONTROLLER.TS — CONTROLADOR DEL MÓDULO DE AUTENTICACIÓN
 *
 * RESPONSABILIDADES:
 * 1. Exponer los endpoints HTTP del flujo de autenticación y gestión de cuenta
 * 2. Validar permisos de acceso mediante JwtAuthGuard en rutas protegidas
 * 3. Delegar toda la lógica de negocio a AuthService
 * 4. Gestionar la subida y almacenamiento de fotos de perfil con Multer
 *
 * ENDPOINTS EXPUESTOS:
 * ┌─────────────────────────────┬────────┬────────────┬────────────────────────────────────────┐
 * │ Ruta                        │ Método │ Protegido  │ Descripción                            │
 * ├─────────────────────────────┼────────┼────────────┼────────────────────────────────────────┤
 * │ /auth/register              │ POST   │ No (public)│ Registra nuevo usuario en estado        │
 * │                             │        │            │ PENDIENTE hasta aprobación de admin     │
 * │ /auth/login                 │ POST   │ No (public)│ Valida credenciales y retorna JWT       │
 * │ /auth/me                    │ GET    │ Sí (JWT)   │ Retorna perfil del usuario autenticado  │
 * │ /auth/me                    │ PATCH  │ Sí (JWT)   │ Actualiza teléfono y bio del usuario    │
 * │ /auth/me/foto               │ POST   │ Sí (JWT)   │ Sube imagen de avatar (máx. 2 MB)       │
 * │ /auth/cambiar-password      │ PATCH  │ Sí (JWT)   │ Cambia la contraseña del usuario        │
 * └─────────────────────────────┴────────┴────────────┴────────────────────────────────────────┘
 *
 * SUBIDA DE ARCHIVOS:
 * - Las fotos de perfil se guardan en: /uploads/perfiles/<uuid>.<ext>
 * - Tamaño máximo permitido: 2 MB por archivo
 * - El directorio se crea automáticamente si no existe
 * - El nombre del archivo se genera con UUID para evitar colisiones
 *
 * INTEGRACIÓN:
 * - AuthService maneja toda la lógica de autenticación y persistencia
 * - @CurrentUser('id') extrae el ID del usuario desde el payload del JWT
 * - Las rutas @Public() son accesibles sin token (manejado por JwtAuthGuard)
 */

import {
  Controller, Post, Get, Body, UseGuards, Patch, UploadedFile, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistroUsuarioDto } from './dto/registro-usuario.dto';
import { CambiarPasswordDto } from './dto/cambiar-password.dto';
import { ActualizarPerfilDto } from './dto/actualizar-perfil.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private static storagePerfil = diskStorage({
    destination: (req, file, cb) => {
      const dir = join(process.cwd(), 'uploads', 'perfiles');
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, `${randomUUID()}${extname(file.originalname)}`);
    },
  });

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario', description: 'Crea un usuario en estado PENDIENTE. Un administrador debe aprobarlo para que pueda iniciar sesión.' })
  @ApiResponse({ status: 201, description: 'Usuario registrado. Pendiente de aprobación.' })
  @ApiResponse({ status: 409, description: 'Ya existe un usuario con ese correo.' })
  registrar(@Body() dto: RegistroUsuarioDto) {
    return this.authService.registrar(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión', description: 'Valida credenciales y retorna un JWT con roles y permisos embebidos.' })
  @ApiResponse({ status: 200, description: 'Login exitoso. Retorna access_token JWT.' })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas o cuenta no activa.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado', description: 'Retorna los datos del usuario autenticado incluyendo sus roles y permisos.' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario autenticado.' })
  obtenerPerfil(@CurrentUser('id') usuarioId: number) {
    return this.authService.obtenerPerfil(usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Actualizar perfil básico', description: 'Permite actualizar teléfono y biografía del usuario autenticado.' })
  actualizarPerfil(
    @CurrentUser('id') usuarioId: number,
    @Body() dto: ActualizarPerfilDto,
  ) {
    return this.authService.actualizarPerfil(usuarioId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/foto')
  @ApiBearerAuth('JWT')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Actualizar foto de perfil', description: 'Sube una imagen para personalizar el avatar del usuario autenticado.' })
  @UseInterceptors(FileInterceptor('foto', {
    storage: AuthController.storagePerfil,
    limits: { fileSize: 2 * 1024 * 1024 },
  }))
  actualizarFotoPerfil(
    @CurrentUser('id') usuarioId: number,
    @UploadedFile() foto?: Express.Multer.File,
  ) {
    if (!foto) {
      throw new BadRequestException('Debes seleccionar una imagen de perfil');
    }

    const avatarUrl = `/uploads/perfiles/${foto.filename}`;
    return this.authService.actualizarFotoPerfil(usuarioId, avatarUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('cambiar-password')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Cambiar contraseña', description: 'Permite al usuario autenticado cambiar su propia contraseña.' })
  @ApiResponse({ status: 200, description: 'Contraseña actualizada exitosamente.' })
  @ApiResponse({ status: 401, description: 'La contraseña actual es incorrecta.' })
  cambiarPassword(
    @CurrentUser('id') usuarioId: number,
    @Body() dto: CambiarPasswordDto,
  ) {
    return this.authService.cambiarPassword(usuarioId, dto);
  }
}