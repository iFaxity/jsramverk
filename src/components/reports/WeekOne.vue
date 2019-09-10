<template lang="pug">
article.week-one
  h1 Rapport vecka 1
  include:markdown-it ../../../README.md
</template>

<script>
export default {
  name: "WeekOne",
};
</script>
