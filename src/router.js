import { createRouter, createWebHistory } from 'vue-router';
import Home from './shared/presentation/views/home.vue';
import iamRoutes from './iam/presentation/iam-routes.js';
import { authenticationGuard } from './iam/infrastructure/authentication.guard.js';

// Define lazy-loaded components for routes
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');
const layout      = () => import('./shared/presentation/components/layout.vue');
const profile     = () => import('./profile/presentation/views/profile.vue');
const reports = () => import('./reports/presentation/views/reports.vue');
const projects = () => import('./projects/presentation/views/project.vue');
const taskCollaboration = () => import('./task-collaboration/presentation/views/task-collaboration.vue');
const systemAdministration = () => import('./system-administration/presentation/pages/system-administration-page.vue');
const signInForm = () => import('./iam/presentation/views/sign-in-form.vue');
const schedule     = () => import('./schedule/presentation/views/schedule.vue');
const meetings     = () => import('./meetings/presentation/views/meetings.vue');
const support      = () => import('./support/presentation/views/support.vue');
const settings     = () => import('./settings/presentation/views/settings.vue');


// Routes version when IAM is not implemented
const routes = [
    // Public route: Sign-in (root)
    { path: '/', name: 'sign-in', component: signInForm, meta: { title: 'Sign-In' } },
    { path: '/iam', name: 'iam', children: iamRoutes },

    // Protected routes: Main dashboard with layout
    { path: '/dashboard', component: layout, children: [
        { path: '',                name: 'home',            component: Home,         meta: { title: 'Home' } },
        { path: 'active-projects', name: 'active-projects', component: projects, meta: { title: 'Active Projects' } },
        { path: 'team',            name: 'team',            component: taskCollaboration, meta: { title: 'Team' } },
        { path: 'chat-hub',        name: 'chat-hub',        component: pageNotFound, meta: { title: 'Chat Hub' } },
        { path: 'schedule',        name: 'schedule',        component: schedule,     meta: { title: 'Schedule' } },
        { path: 'meetings',        name: 'meetings',        component: meetings,     meta: { title: 'Meetings' } },
        { path: 'reports',         name: 'reports',         component: reports, meta: { title: 'Reports' } },
        { path: 'profile',         name: 'profile',         component: profile,      meta: { title: 'Profile' } },
        { path: 'support',         name: 'support',         component: support,      meta: { title: 'Support' } },
        { path: 'settings',        name: 'settings',        component: settings,     meta: { title: 'Settings' } },
        { path: 'system-administration/:section?', name: 'system-administration', component: systemAdministration, meta: { title: 'System Administration' } },
    ]},

    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found' } }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

/**
 * Global navigation guard that updates the document title and delegates auth when enabled.
 *
 * @param {import('vue-router').RouteLocationNormalized} to - Target route.
 * @param {import('vue-router').RouteLocationNormalized} from - Previous route.
 * @param {import('vue-router').NavigationGuardNext} next - Guard continuation callback.
 * @returns {void}
 */
router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    // Set the page title
    let baseTitle = 'Vantage PMO';
    document.title = `${baseTitle} - ${to.meta['title']}`;
    // Use authentication guard to protect routes
    return authenticationGuard(to, from, next);
});

export default router;
