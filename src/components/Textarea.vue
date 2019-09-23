<template lang="pug">
.textarea
  textarea(v-model="model", placeholder=" ", v-bind="$attrs", v-on="listeners")
  label(:for="uuid")
    slot {{ label }}
</template>

<style lang="scss" scoped>
.textarea {
  display: block;
  position: relative;
  margin: 0.3em 0;
  padding-top: 1.5em;
  width: 100%;
  background: #e6e6e67f;
  border-radius: 0.2em;
  color: #405863;
}

textarea {
  background: transparent;
  font-size: 1em;
  font-family: inherit;
  padding: 0 1em 1em;
  width: 100%;
  transition: border-color 0.2s ease, opacity 0.2s ease;
  border: none;
  border-bottom: 0.2em solid #8ea3ac;
  border-radius: 0.2em;
  outline: none;
  box-sizing: border-box;
  opacity: 0.5;
  vertical-align: top;
  resize: none;

  &:hover {
    opacity: 0.8;
  }
  &:focus {
    border-color: #397eff;
    opacity: 1;
  }

  &:focus + label,
  &:not(:placeholder-shown) + label {
    color: #397eff;
    transform: translateY(-60%) scale(0.9);
    opacity: 1;
  }

  &:invalid {
    border-color: #f00;

    & + label {
      color: #f00;
    }
  }
}

label {
  position: absolute;
  top: 1em;
  left: 1em;
  opacity: 0.5;
  transition: transform 0.2s ease, opacity 0.2s ease, color 0.2s ease;
  will-change: transform, opacity, color;
  transform-origin: top left;
  pointer-events: none;
}

::-webkit-scrollbar {
  border-radius: 0.3em;
  width: 0.6em;
  background-color: transparent;
  cursor: default;
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 2px rgba(0,0,0,0.3);
  border-radius: 0.3em;
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  border-radius: 0.3em;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #555;
  cursor: pointer;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #777;
}
::-webkit-scrollbar-thumb:active {
  background-color: #b70000;
}

/*.textarea {
  position: relative;
  min-width: 100px;
  margin: 0.3em 0;
  width: 100%;
  color: #405863;
  height: 3.25em;
}

label {
  position: absolute;
  top: 1em;
  left: 1em;
  opacity: 0.5;
  transition: transform 0.2s ease, opacity 0.2s ease, color 0.2s ease;
  will-change: transform, opacity, color;
  transform-origin: top left;
  pointer-events: none;
  user-select: none;
}

textarea {
  background: #e6e6e6;
  font-size: 1em;
  padding: 1.5em 1em 0.5em;
  width: 100%;
  transition: border-color 0.2s ease, opacity 0.2s ease;
  border: none;
  border-bottom: 0.1em solid #8ea3ac;
  border-radius: 0.2em;
  outline: none;
  box-sizing: border-box;
  opacity: 0.5;

  &:hover {
    opacity: 0.8;
  }
  &:focus {
    border-color: #397eff;
    opacity: 1;
  }
  &:focus + label,
  &:not(:placeholder-shown) + label {
    color: #397eff;
    transform: translateY(-60%) scale(0.9);
    opacity: 1;
  }

  // Add required sign to label
  &:required + label::after {
    content: '*';
  }
}*/
</style>

<script>
function uuid(prefix = '_uuid_') {
  let id;
  do {
    id = `${prefix}${Math.random().toString(36).substr(2)}`;
  } while (document.getElementById(id) != null);

  return id;
}

export default {
  name: 'AppTextarea',
  inheritAttrs: false,
  model: {
    event: 'input',
    prop: 'value',
  },
  props: {
    value: String,
    label: String,
  },

  data: () => ({ uuid: uuid('_ta_') }),
  computed: {
    listeners() {
      const { input, ...listeners } = this.$listeners;
      return listeners;
    },
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>
