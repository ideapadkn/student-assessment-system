<template>
  <button @click="$router.back()" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
    Назад
  </button>
</template>

<style scoped>
button {
  background-color: #e3342f;
  color: white;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #cc1f1a;
  }
}
</style>