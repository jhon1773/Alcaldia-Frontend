/**
 * RESPUESTA.INTERCEPTOR.TS — INTERCEPTOR GLOBAL DE RESPUESTAS EXITOSAS
 *
 * RESPONSABILIDADES:
 * 1. Envolver todas las respuestas exitosas en un formato estándar
 * 2. Garantizar consistencia en la estructura de datos devueltos al cliente
 * 3. Agregar metadatos de auditoría (timestamp) a cada respuesta
 *
 * ESTRUCTURA DE RESPUESTA EXITOSA:
 * {
 *   exitoso:   true (indica que la operación fue completada sin errores)
 *   datos:     payload original devuelto por el controlador
 *   timestamp: fecha y hora exacta de la respuesta en formato ISO
 * }
 *
 * COMPORTAMIENTO:
 * - Aplica automáticamente a todos los endpoints que retornen sin lanzar excepción
 * - No modifica el contenido de 'datos', solo lo encapsula
 * - Los errores NO pasan por este interceptor (los maneja HttpExceptionFilter)
 *
 * INTEGRACIÓN:
 * - Registrado globalmente en main.ts con app.useGlobalInterceptors()
 * - Trabaja en conjunto con HttpExceptionFilter para cubrir todos los casos
 * - El cliente frontend puede verificar el campo 'exitoso' para flujo de control
 */

import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RespuestaInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        exitoso: true,
        datos: data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}