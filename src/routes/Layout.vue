<template lang="pug">
#app
  header
    nav.left
      router-link(:to="{name: 'home'}") Hem
      router-link(:to="{name: 'reports'}") Rapporter

    nav.right(v-if="loggedIn")
      router-link(:to="{name: 'logout'}") Logout
    nav.right(v-else)
      router-link(:to="{name: 'login'}") Login
      router-link(:to="{name: 'register'}") Registrera
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
      &.left {
        float: left;
      }
      &.right {
        float: right;
      }

      a {
        display: inline-block;
        color: inherit;
        padding: 0.5em 0.8em;
        margin: 0 0.2em;
        text-decoration: none;
        border-bottom: 0.1em solid transparent;
        user-select: none;
        cursor: pointer;

        &:hover {
          border-color: #fff;
        }
        &.active {
          border-color: #fff;
        }
        &.login {
          float: right;
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
import AppDropdown from '../components/Dropdown.vue';

export default {
  name: 'Layout',
  data: () => ({
    loggedIn: false,
  }),

  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type == 'login') {
        this.loggedIn = true;
      } else if (mutation.type == 'logout') {
        this.loggedIn = false;
      }
    });
  },
};
</script>
