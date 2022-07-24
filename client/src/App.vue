<script setup>
import { io } from 'socket.io-client';
import { onBeforeMount, ref } from 'vue';

const socket = io('http://localhost:3001');
const messages = ref([]);
const messageText = ref('');
const joined = ref(false);
const name = ref('');
const typingDisablay = ref('');

onBeforeMount(() => {
  socket.emit('findAllMessages', {}, (response) => {
    messages.value = response;
  });

  socket.on('message', (message) => {
    messages.value.push(message);
  });

  socket.on('typing', ({name, isTyping}) => {
    if(isTyping) {
      typingDisablay.value = name + ' is typing...';
    } else {
      typingDisablay.value = '';
    }
  });
});

const join = () => {
  socket.emit('join', { name: name.value }, () => {
    joined.value = true;
  });
};

const sendMessage = () => {
  socket.emit('createMessage', { message: messageText.value }, (response) => {
    messageText.value = '';
  });
};

let timeout;
const emitTyping = () => {
  socket.emit('typing', { isTyping: true });

  timeout = setTimeout(() => {
    socket.emit('typing', { isTyping: false });
  }, 2000);
};
</script>

<template>
  <div class="chat">
    <div v-if="!joined">
      <form @submit.prevent="join">
        <label> What's your name?</label>
        <input v-model="name" type="text" placeholder="Enter your name" />
        <button type="submit">Join</button>
      </form>
    </div>

    <div v-else class="chat-container">
      <div class="message-container">
        <div v-for="message in messages" :key="message.name">
          [{{ message.name }}]: {{ message.message }}
        </div>
      </div>

      <div v-if="typingDisablay" class="typing-message">
        {{ typingDisablay }}
      </div>

      <div class="message-input">
        <form @submit.prevent="sendMessage">
          <label>Message:</label>
          <input type="text" v-model="messageText" @input="emitTyping" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
