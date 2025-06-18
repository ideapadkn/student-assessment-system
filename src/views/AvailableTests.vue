<script setup>
import { ref } from 'vue'
import { collection, getDocs, doc, addDoc } from 'firebase/firestore'
import { db, auth } from '../firebase/config'
import BackButton from '../components/ui/BackButton.vue'

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

<template>
  <div class="main-tests">
    <div class="main-tests_header">
      <h2 class="main-tests_title">Выбери тест</h2>
      <BackButton />
    </div>
    <div v-for="test in tests" :key="test.id" class="main-tests_test">
      <h3 class="text-xl">{{ test.title }}</h3>
      <button class="btn mt-2" @click="startTest(test)">Начать</button>
    </div>

    <div v-if="currentTest" class="main-tests_current">
      <h2 class="main-tests_current-title">{{ currentTest.title }}</h2>
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

<style lang="scss" scoped>
@import "../styles/_variable.scss";

.main-tests {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  color: $primary;
  background-color: $background;
  border-radius: $radius;
  height: 85vh;

  &_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  &_test {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    .btn {
      display: inline-block;
    }
  }
}
</style>
