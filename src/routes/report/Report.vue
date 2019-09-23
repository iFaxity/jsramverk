<template lang="pug">
article.week-one
  button.solid(v-if="loggedIn", @click="edit") Redigera
  h1(v-if="id") Rapport vecka {{ id }}
  .content(v-if="content", v-html="content")
</template>

<style lang="scss" scoped>
button {
  float: right;
}
</style>

<script>
import store from '~/store';

async function getReport(to, from, next) {
  const { id } = to.params;

  try {
    return await store.dispatch('request', {
      path: `/reports/week/${id}`,
    });
  } catch (ex) {
    if (ex.status == 404) {
      next({ name: '404' });
    } else {
      next();
    }
  }
}

export default {
  name: 'Report',

  data: () => ({
    id: null,
    content: null,
  }),
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
  },

  beforeRouteEnter(to, from, next) {
    return getReport(to, from, next).then(report => {
      next(vm => vm.init(vm, report));
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.id = null;
    this.content = null;

    return getReport(to, from, next).then(report => {
      this.init(this, report);
      next();
    });
  },

  methods: {
    init(vm, report) {
      vm.id = report.id;
      vm.content = report.content;
    },
    edit() {
      this.$router.push({
        name: 'editReport',
        params: { id: this.id, }
      });
    }
  },
};
</script>
