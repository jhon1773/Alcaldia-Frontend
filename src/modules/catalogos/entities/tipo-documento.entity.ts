/**
 * TIPO-DOCUMENTO.ENTITY.TS — TIPOS DE DOCUMENTOS REQUERIDOS EN TRÁMITES
 *
 * RESPONSABILIDADES:
 * 1. Definir catálogo de documentos que pueden requerirse
 * 2. Especificar qué tipos aplican a qué perfiles
 * 3. Controlar obligatoriedad de documentos
 * 4. Gestionar documentos activos/inactivos
 *
 * TIPOS DE DOCUMENTOS TÍPICOS:
 * - 'cedula_ciudadania': Cédula de ciudadanía
 * - 'rut': Registro único tributario
 * - 'camara_comercio': Certificado de existencia y representación legal
 * - 'certificado_bancario': Certificado bancario
 * - 'presupuesto_detallado': Presupuesto detallado del proyecto
 * - 'guion_tecnico': Guion técnico del proyecto
 * - 'contrato_produccion': Contrato de producción
 * - 'seguro_responsabilidad': Póliza de seguro de responsabilidad civil
 *
 * CAMPOS:
 * - id: ID único autoincremental
 * - nombre: Nombre descriptivo del tipo de documento
 * - descripcion: Explicación detallada del documento requerido
 * - aplica_a: Perfil al que aplica ('natural', 'juridica', 'todos')
 * - obligatorio: Si es requerido para completar trámite
 * - activo: Si está disponible para nuevos trámites
 *
 * VALIDACIÓN POR PERFIL:
 * - Persona Natural: Documentos básicos de identificación
 * - Persona Jurídica: Documentos empresariales adicionales
 * - Todos: Documentos que aplican a cualquier perfil
 *
 * USO EN SISTEMA:
 * - DocumentosService valida tipos permitidos
 * - UI muestra lista de documentos requeridos por perfil
 * - TramitesService verifica documentos obligatorios antes de aprobar
 * - Reportes muestran cumplimiento documental
 *
 * CONFIGURACIÓN:
 * - Administrador puede activar/desactivar tipos
 * - Cambios afectan a trámites futuros, no existentes
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_documento')
export class TipoDocumento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ length: 50, nullable: true })
  aplica_a: string;

  @Column({ default: false })
  obligatorio: boolean;

  @Column({ default: true })
  activo: boolean;
}
