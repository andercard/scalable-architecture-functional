<template>
  <div>
    <h1>Libros</h1>
    <ul>
      <li v-for="book in books" :key="book.id">
        <router-link :to="`/books/${book.id}`">{{ book.title }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Book {
  id: number
  title: string
}

const books = ref<Book[]>([
  { id: 1, title: 'El Principito' },
  { id: 2, title: 'Cien Años de Soledad' },
  { id: 3, title: 'Rayuela' },
])
</script> 