/**
 * APP.SERVICE.TS — SERVICIO RAÍZ DE LA APLICACIÓN
 *
 * RESPONSABILIDADES:
 * 1. Proveer lógica auxiliar compartida accesible desde el controlador raíz
 * 2. Exponer el health check básico de la aplicación
 *
 * MÉTODOS:
 * - getHello: Retorna el string de bienvenida; usado en las pruebas unitarias del controlador raíz
 *
 * INTEGRACIÓN:
 * - Inyectado en AppController
 * - Puede extenderse para centralizar lógica transversal que no pertenezca a ningún módulo de dominio
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}