<template lang="pug">
article
  h1 Redigerar rapport vecka {{ id }}

  p OBS: Skriv innehållet i markdown.

  form(@submit.prevent="submit")
    app-textarea(v-model="content", label="Innehåll", rows="15", required)
    button.solid(type="submit") Uppdatera rapport
</template>

<script>
import AppTextarea from '~/components/Textarea.vue';
import store from '~/store';

async function getReport(to, from, next) {
  const { id } = to.params;

  try {
    return await store.dispatch('request', {
      path: `/reports/week/${id}/edit`,
      auth: true,
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
  name: 'EditReport',
  components: { AppTextarea },

  data: () => ({
    id: undefined,
    content: '',
  }),

  beforeRouteEnter(to, from, next) {
    return getReport(to, from, next).then(report => {
      next(vm => vm.init(vm, report));
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.id = '';
    this.content = '';

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
    async submit() {
      const { id, content } = this;

      await this.$store.dispatch('request', {
        method: 'post',
        path: '/reports',
        data: { id, content },
        auth: true,
      });
      this.$router.push({ name: 'report', params: { id } });
    }
  },
};
</script>
