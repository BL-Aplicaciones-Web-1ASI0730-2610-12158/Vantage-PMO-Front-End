import { createRouter, createWebHistory } from 'vue-router';
import Home from './shared/presentation/views/home.vue';
// import iamRoutes from './iam/presentation/iam-routes.js';

// Define lazy-loaded components for routes
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');
const layout      = () => import('./shared/presentation/components/layout.vue');
const profile     = () => import('./profile/presentation/views/profile.vue');
const reports = () => import('./reports/presentation/views/reports.vue');
const project = () => import('./projects/presentation/views/project.vue');
const projectManagement = () => import('./projects/presentation/views/project-management.vue');
const taskCollaboration = () => import('./task-collaboration/presentation/views/task-collaboration.vue');

/*
// Routes version when IAM is implemented
const routes = [
    { path: '/', component: layout, children: [
        { path: '',                name: 'home',            component: Home,         meta: { title: 'Home' } },
        { path: 'active-projects', name: 'active-projects', component: pageNotFound, meta: { title: 'Active Projects' } },
        { path: 'team',            name: 'team',            component: pageNotFound, meta: { title: 'Team' } },
        { path: 'chat-hub',        name: 'chat-hub',        component: pageNotFound, meta: { title: 'Chat Hub' } },
        { path: 'schedule',        name: 'schedule',        component: pageNotFound, meta: { title: 'Schedule' } },
        { path: 'meetings',        name: 'meetings',        component: pageNotFound, meta: { title: 'Meetings' } },
        { path: 'reports',         name: 'reports',         component: pageNotFound, meta: { title: 'Reports' } },
        { path: 'profile',         name: 'profile',         component: profile,      meta: { title: 'Profile' } },
        { path: 'support',         name: 'support',         component: pageNotFound, meta: { title: 'Support' } },
        { path: 'settings',        name: 'settings',        component: pageNotFound, meta: { title: 'Settings' } },
    ]},
    { path: '/iam', name: 'iam', children: iamRoutes },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found' } }
];
*/

// Routes version when IAM is not implemented
const routes = [
    { path: '/', component: layout, children: [
        { path: '',                name: 'home',            component: Home,                meta: { title: 'Home' } },
        { path: 'active-projects', name: 'active-projects', component: project,          meta: { title: 'Project Management' } },
        { path: 'team',            name: 'team',            component: taskCollaboration,   meta: { title: 'Team' } },
        { path: 'chat-hub',        name: 'chat-hub',        component: pageNotFound,        meta: { title: 'Chat Hub' } },
        { path: 'schedule',        name: 'schedule',        component: pageNotFound,        meta: { title: 'Schedule' } },
        { path: 'meetings',        name: 'meetings',        component: pageNotFound,        meta: { title: 'Meetings' } },
        { path: 'reports',         name: 'reports',         component: reports,            meta: { title: 'Reports' } },
        { path: 'profile',         name: 'profile',         component: profile,            meta: { title: 'Profile' } },
        { path: 'support',         name: 'support',         component: pageNotFound,        meta: { title: 'Support' } },
        { path: 'settings',        name: 'settings',        component: pageNotFound,        meta: { title: 'Settings' } },
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
    // When IAM is implemented, use:
    // return authenticationGuard(to, from, next);
    // if not, use:
    return next();
});

export default router;
