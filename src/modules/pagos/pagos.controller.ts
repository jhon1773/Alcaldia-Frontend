import {
  Controller, Get, Post, Patch, Param, Body,
  ParseIntPipe, UseGuards,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth,
  ApiParam, ApiBody,
} from '@nestjs/swagger';
import { PagosService } from './pagos.service';
import { RegistrarPagoDto } from './dto/registrar-pago.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('pagos')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar pago',
    description: 'El solicitante registra un pago adjuntando el soporte. Queda en estado "pendiente de verificación" hasta que un admin lo confirme.',
  })
  @ApiResponse({ status: 201, description: 'Pago registrado. Pendiente de verificación.' })
  registrar(
    @CurrentUser('id') usuarioId: number,
    @Body() dto: RegistrarPagoDto,
  ) {
    return this.pagosService.registrarPago(usuarioId, dto);
  }

  @Get('tramite/:tramiteId')
  @ApiOperation({ summary: 'Listar pagos de un trámite' })
  @ApiParam({ name: 'tramiteId', description: 'ID del trámite' })
  @ApiResponse({ status: 200, description: 'Lista de pagos del trámite.' })
  listarPorTramite(@Param('tramiteId', ParseIntPipe) tramiteId: number) {
    return this.pagosService.listarPorTramite(tramiteId);
  }

  @Roles('admin')
  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado de un pago', description: 'Admin verifica o rechaza el soporte de pago.' })
  @ApiParam({ name: 'id', description: 'ID del pago' })
  @ApiBody({
    schema: {
      properties: {
        estado: { type: 'string', enum: ['verificado', 'rechazado'], example: 'verificado' },
      },
      required: ['estado'],
    },
  })
  @ApiResponse({ status: 200, description: 'Estado del pago actualizado.' })
  actualizarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: string,
  ) {
    return this.pagosService.actualizarEstadoPago(id, estado);
  }

  @Get('tramite/:tramiteId/abono')
  @ApiOperation({ summary: 'Obtener abono de un trámite', description: 'Retorna el registro de abono inicial requerido para el trámite.' })
  @ApiParam({ name: 'tramiteId', description: 'ID del trámite' })
  @ApiResponse({ status: 200, description: 'Datos del abono.' })
  obtenerAbono(@Param('tramiteId', ParseIntPipe) tramiteId: number) {
    return this.pagosService.obtenerAbonoPorTramite(tramiteId);
  }
}
