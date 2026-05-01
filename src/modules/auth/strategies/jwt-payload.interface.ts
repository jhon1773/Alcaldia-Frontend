/**
 * JWT-PAYLOAD.INTERFACE.TS — ESTRUCTURA DEL PAYLOAD DEL TOKEN JWT
 *
 * RESPONSABILIDADES:
 * 1. Definir el contrato de datos embebidos en el token JWT del sistema
 * 2. Garantizar tipado estricto al generar y validar tokens en AuthService y JwtStrategy
 * 3. Documentar el significado de cada campo del payload
 *
 * CAMPOS:
 * - sub:         ID numérico del usuario (estándar JWT: 'subject')
 * - email:       Correo electrónico del usuario autenticado
 * - roles:       Códigos de roles asignados al usuario (ej: ['admin', 'productora'])
 * - permisos:    Códigos de permisos calculados al momento del login
 *                (evita consultas a BD en cada request)
 * - tipoPerfil:  Código del tipo de perfil del usuario (ej: 'natural', 'juridica')
 *
 * ESTRATEGIA DE PERMISOS EN EL TOKEN:
 * - Los permisos se embeben en el JWT durante el login para evitar
 *   consultas a la base de datos en cada solicitud autenticada
 * - Si los permisos del usuario cambian, el token anterior sigue
 *   siendo válido hasta su expiración (considerar tokens de corta duración)
 *
 * INTEGRACIÓN:
 * - AuthService.login() construye y firma un objeto JwtPayload
 * - JwtStrategy.validate() deserializa y retorna el payload al request
 * - PermisosGuard y RolesGuard leen roles y permisos desde request.user
 */

export interface JwtPayload {
  sub: number;
  email: string;
  roles: string[];
  permisos: string[];
  tipoPerfil: string;
}