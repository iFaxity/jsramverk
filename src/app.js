import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from './components/Layout.vue';
import routes from './routes';

const Router = new VueRouter({
  base: '/',
  mode: 'history',
  routes,
  linkActiveClass: 'exact-active',
  linkExactActiveClass: 'active',
});

Vue.use(VueRouter);

// Create vue instance
new Vue({
  el: '#app',
  router: Router,
  render: h => h(Layout),
});
