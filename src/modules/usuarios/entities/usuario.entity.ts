/**
 * USUARIO.ENTITY.TS — ENTIDAD BASE DE AUTENTICACIÓN Y ACCESO
 *
 * RESPONSABILIDADES:
 * 1. Representar la cuenta de acceso al sistema para cualquier tipo de usuario
 * 2. Almacenar las credenciales de autenticación y el estado de la cuenta
 * 3. Diferenciar si el usuario corresponde a una persona natural o jurídica
 *
 * CAMPOS PRINCIPALES:
 * - tipo_persona:       Discriminador que indica si es 'natural' o 'juridica'
 * - email:              Identificador único de acceso al sistema
 * - password_hash:      Contraseña almacenada con hash para autenticación segura
 * - estado_cuenta_id:   Estado actual de la cuenta (activa, suspendida, pendiente, etc.)
 * - tipo_perfil_id:     Rol del usuario en el sistema (admin, revisor, solicitante, etc.)
 * - ultimo_login:       Marca temporal del último acceso registrado
 * - fecha_aprobacion:   Fecha en que la cuenta fue aprobada por un administrador
 * - activo:             Indicador rápido de si la cuenta está habilitada
 *
 * INTEGRACIÓN:
 * - Referenciada en OneToOne por PersonaNatural y PersonaJuridica para extender el perfil
 * - Usada en todos los módulos del sistema para identificar al usuario autenticado
 * - EstadoCuenta y TipoPerfil provienen del módulo de catálogos
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, JoinColumn,
} from 'typeorm';
import { EstadoCuenta } from '../../catalogos/entities/estado-cuenta.entity';
import { TipoPerfil } from '../../catalogos/entities/tipo-perfil.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  // Determina si es persona natural o jurídica
  @Column({ type: 'varchar', length: 20 })
  tipo_persona: 'natural' | 'juridica';

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 30, nullable: true })
  telefono: string;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ length: 255 })
  password_hash: string;

  @Column({ nullable: true })
  estado_cuenta_id: number;

  @Column({ nullable: true })
  tipo_perfil_id: number;

  @Column({ type: 'timestamp', nullable: true })
  ultimo_login: Date;

  @CreateDateColumn()
  fecha_registro: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_aprobacion: Date;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => EstadoCuenta)
  @JoinColumn({ name: 'estado_cuenta_id' })
  estado_cuenta: EstadoCuenta;

  @ManyToOne(() => TipoPerfil)
  @JoinColumn({ name: 'tipo_perfil_id' })
  tipo_perfil: TipoPerfil;
}