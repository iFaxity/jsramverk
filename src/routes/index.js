/* Lazy load the routes */
const Home = () => import('./Home.vue');
const WeekOne = () => import('./reports/WeekOne.vue');
const WeekTwo = () => import('./reports/WeekTwo.vue');
const Register = () => import('./Register.vue');
import NotFound from './404.vue';

export default [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/reports/week/1',
    component: WeekOne,
  },
  {
    path: '/reports/week/2',
    component: WeekTwo,
  },
  {
    path: '/*',
    component: NotFound,
  },
];
