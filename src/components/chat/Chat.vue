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

<template>
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
</template>

<style lang="scss" scoped>
@import '../../styles/_variable.scss';

.chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: $primary;
  background-color: $background;
  border-radius: $radius;
  height: 85vh;

  &-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 2rem;
  }

  &-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;

    .chat-body {
      overflow-y: auto;
      max-height: 70vh;
      padding: 1rem;
      border-radius: $radius;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .chat-form {
      display: flex;
      align-items: center;
      gap: 0 10px;
      margin-top: 1rem;
      width: 100%;
      justify-content: space-between;

      .chat-input {
        flex: 1;
      }
    }
  }
}
</style>
