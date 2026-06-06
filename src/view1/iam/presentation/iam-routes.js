const signInForm      = () => import('./views/sign-in-form.vue')
const signUpForm      = () => import('./views/sign-up-form.vue')
const forgotPassword  = () => import('./views/forgot-password.vue')
const resetPassword   = () => import('./views/reset-password.vue')

/**
 * Route definitions for the IAM bounded context.
 * All paths are relative to the `/iam` parent route.
 *
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const iamRoutes = [
    { path: 'sign-in',         name: 'iam-sign-in',         component: signInForm,     meta: { title: 'Sign-In' } },
    { path: 'sign-up',         name: 'iam-sign-up',         component: signUpForm,     meta: { title: 'Sign-Up' } },
    { path: 'forgot-password', name: 'iam-forgot-password', component: forgotPassword, meta: { title: 'Forgot Password' } },
    { path: 'reset-password',  name: 'iam-reset-password',  component: resetPassword,  meta: { title: 'Reset Password' } }
];

export default iamRoutes;