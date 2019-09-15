<template lang="pug">
.dropdown(@click="toggle")
  | {{ title }}
  .list(v-if="open")
    slot
</template>

<style lang="scss" scoped>
$media-tablet: 768px;

.dropdown {
  position: relative;
  display: inline-block;
  padding: 0.5em 0.8em;
  margin: 0 0.2em;
  user-select: none;
  cursor: pointer;

  &::after {
    content: '';
    display: inline-block;
    margin-left: .5em;
    vertical-align: .15em;
    border-top: .35em solid;
    border-right: .35em solid transparent;
    border-left: .35em solid transparent;
  }
}

.list {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 2.5em;
  left: 0;
  width: 100%;
  background: #397eff;
  box-shadow: 0 0 0.5em 0.1em rgba(0, 0, 0, 0.4);
  overflow: hidden;
  z-index: 5;

  a {
    flex: 1;
    display: block;
    //padding: 1 0.8em;
    padding: 0.5em 0.5em;
    margin: 0.3em 0.3em;
  }
}
</style>

<script>
export default {
  name: 'AppDropdown',
  props: {
    title: String,
  },

  data: () => ({ open: false }),

  methods: {
    toggle() {
      this.open = !this.open;
    },
  },
};
</script>
