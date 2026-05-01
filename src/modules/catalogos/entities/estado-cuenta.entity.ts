/**
 * ESTADO-CUENTA.ENTITY.TS — ESTADOS POSIBLES DE UNA CUENTA DE USUARIO
 *
 * RESPONSABILIDADES:
 * 1. Controlar el estado de activación de cuentas de usuario
 * 2. Gestionar flujo de aprobación de nuevos usuarios
 * 3. Bloquear acceso a usuarios suspendidos o rechazados
 * 4. Mantener integridad del sistema de autenticación
 *
 * ESTADOS DEL CICLO DE VIDA DE USUARIO:
 * - 'pendiente': Usuario registrado, esperando completar perfil
 * - 'activo': Usuario aprobado, puede usar el sistema completamente
 * - 'suspendido': Usuario temporalmente inhabilitado por admin
 * - 'rechazado': Usuario rechazado en proceso de aprobación
 * - 'eliminado': Usuario permanentemente eliminado (soft delete)
 *
 * CAMPOS:
 * - id: ID único autoincremental
 * - codigo: Código único para lógica (activo, pendiente, etc.)
 * - nombre: Nombre descriptivo del estado
 * - activo: Si el estado permite acceso al sistema
 *
 * VALIDACIONES CRÍTICAS:
 * - Solo usuarios con estado_cuenta.codigo === 'activo' pueden:
 *   * Crear proyectos y trámites
 *   * Acceder a funcionalidades principales
 *   * Realizar operaciones sensibles
 * - CuentaAprobadaGuard valida esto en cada request
 *
 * FLUJO DE APROBACIÓN:
 * 1. Usuario se registra → estado 'pendiente'
 * 2. Usuario completa perfil → sigue 'pendiente'
 * 3. Admin revisa y aprueba → cambia a 'activo'
 * 4. Usuario puede usar sistema
 * 5. Admin puede suspender → cambia a 'suspendido'
 *
 * INTEGRACIÓN:
 * - UsuariosService.cambiarEstado() para cambios por admin
 * - AuthService.login() verifica estado antes de generar JWT
 * - Guards validan estado en operaciones críticas
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('estados_cuenta')
export class EstadoCuenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  codigo: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ default: true })
  activo: boolean;
}
