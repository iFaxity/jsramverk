import Vue from 'vue';
import Vuex from 'vuex';
import { request, parseToken } from '../lib/api';

const API_URL = process.env.API_URL;

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    token: null,
    payload: null,
  },
  getters: {
    loggedIn(state) {
      return !!state.token;
    },
    payload(state) {
      return state.payload;
    },
  },
  actions: {
    async request(ctx, opts) {
      const token = ctx.state.token;

      if (opts.auth) {
        if (!token) {
          throw new Error('Not logged in yet, can\'t send request.');
        }

        opts.headers = {
          'Authorization': `Bearer ${token}`,
        };
      }

      const body = await request(API_URL, opts);

      // Renew token if needed
      if (body && body.token) {
        ctx.commit('login', body.token);
      }

      return body.data;
    },
    login(ctx, { email, password }) {
      return ctx.dispatch('request', {
        path: '/login',
        method: 'post',
        data: { email, password },
      });
    },
    register(ctx, { email, name, password, birthdate }) {
      return ctx.dispatch('request', {
        path: '/register',
        method: 'post',
        data: { email, name, password, birthdate },
      });
    },
    logout(ctx) {
      ctx.commit('logout');
    }
  },
  mutations: {
    login(state, token) {
      state.token = token;
      state.payload = parseToken(token);
    },
    logout(state) {
      state.token = null;
      state.payload = null;
    },
  },
});
