import useIamStore from "../application/iam.store.js";

/**
 * Navigation guard that protects non-public routes for anonymous users.
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

    if (isAnonymous && !isPublicRoute) {
        console.log('User is not authenticated, redirecting to sign-in');
        return next({ name: 'sign-in' });
    } else {
        next();
    }
}