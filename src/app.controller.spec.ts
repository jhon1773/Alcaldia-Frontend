/**
 * APP.CONTROLLER.SPEC.TS — PRUEBAS UNITARIAS DEL CONTROLADOR RAÍZ
 *
 * RESPONSABILIDADES:
 * 1. Verificar el comportamiento básico del AppController en aislamiento
 * 2. Garantizar que el módulo de pruebas se compile y configure correctamente
 *
 * CASOS DE PRUEBA:
 * - root › should return "Hello World!": Comprueba que getHello() retorna el string esperado
 *
 * NOTA:
 * - AppService se provee directamente en el módulo de prueba sin mocks
 * - Esta spec cubre únicamente el método getHello() heredado del scaffold inicial de NestJS
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});