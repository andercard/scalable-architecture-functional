<template>
  <div>
    <h1>Detalle del Libro</h1>
    <div v-if="book">
      <h2>{{ book.title }}</h2>
      <p>ID: {{ book.id }}</p>
      <router-link to="/books">Volver a la lista</router-link>
    </div>
    <div v-else>
      <p>Libro no encontrado.</p>
      <router-link to="/books">Volver a la lista</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const books = [
  { id: 1, title: 'El Principito' },
  { id: 2, title: 'Cien Años de Soledad' },
  { id: 3, title: 'Rayuela' },
]

const book = computed(() => books.find(b => b.id === Number(route.params.id)))
</script> 