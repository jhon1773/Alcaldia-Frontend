/**
 * HTTP-EXCEPTION.FILTER.TS — FILTRO GLOBAL DE EXCEPCIONES HTTP
 *
 * RESPONSABILIDADES:
 * 1. Capturar todas las excepciones HTTP lanzadas en la aplicación
 * 2. Estandarizar el formato de respuesta de error para el cliente
 * 3. Registrar errores críticos de servidor (5xx) en el log
 * 4. Incluir metadatos útiles como ruta y timestamp en la respuesta
 *
 * ESTRUCTURA DE RESPUESTA DE ERROR:
 * {
 *   statusCode: número HTTP del error (400, 401, 403, 404, 500...)
 *   mensaje:    descripción del error o array de mensajes de validación
 *   ruta:       URL que generó el error
 *   timestamp:  fecha y hora exacta del error en formato ISO
 * }
 *
 * COMPORTAMIENTO:
 * - Errores 4xx: se responden sin log (son errores del cliente)
 * - Errores 5xx: se registran con stack trace en el logger de NestJS
 * - El mensaje se extrae del body de la excepción si es un objeto,
 *   o se usa directamente si es un string
 *
 * INTEGRACIÓN:
 * - Registrado globalmente en main.ts con app.useGlobalFilters()
 * - Aplica a todos los controladores y rutas de la aplicación
 * - Compatible con class-validator (captura arrays de mensajes de validación)
 */

import {
  ExceptionFilter, Catch, ArgumentsHost,
  HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const mensaje =
      typeof exceptionResponse === 'object' && 'message' in exceptionResponse
        ? (exceptionResponse as any).message
        : exceptionResponse;

    const respuesta = {
      statusCode: status,
      mensaje,
      ruta: request.url,
      timestamp: new Date().toISOString(),
    };

    // Registra errores del servidor (5xx) en el log
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`Error ${status} en ${request.url}`, exception.stack);
    }

    response.status(status).json(respuesta);
  }
}