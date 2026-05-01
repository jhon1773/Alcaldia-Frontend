/**
 * TIPO-PAGO.ENTITY.TS — TIPOS DE PAGOS SOPORTADOS EN EL SISTEMA
 *
 * RESPONSABILIDADES:
 * 1. Definir métodos de pago disponibles para trámites
 * 2. Gestionar integración con pasarelas de pago
 * 3. Controlar tipos de pago activos/inactivos
 * 4. Mantener catálogo de opciones de pago
 *
 * TIPOS DE PAGO TÍPICOS:
 * - 'transferencia_bancaria': Transferencia bancaria directa
 * - 'pago_en_linea': Pago electrónico por plataforma
 * - 'efectivo': Pago en efectivo en ventanilla
 * - 'cheque': Pago mediante cheque bancario
 * - 'tarjeta_credito': Pago con tarjeta de crédito
 * - 'tarjeta_debito': Pago con tarjeta débito
 *
 * CAMPOS:
 * - id: ID único autoincremental
 * - codigo: Código único para integración con APIs
 * - nombre: Nombre descriptivo del método de pago
 * - descripcion: Detalles del método de pago
 * - activo: Si está disponible para nuevos pagos
 *
 * INTEGRACIÓN CON PAGOS:
 * - PagosService valida tipos permitidos
 * - UI muestra opciones de pago disponibles
 * - Reportes de ingresos por tipo de pago
 * - Configuración de comisiones por método
 *
 * FLUJO DE PAGO EN PUFAB:
 * 1. Trámite requiere abono (default 30%)
 * 2. Usuario selecciona tipo de pago
 * 3. Sistema registra intención de pago
 * 4. Usuario completa pago según método
 * 5. Sistema verifica y confirma pago
 * 6. Trámite puede continuar proceso
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_pago')
export class TipoPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  codigo: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;
}
