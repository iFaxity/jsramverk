import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from './routes/Layout.vue';
import routes from './routes';
import store from './store';

Vue.use(VueRouter);

const router = new VueRouter({
  base: '/',
  mode: 'history',
  routes,
  linkActiveClass: 'exact-active',
  linkExactActiveClass: 'active',
});

// Middlewares
router.beforeEach((to, from, next) => {
  let title = to.meta && to.meta.title;

  if (title) {
    title = typeof title == 'function' ? title(to) : title;
    document.title = `chnc16 | ${title}`;
  }

  next();
});
router.beforeEach((to, from, next) => {
  const { meta } = to;

  if (meta && meta.auth && !store.getters.loggedIn) {
    next({
      name: 'login',
      query: {
        redirect: to.fullPath != '/' ? to.fullPath : undefined,
      }
    });
  } else {
    next();
  }
});

// Create vue instance
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(Layout),
});
