<template lang="pug">
article
  h1 Skapa ny rapport

  form(@submit.prevent="submit")
    app-textfield(v-model="id", label="Vecka #", type="number", required, pattern="^\d+$")
    app-textarea(v-model="content", label="Innehåll", rows="15", required)
    button.solid(type="submit") Skapa rapport
</template>

<script>
import AppTextfield from '~/components/Textfield.vue';
import AppTextarea from '~/components/Textarea.vue';

export default {
  name: 'CreateReport',
  components: { AppTextfield, AppTextarea },

  data: () => ({
    id: undefined,
    content: '',
  }),

  methods: {
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
