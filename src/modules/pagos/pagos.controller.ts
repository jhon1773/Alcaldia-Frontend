import {
  Controller, Get, Post, Patch, Param, Body,
  ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { PagosService } from './pagos.service';
import { RegistrarPagoDto } from './dto/registrar-pago.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  // Solicitante registra un pago con su soporte
  @Post()
  registrar(
    @CurrentUser('id') usuarioId: number,
    @Body() dto: RegistrarPagoDto,
  ) {
    return this.pagosService.registrarPago(usuarioId, dto);
  }

  // Lista pagos de un trámite
  @Get('tramite/:tramiteId')
  listarPorTramite(@Param('tramiteId', ParseIntPipe) tramiteId: number) {
    return this.pagosService.listarPorTramite(tramiteId);
  }

  // Admin actualiza el estado de un pago
  @Roles('admin')
  @Patch(':id/estado')
  actualizarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: string,
  ) {
    return this.pagosService.actualizarEstadoPago(id, estado);
  }

  // Obtiene el abono de un trámite
  @Get('tramite/:tramiteId/abono')
  obtenerAbono(@Param('tramiteId', ParseIntPipe) tramiteId: number) {
    return this.pagosService.obtenerAbonoPorTramite(tramiteId);
  }
}
