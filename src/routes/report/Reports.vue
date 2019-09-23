<template lang="pug">
article.week-one
  button.solid(v-if="loggedIn", @click="create") Skapa rapport
  h1 Rapporter
  ul
    li(v-for="report in reports")
      router-link(:to="{ name: 'report', params: { id: report.id } }")
        | Rapport vecka {{ report.id }}
</template>

<style lang="scss" scoped>
button {
  float: right;
}

ul {
  list-style: none;
  padding: 0;
  font-size: 1.1em;
}

li a {
  display: block;
  padding: 0.5em 1em;
  margin: 0.5em 0;
  background: #e6e6e6;
  color: #000;
  border: 1px solid #e6e6e6;
  border-radius: 0.2em;
  text-decoration: none;

  &:hover, &:active {
    border-color: #397eff;
  }
}
</style>

<script>
export default {
  name: 'AppReports',

  data: () => ({
    reports: [],
  }),
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
  },

  async created() {
    this.reports = await this.$store.dispatch('request', {
      path: '/reports',
    });
  },

  methods: {
    create() {
      this.$router.push({ name: 'createReport' });
    }
  }
};
</script>
