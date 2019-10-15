<template lang="pug">
article
  h1 Chatt

  template(v-if="!connected")
    .login
      form(@submit.prevent="join")
        app-textfield(v-model="alias", label="Användarnamn", maxlength="15", required)
        button.solid Skicka
        p(v-if="connectError") {{ connectError }}

  template(v-else)
    span Dubbelklicka på meddelanden för att spara dem

    .chat
      span.status(:class="disconnected ? 'disconnected' : 'connected'") {{ disconnected ? 'Frånkopplad' : 'Ansluten' }}
      ul.messages(ref="chat")
        template(v-for="m in messages")
          li.message(
            v-if="m.type == 'message'", :key="m.id", @dblclick="saveMessage(m)",
            :class="{ me: m.sender == alias, saved: m.saved }"
          )
            .header
              span.user(v-if="m.sender != alias") {{ m.sender }}
              span.timestamp {{ m.timestamp }}
            | {{ m.text }}
          li.notice(v-else, :key="m.id") {{ m.text }}

      p.typing(v-if="typing.length") {{ usersTyping }} is typing.
      textarea(:value="message", rows="2", placeholder="Message", @keydown="keyDown", @keyup="keyUp")
</template>

<style lang="scss" scoped>
.chat {
  position: relative;
  border: 1px solid #a9a9a9;
  box-sizing: border-box;
  overflow: hidden;
  background: #fff;
  padding-top: 1.5em;
  margin-top: 1em;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .status {
    position: absolute;
    top: 0.2em;
    right: 0.2em;
    font-size: 0.9em;
    box-sizing: border-box;

    &::after {
      content: '⬤';
      margin-left: 0.2em;
    }

    &.connected::after {
      color: #2ecc40;
    }
    &.disconnected::after {
      color: #ff695e;
    }
  }

  .typing {
    position: absolute;
    left: 0;
    bottom: 3.5em;
    padding: 0.2em;
    margin: 0;
    color: #a9a9a9;
    border: none;
    box-sizing: border-box;
    overflow: hidden;
  }

  .messages {
    display: flex;
    flex-direction: column;
    background: #fff;
    width: 100%;
    height: 25em;
    box-sizing: border-box;
    overflow: hidden auto;
    overflow-wrap: break-word;
    padding: 0 0.5em 1.3em;

    .message {
      position: relative;
      max-width: 400px;
      width: 50%;
      color: #000;
      background: #eee;
      padding: 1.5em 0.5em 0.5em;
      margin-bottom: 0.5em;
      clip-path: inset(0 round 1em);

      &.me {
        align-self: flex-end;
        color: #fff;
        background: #397eff;
      }

      &.saved {
        background: #4caf50;
      }

      .user {
        position: absolute;
        top: 0.5em;
        left: 0.5em;
        font-size: 0.9em;
      }
      .timestamp {
        position: absolute;
        top: 0.5em;
        right: 0.5em;
        font-size: 0.9em;
      }
    }

    .notice {
      color: #a9a9a9;
      margin-bottom: 0.5em;
    }
  }

  textarea {
    width: 100%;
    background: #fff;
    box-sizing: border-box;
    border: none;
    outline: none;
    border-top: 1px solid #a9a9a9;
    padding: 0.5em 0.2em;
    resize: none;
  }
}
</style>

<script>
import io from 'socket.io-client';
import AppTextfield from '~/components/Textfield.vue';

const API_URL = process.env.API_URL;

export default {
  name: 'Chat',
  components: { AppTextfield },

  data: () => ({
    alias: '',
    connectError: '',
    messages: [],
    typing: [],
    message: '',
    connected: false,
    disconnected: false,
    loadingMessages: false,
    stickyChat: true,
  }),
  computed: {
    usersTyping() {
      if (this.typing.length) {
        let res = this.typing.slice(0, 3).join(', ');

        if (this.typing.length < users.length) {
          res += `, ...and ${this.typing.length - users.length} more`;
        }

        return res;
      }
    },
  },

  // Live scroll like chats in discord, gitter, etc.
  beforeUpdate() {
    const { chat } = this.$refs;

    if (chat) {
      this.stickyChat = (chat.scrollTop + chat.clientHeight) >= chat.scrollHeight;
    }
  },
  async updated() {
    const { chat } = this.$refs;

    if (chat) {
      await this.$nextTick();

      if (this.stickyChat) {
        chat.scrollTop = chat.scrollHeight - chat.clientHeight;
      }
    }
  },
  beforeDestroy() {
    if (this.connected) {
      this.socket.disconnect();
    }
  },

  methods: {
    keyUp(e) {
      if (e.key == 'Enter') {
        if (this.message) {
          this.socket.emit('message', this.message);
          this.message = '';
        }
      }
    },
    keyDown(e) {
      this.socket.emit('typing');
      this.message = e.target.value;
    },

    join() {
      if (!this.alias) return;

      const socket = io(API_URL, { query: { alias: this.alias } });

      socket.on('error', ex => {
        this.socket = null;
        this.connectError = ex;
      });
      socket.on('disconnect', () => {
        this.disconnected = true;
      });
      socket.on('reconnect', () => {
        this.disconnected = false;
        this.typing = [];
      });

      socket.once('connect', () => {
        this.connected = true;
        this.disconnected = false;
        this.socket.emit('load_messages');

        socket.on('typing', this.userTyping);
        socket.on('typing_stop', this.userStopTyping);
        socket.on('join', this.userJoin);
        socket.on('leave', this.userLeave);
        socket.on('message', ({ id, sender, text, timestamp }) => {
          timestamp = this.parseTimestamp(timestamp);

          this.addMessage({ id, sender, text, timestamp, saved: false });
        });
        socket.on('saved_message', messageId => {
          const index = this.messages.findIndex(m => m.id == messageId);

          if (index == -1) {
            console.error('Message not saved, it wasn\'t found');
          } else {
            const message = this.messages[index];
            message.saved = true;

            this.$set(this.messages, `${index}`, message);
          }
        });
        socket.on('loaded_messages', messages => {
          const loaded = messages.filter(m => !this.messages.find(x => m.id == x.id));

          loaded.forEach(m => {
            m.timestamp = this.parseTimestamp(m.timestamp);
            m.saved = true;
            m.type = 'message';
          });
          this.messages = [ ...loaded, ...this.messages ];
        })
      });

      this.socket = socket;
    },

    userJoin(alias) {
      this.userStopTyping();
      this.addMessage({ message: `${alias} gick med i chatten.` }, 'notice');
    },
    userLeave(alias) {
      this.userStopTyping(alias);
      this.addMessage({ message: `${alias} lämnade chatten.` }, 'notice');
    },
    userTyping(alias) {
      if (!this.typing.includes(alias)) {
        this.typing.push(alias);
      }
    },
    userStopTyping(alias) {
      const index = this.typing.indexOf(alias);

      if (index != -1) {
        this.typing.splice(index, 1);
      }
    },

    addMessage(message, type='message') {
      message.type = type;
      this.messages.push(message);
    },
    saveMessage(message) {
      if (message.saved) return;

      this.socket.emit('save_message', message.id);
    },

    // Timestamp parsing
    padNumber(num, len) {
      return ('' + num).padStart(len, '0');
    },
    parseTimestamp(timestamp) {
      const dt = new Date(timestamp);
      const YYYY = this.padNumber(dt.getFullYear(), 4);
      const MM = this.padNumber(1 + dt.getMonth(), 2);
      const DD = this.padNumber(dt.getDate(), 2);
      const hh = this.padNumber(dt.getHours(), 2);
      const mm = this.padNumber(dt.getMinutes(), 2);
      const ss = this.padNumber(dt.getSeconds(), 2);

      return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
    }
  },
};
</script>
