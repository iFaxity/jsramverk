<template lang="pug">
article
  h1 Chatt

  .login(v-if="!connected")
    form(@submit.prevent="join")
      app-textfield(v-model="user", label="Användarnamn", maxlength="15", required)
      button.solid Skicka
      p(v-if="connectError") {{ connectError }}

  .chat(v-else)
    span.status(:class="disconnected ? 'disconnected' : 'connected'") {{ disconnected ? 'Frånkopplad' : 'Ansluten' }}
    ul.messages(ref="chat")
      template(v-for="m in messages")
        li.message(v-if="m.type == 'message'", :key="m.key", :class="{ me: m.user == user }")
          .header
            span.user(v-if="m.user != user") {{ m.user }}
            span.timestamp {{ m.timestamp }}
          | {{ m.message }}
        li.notice(v-else, :key="m.key") {{ m.message }}

    p.typing(v-if="typing.length") {{ usersTyping }}
    textarea(:value="message", @keydown="keyDown", @keyup="keyUp", rows="2", placeholder="Message")
</template>

<style lang="scss" scoped>
.chat {
  position: relative;
  border: 1px solid #a9a9a9;
  box-sizing: border-box;
  overflow: hidden;
  background: #fff;
  padding-top: 1.5em;

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

const MESSAGES_MAX_STACK = 500;
const CHAT_URL = process.env.CHAT_URL;

export default {
  name: 'Chat',
  components: { AppTextfield },

  data: () => ({
    messages: [],
    typing: [],
    user: '',
    connected: false,
    disconnected: false,
    key: 1,
    connectError: '',
    message: '',
    stickyChat: true,
  }),
  computed: {
    usersTyping() {
      if (this.typing.length) {
        const users = this.typing.slice(0, 5).join(', ');
        return `${users} is typing`;
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
  destroyed() {
    if (this.connected) {
      this.socket.disconnect();
    }
  },

  methods: {
    keyUp(e) {
      if (!e.shiftKey && e.key == 'Enter') {
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
      if (!this.user) return;

      const query = { user: this.user };
      const socket = io(CHAT_URL, { query });

      socket.on('error', ex => {
        this.socket = null;
        this.connectError = ex;
      });

      socket.once('connect', () => {
        this.connected = true;
        this.disconnected = false;

        socket.on('message', ({ user, timestamp, message }) => {
          this.addMessage({
            user, message,
            timestamp: this.parseTimestamp(timestamp),
          });
        });
        socket.on('typing', this.userTyping);
        socket.on('typing_stop', this.userStopTyping);
        socket.on('join', this.userJoin);
        socket.on('leave', this.userLeave);

        // If server disconnects notify user
        socket.on('disconnect', () => {
          this.disconnected = true;
        });

        // Server reconnect, notify user
        socket.on('reconnect', () => {
          this.disconnected = false;
          this.typing = [];
        });
      });

      this.socket = socket;
    },

    userJoin(user) {
      this.userStopTyping();
      this.addMessage({ message: `${user} gick med i chatten.` }, 'notice');
    },
    userLeave(user) {
      this.userStopTyping(user);
      this.addMessage({ message: `${user} lämnade chatten.` }, 'notice');
    },
    userTyping(user) {
      if (!this.typing.includes(user)) {
        this.typing.push(user);
      }
    },
    userStopTyping(user) {
      const index = this.typing.indexOf(user);

      if (index != -1) {
        this.typing.splice(index, 1);
      }
    },

    addMessage(message, type='message') {
      if (this.messages.length == MESSAGES_MAX_STACK) {
        this.messages.shift();
      }

      message.key = this.key++;
      message.type = type;
      this.messages.push(message);
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
