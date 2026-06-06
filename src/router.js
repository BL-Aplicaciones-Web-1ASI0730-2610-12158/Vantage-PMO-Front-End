import { createRouter, createWebHistory } from 'vue-router';
import Home from './shared/presentation/views/home.vue';
import iamRoutes from './view1/iam/presentation/iam-routes.js';
import { authenticationGuard } from './view1/iam/infrastructure/authentication.guard.js';

// Define lazy-loaded components for routes
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');
const layout      = () => import('./shared/presentation/components/layout.vue');
const profile     = () => import('./view1/profile/presentation/views/profile.vue');
const reports = () => import('./view1/reports/presentation/views/reports.vue');
const projects = () => import('./view1/projects/presentation/views/project.vue');
const taskCollaboration = () => import('./view1/task-collaboration/presentation/views/task-collaboration.vue');
const systemAdministration = () => import('./view1/system-administration/presentation/pages/system-administration-page.vue');
const signInForm = () => import('./view1/iam/presentation/views/sign-in-form.vue');
const schedule     = () => import('./view1/schedule/presentation/views/schedule.vue');
const meetings     = () => import('./view1/meetings/presentation/views/meetings.vue');
const support      = () => import('./view1/support/presentation/views/support.vue');
const settings     = () => import('./view1/settings/presentation/views/settings.vue');
const chatHub      = () => import('./view1/chat-hub/presentation/ChatHub.vue'); // Updated path


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
        { path: 'chat-hub',        name: 'chat-hub',        component: chatHub, meta: { title: 'Chat Hub' } }, // Updated: point to chatHub
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