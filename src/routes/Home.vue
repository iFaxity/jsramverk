<template lang="pug">
article
  h1 Välkomstmeddelande
  img(src="/img/me.jpg", alt="En bild på mig")

  .content(v-if="content", v-html="content")
</template>

<script>
export default {
  name: 'Home',
  data: () => ({ content: '' }),

  async created() {
    const data = await this.$store.dispatch('request', {
      path: '/',
    });

    this.content = data.content;
  },
};
</script>
