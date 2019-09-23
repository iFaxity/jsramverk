/* Lazy load the routes */
const Home = () => import('./Home.vue');
const Login = () => import('./auth/Login.vue');
const Register = () => import('./auth/Register.vue');
const Report = () => import('./report/Report.vue');
const Reports = () => import('./report/Reports.vue');
const EditReport = () => import('./report/EditReport.vue');
const CreateReport = () => import('./report/CreateReport.vue');
const NotFound = () => import('./404.vue');

import store from '~/store';

export default [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'Hem',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'Login',
    },
  },
  {
    path: '/logout',
    name: 'logout',
    meta: {
      title: 'Logout',
    },
    beforeEnter(to, from, next) {
      store.dispatch('logout');
      next({ name: 'home' });
    },
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      title: 'Registrera',
    },
  },
  {
    path: '/reports',
    name: 'reports',
    component: Reports,
    meta: {
      title: 'Rapporter',
    },
  },
  {
    path: '/reports/week/:id',
    name: 'report',
    component: Report,
    meta: {
      title: route => `Rapport vecka ${route.params.id}`,
    },
  },
  {
    path: '/reports/week/:id/edit',
    name: 'editReport',
    component: EditReport,
    meta: {
      auth: true,
      title: route => `Redigera rapport ${route.params.id}`,
    },
  },
  {
    path: '/reports/create',
    name: 'createReport',
    component: CreateReport,
    meta: {
      auth: true,
      title: 'Skapa ny rapport',
    },
  },
  {
    path: '/*',
    name: '404',
    component: NotFound,
    meta: {
      title: '404 Sidan hittades inte',
    },
  },
];
