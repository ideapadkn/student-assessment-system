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
  <div class="chat-header">
    <h1 class="text-2xl font-bold mb-4">Чат с ИИ</h1>
    <BackButton />
  </div>
  <div class="chat-wrapper">
    <div class="chat-body" ref="chatContainer">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['chat-msg', msg.role]"
      >
        <div class="chat-bubble" v-html="renderMarkdown(msg.text)"></div>
      </div>
    </div>
    <form @submit.prevent="sendMessage" class="chat-form">
      <input
        v-model="userInput"
        class="chat-input"
        type="text"
        placeholder="Введите вопрос..."
        :disabled="loading"
        @keydown.enter="sendMessage"
      />
      <button
        type="submit"
        class="chat-btn"
        :disabled="loading || !userInput.trim()"
      >{{ loading ? '...' : 'Отправить' }}</button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
$chat-bg: #202126;
$user-bubble: #2263c4;
$ai-bubble: #26272d;
$ai-border: #444857;
$input-bg: #232323;
$input-border: #444857;
$text: #ececec;
$gray: #9fa1a7;

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.chat-wrapper {
  max-width: 700px;
  margin: 0 auto;
  background: $chat-bg;
  border-radius: 20px;
  box-shadow: 0 4px 32px 0 #00000010;
  display: flex;
  flex-direction: column;
  padding: 24px 20px 18px 20px;
  min-height: 480px;
  height: 75vh;
  border: 1px solid $ai-border;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 4px 0 0;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  scrollbar-width: thin;
  scrollbar-color: $gray $chat-bg;
}

.chat-body::-webkit-scrollbar {
  width: 7px;
  background: $chat-bg;
}
.chat-body::-webkit-scrollbar-thumb {
  background: $gray;
  border-radius: 6px;
}
.chat-body::-webkit-scrollbar-thumb:hover {
  background: lighten($gray, 12%);
}

.chat-msg {
  display: flex;
  &.user {
    justify-content: flex-end;
    .chat-bubble {
      background: $user-bubble;
      color: #fff;
      border-bottom-right-radius: 5px !important;
      border-top-right-radius: 20px;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      margin-left: 60px;
    }
  }
  &.ai {
    justify-content: flex-start;
    .chat-bubble {
      background: $ai-bubble;
      color: $text;
      border: 1px solid $ai-border;
      border-bottom-left-radius: 5px !important;
      border-top-right-radius: 20px;
      border-top-left-radius: 20px;
      border-bottom-right-radius: 20px;
      margin-right: 60px;
    }
  }
}

.chat-bubble {
  max-width: 95%;
  padding: 14px 18px;
  font-size: 1.12rem;
  line-height: 1.6;
  box-shadow: 0 2px 14px 0 #00000009;
  word-break: break-word;
  transition: background 0.25s;
  border-radius: 20px;
  font-family: inherit;

  // Markdown styles
  ul { list-style: disc; margin-left: 1.5em; }
  ol { list-style: decimal; margin-left: 1.5em; }
  strong { font-weight: bold; }
  em { font-style: italic; }
  p { margin: 0.4em 0; }
  code {
    background: #25262e;
    color: #ffd977;
    border-radius: 6px;
    padding: 2px 5px;
    font-size: 94%;
  }
}

.chat-form {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.chat-input {
  flex: 1;
  padding: 10px 14px;
  background: $input-bg;
  border: 1.5px solid $input-border;
  border-radius: 14px;
  color: #f5f5f5;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border: 1.5px solid $user-bubble;
  }
}

.chat-btn {
  padding: 0 26px;
  background: $user-bubble;
  border: none;
  color: #fff;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1.07rem;
  transition: background 0.22s, color 0.15s;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: darken($user-bubble, 10%);
  }
  &:disabled {
    opacity: 0.66;
    cursor: not-allowed;
  }
}
</style>
