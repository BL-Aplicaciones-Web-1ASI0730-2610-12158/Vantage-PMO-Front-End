import useIamStore from "../application/iam.store.js";

/**
 * Navigation guard that protects non-public routes for anonymous users
 * and enforces segment boundaries based on user roles.
 *
 * @param {import('vue-router').RouteLocationNormalized} to - Target route.
 * @param {import('vue-router').RouteLocationNormalized} from - Current route.
 * @param {import('vue-router').NavigationGuardNext} next - Guard continuation callback.
 * @returns {void}
 */
export const authenticationGuard = (to, from, next) => {
    const store = useIamStore();
    const isAnonymous = !store.isSignedIn;
    const publicRoutes = ['/', '/iam/sign-in', '/iam/sign-up', '/about', '/page-not-found'];
    const isPublicRoute = publicRoutes.includes(to.path) || to.path.startsWith('/iam');

    // 1. Si el usuario no está autenticado y la ruta no es pública, va al Sign-In
    if (isAnonymous && !isPublicRoute) {
        console.log('User is not authenticated, redirecting to sign-in');
        return next({ name: 'sign-in' }); // Apunta al nombre de tu ruta raíz configurada
    }

    // 2. Si el usuario ya inició sesión, controlamos los cruces de segmentos
    if (!isAnonymous) {
        const userRole = store.currentUserRole;

        // Si es un MANAGER normal e intenta colarse en el Portfolio Ejecutivo, lo rebotamos al dashboard estándar
        if (to.path.startsWith('/portfolio') && userRole !== 'PORTFOLIO_DIRECTOR') {
            console.warn(`Role ${userRole} unauthorized for portfolio segment. Redirecting to standard dashboard.`);
            return next({ name: 'home' });
        }

        // Si es un PORTFOLIO_DIRECTOR e intenta entrar al dashboard operativo, lo llevamos a su portafolio estratégico
        if (to.path.startsWith('/dashboard') && userRole === 'PORTFOLIO_DIRECTOR') {
            console.warn(`Role ${userRole} redirected to portfolio management suite.`);
            return next({ name: 'portfolio-home' });
        }
    }

    // 3. Si todo es correcto o es una ruta pública, continúa con la navegación
    next();
}