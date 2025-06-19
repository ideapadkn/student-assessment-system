<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { marked } from 'marked'
import { sendToGemini } from '@/services/geminiApi'
import { listenToChat, sendMessageToFirestore } from '@/services/chatService'
import { auth } from '@/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import BackButton from '../ui/BackButton.vue'

const messages = ref([])
const userInput = ref('')
const loading = ref(false)
const chatContainer = ref(null)
const user = ref(null)

// Markdown render
function renderMarkdown(text) {
  return marked.parse(text || '')
}

// Подключение к Firestore истории чата
function connectChatListener() {
  if (!user.value) return
  listenToChat(user.value.uid, (msgs) => {
    messages.value = msgs
  })
}

onMounted(() => {
  onAuthStateChanged(auth, (u) => {
    user.value = u
    if (user.value) connectChatListener()
  })
})

// Скролл вниз после появления новых сообщений
watch(messages, async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
})

// Отправка сообщений и получение ответа Gemini
async function sendMessage() {
  if (!userInput.value.trim() || !user.value) return
  const text = userInput.value
  userInput.value = ''
  loading.value = true
  await sendMessageToFirestore(user.value.uid, { role: 'user', text, createdAt: new Date() })

  // Ответ ИИ
  const response = await sendToGemini(text)
  await sendMessageToFirestore(user.value.uid, { role: 'ai', text: response, createdAt: new Date() })

  loading.value = false
}
</script>

<!-- <template>
  <div class="chat">
    <div class="chat-header">
      <h1 class="text-2xl font-bold mb-4">Чат с ИИ</h1>
      <BackButton />
    </div>
    <div class="chat-wrapper">
      <div class="chat-body" ref="chatContainer">
        <div v-for="msg in messages" :key="msg.id" :class="['chat-msg', msg.role]">
          <div class="chat-bubble" v-html="renderMarkdown(msg.text)"></div>
        </div>
      </div>
      <form @submit.prevent="sendMessage" class="chat-form">
        <input v-model="userInput" class="chat-input" type="text" placeholder="Введите вопрос..." :disabled="loading"
          @keydown.enter="sendMessage" />
        <button type="submit" class="chat-btn" :disabled="loading || !userInput.trim()">{{ loading ? '...' : 'Отправить'
        }}</button>
      </form>
    </div>
  </div>
</template> -->

<template>
  <div class="chat">
    <div class="chat-header">
      <h1 class="text-2xl font-bold mb-4">Чат с ИИ</h1>
      <BackButton />
    </div>
    <div class="chat-window">
      <div class="chat-body" ref="chatContainer">
        <div v-for="msg in messages" :key="msg.id" :class="['chat-msg', msg.role]">
          <div class="chat-bubble" v-html="renderMarkdown(msg.text)"></div>
        </div>
      </div>
      <form @submit.prevent="sendMessage" class="chat-form">
        <input v-model="userInput" class="chat-input" type="text" placeholder="Введите вопрос..." :disabled="loading"
          @keydown.enter="sendMessage" />
        <button type="submit" class="chat-btn" :disabled="loading || !userInput.trim()">
          {{ loading ? '...' : 'Отправить' }}
        </button>
      </form>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@import '../../styles/variable';

.chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: $primary;
  background-color: $background;
  border-radius: $radius;
  height: 95vh;
  box-sizing: border-box;

  .chat-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 2rem;
  }

  // Белое "окно" чата
  .chat-window {
    background: #fff;
    border-radius: $radius;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 900px;
    height: 65vh;
    position: relative;
    overflow: hidden; // чтобы не было левых скроллов
  }

  .chat-body {
    flex: 1 1 auto;
    overflow-y: auto;
    overflow-x: hidden; // горизонтальный скролл уберёт!
    padding: 1.5rem 1rem 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    width: 100%; // важно!
    min-height: 0;
  }

  .chat-form {
    display: flex;
    align-items: center; // выравнивает по центру!
    gap: 10px;
    padding: 1rem;
    background: #fff;
    border-top: 1px solid #f1f1f1;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;

    .chat-input {
      flex: 1 1 auto;
      border-radius: $radius;
      border: 1px solid #e1e1e1;
      font-size: 1rem;
      outline: none;
      transition: border 0.2s;

      &:focus {
        border-color: $primary;
      }
    }

    .chat-btn {
      background: $primary;
      color: #fff;
      border: none;
      padding: 0 1.6rem;
      border-radius: $radius;
      font-weight: 600;
      font-size: 1rem;
      height: 44px; // совпадает с input!
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: darken($primary, 10%);
      }

      &:disabled {
        opacity: 0.7;
        cursor: default;
      }
    }
  }


  .chat-msg {
    display: flex;
    flex-direction: column;

    &.user .chat-bubble {
      align-self: flex-end;
      background: #e3f0ff;
      color: $primary;
    }

    &.ai .chat-bubble {
      align-self: flex-start;
      background: #f3f3f7;
      color: #333;
    }
  }

  .chat-bubble {
    max-width: 70%;
    padding: 0.7rem 1rem;
    border-radius: 1.4rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-bottom: 0.1rem;
    word-break: break-word;
    font-size: 1.08rem;
    line-height: 1.5;
  }
}
</style>
