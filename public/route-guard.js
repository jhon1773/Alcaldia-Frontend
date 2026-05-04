/**
 * ROUTE-GUARD.JS — PROTECCIÓN DE RUTAS POR ROL P.U.F.A.B.
 * RESPONSABILIDADES:
 * 1. Verificar que el usuario autenticado tenga el rol requerido para acceder a la ruta actual
 * 2. Redirigir a /iniciar-sesion/ con el parámetro ?redirect= si la verificación falla
 * LÓGICA:
 * - Compara el pathname actual contra un mapa de prefijos de ruta y rol requerido:
 *     /tramites/  → producer
 *     /proveedor/ → provider
 *     /academico/ → academy
 *     /admin/     → admin
 * - Si el pathname no coincide con ningún prefijo protegido, el script no hace nada
 * - Lee localStorage['pufab_session'] y verifica que loggedIn sea true y role coincida
 * - Si la sesión es inválida o el rol no coincide, redirige a:
 *     /iniciar-sesion/?redirect={ruta completa codificada con path + search + hash}
 * NOTAS:
 * - Se ejecuta como IIFE de forma síncrona; debe cargarse en el <head> antes de cualquier
 *   render para evitar que el contenido protegido sea visible antes de la redirección
 * - No usa route-guard.js externo ni depende de api-client.js ni nav-session.js
 * - La verificación es solo del lado del cliente; el backend protege los datos con JWT
 */
(function () {
  const path = window.location.pathname;

  const roleByPrefix = [
    { prefix: '/tramites/', role: 'producer' },
    { prefix: '/proveedor/', role: 'provider' },
    { prefix: '/academico/', role: 'academy' },
    { prefix: '/admin/', role: 'admin' },
  ];

  const rule = roleByPrefix.find((r) => path.startsWith(r.prefix));
  if (!rule) return;

  let session = null;
  try {
    session = JSON.parse(localStorage.getItem('pufab_session') || 'null');
  } catch {
    session = null;
  }

  const loggedIn = Boolean(session?.loggedIn && session?.role);
  const allowed = loggedIn && session.role === rule.role;

  if (!allowed) {
    const redirect = encodeURIComponent(path + window.location.search + window.location.hash);
    window.location.href = `/iniciar-sesion/?redirect=${redirect}`;
  }
})();
