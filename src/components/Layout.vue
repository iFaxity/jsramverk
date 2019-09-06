<template lang="pug">
#app
  header
    nav
      router-link(to="/") Hem
      router-link(to="/reports/week/1") Rapport vecka 1
  main
    router-view
  footer
    p Copyright © 2019 Christian Norrman, christian@faxity.se
</template>

<style lang="scss" scoped>
  #app {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    max-width: 800px;
    min-height: 100vh;
    background: #f5f5f5;
  }

  header {
    position: sticky;
    top: 0;
    padding: 0.5em 1em;
    background: #397eff;
    color: #fff;
    box-shadow: 0 0 0.5em 0.1em rgba(0, 0, 0, 0.5);
    flex: 0;

    nav {
      a {
        display: inline-block;
        color: inherit;
        padding: 0.5em 0.8em;
        margin: 0 0.2em;
        text-decoration: none;
        border-bottom: 0.1em solid transparent;

        &:hover {
          border-color: #fff;
        }

        &.active {
          border-color: #fff;
        }
      }
    }
  }

  main {
    padding: 1em;
    flex: 1;
  }

  footer {
    padding: 1em;
    background: #397eff;
    color: #fff;
    box-shadow: 0 0 0.5em 0.1em rgba(0, 0, 0, 0.5);
    flex: 0;

    p {
      margin: 0;
    }
  }
</style>

<script>
export default {
  name: "Layout",
};
</script>
