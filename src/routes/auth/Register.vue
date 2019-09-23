<template lang="pug">
article
  h1 Registrera konto
  p(v-if="error") Felmeddelande: {{ error }}

  form(@submit.prevent="register")
    .fields
      app-textfield(v-model="name", label="Namn", name="name", required)
      app-textfield(v-model="email", type="email", label="Email", name="email", required)
      app-datepicker(v-model="birthdate", label="Födelsedatum", name="birthdate", required)

    .fields
      app-textfield(
        v-model="password", type="password", name="password",
        label="Lösenord", :pattern="pattern", required
      )

      p Lösenordet måste vara minst 8 långt och innehålla:
      ul
        li En stor bokstav
        li En liten bokstav
        li En siffra
        li En utav följande {{ specialChars }}

    .fields
      label.checkbox
        input(type="checkbox", required)
        | Jag godkänner behandlingen av mina personuppgifter enligt GDPR
      button.register.solid(type="submit") Registrera
</template>

<style lang="scss" scoped>
article {
  max-width: 400px;
  margin: 0 auto 5em;
}

.checkbox > input {
  margin-right: 0.5em;
}

h1 {
  text-align: center;
  color: #333;
}

.fields {
  margin: 1em 0;
}

.register {
  margin-top: 2em;
  float: right;
}
</style>

<script>
import AppTextfield from '~/components/Textfield.vue';
import AppDatepicker from '~/components/Datepicker.vue';
const regexEscape = str => str.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const SPECIAL_CHARS = '&@!?%#-_';
const SPECIAL_ESC = regexEscape(SPECIAL_CHARS);

export default {
  name: 'AppRegister',
  components: { AppTextfield, AppDatepicker },
  data: () => ({
    email: '',
    password: '',
    name: '',
    birthdate: new Date(),
    specialChars: SPECIAL_CHARS,
    pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[${SPECIAL_ESC}])[A-Za-z0-9${SPECIAL_ESC}]{8,}$`,
    error: '',
  }),

  methods: {
    async register() {
      try {
        await this.$store.dispatch('register', {
          email: this.email,
          password: this.password,
          name: this.name,
          birthdate: this.birthdate,
        });
        this.$router.push({ name: 'home' });
      } catch (ex) {
        this.error = ex.message;
      }
    }
  }
};
</script>
