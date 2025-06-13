<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Выбери тест</h2>
    <div v-for="test in tests" :key="test.id" class="p-4 border rounded mb-3">
      <h3 class="text-xl">{{ test.title }}</h3>
      <button class="btn mt-2" @click="startTest(test)">Начать</button>
    </div>

    <div v-if="currentTest" class="mt-6">
      <h2 class="text-xl mb-2">{{ currentTest.title }}</h2>
      <div v-for="(q, index) in currentTest.questions" :key="index">
        <p class="font-semibold">{{ index + 1 }}. {{ q.text }}</p>
        <div v-for="(opt, i) in q.options" :key="i">
          <label><input type="radio" :name="'q' + index" :value="i" v-model="answers[index]" /> {{ opt }}</label>
        </div>
      </div>
      <button @click="submitAnswers" class="btn mt-4">📩 Отправить</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { collection, getDocs, doc, addDoc } from 'firebase/firestore'
import { db, auth } from '../firebase/config'

const tests = ref([])
const currentTest = ref(null)
const answers = ref([])

const fetchTests = async () => {
  const snapshot = await getDocs(collection(db, 'tests'))
  tests.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
fetchTests()

const startTest = (test) => {
  currentTest.value = test
  answers.value = Array(test.questions.length).fill(null)
}

const submitAnswers = async () => {
  const correct = currentTest.value.questions.filter((q, i) => q.correctIndex == answers.value[i])
  const percent = Math.round((correct.length / currentTest.value.questions.length) * 100)
  const grade =
    percent >= 90 ? 'отлично' :
    percent >= 75 ? 'хорошо' :
    percent >= 60 ? 'удовлетворительно' : 'неудовлетворительно'

  await addDoc(collection(db, 'results'), {
    testId: currentTest.value.id,
    userId: auth.currentUser.uid,
    email: auth.currentUser.email,
    score: percent,
    grade,
    date: new Date().toISOString()
  })

  alert(`Ваш результат: ${percent}% (${grade})`)
  currentTest.value = null
}
</script>

<style scoped>
.btn {
  @apply bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700;
}
</style>
