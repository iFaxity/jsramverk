/* Lazy load the routes */
const Home = () => import('./components/Home.vue');
const WeekOne = () => import('./components/reports/WeekOne.vue');
import NotFound from './components/404.vue';

export default [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/reports/week/1',
        component: WeekOne,
    },
    {
        path: '/*',
        component: NotFound,
    },
];
