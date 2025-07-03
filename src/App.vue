<template>
  <div id="app">
    <AppHeader />
    
    <main class="app-main">
      <router-view />
    </main>
    
    <footer class="app-footer">
      <div class="footer-container">
        <p>&copy; 2024 Anime Explorer. Desarrollado con Vue 3 y TypeScript.</p>
        <p>Datos proporcionados por <a href="https://jikan.moe" target="_blank" rel="noopener">Jikan API</a></p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@shared/layout/components/AppHeader/index.vue'
</script>

<style>
/* Reset y estilos globales */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #ffffff;
  background: #000000;
  min-height: 100vh;
  font-size: 14px;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Variables CSS para el tema Crunchyroll */
:root {
  --primary-color: #f47521;
  --primary-dark: #d65a1a;
  --primary-light: #ff8c42;
  --secondary-color: #ffffff;
  --accent-color: #f47521;
  --background-dark: #000000;
  --background-card: #1a1a1a;
  --background-light: #2a2a2a;
  --background-hover: #333333;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --text-muted: #999999;
  --border-color: #333333;
  --shadow-color: rgba(244, 117, 33, 0.1);
  --gradient-primary: linear-gradient(135deg, #f47521 0%, #ff8c42 100%);
  --gradient-secondary: linear-gradient(135deg, #f47521 0%, #d65a1a 100%);
  --max-width: 1200px;
  --header-height: 64px;
  --border-radius: 8px;
  --border-radius-large: 12px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
}

/* Contenido principal */
.app-main {
  flex: 1;
  min-height: calc(100vh - var(--header-height));
  background: var(--background-dark);
  padding: var(--spacing-lg) 0;
  max-width: var(--max-width);
  margin: 0 auto;
  width: 100%;
}

/* Footer */
.app-footer {
  background: var(--background-card);
  color: var(--text-secondary);
  padding: var(--spacing-xl) 0;
  margin-top: auto;
  border-top: 1px solid var(--border-color);
}

.footer-container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  text-align: center;
}

.footer-container p {
  margin-bottom: var(--spacing-sm);
  font-size: 13px;
}

.footer-container a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-container a:hover {
  color: var(--primary-light);
  text-decoration: underline;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--background-dark);
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-dark);
}

/* Responsive */
@media (max-width: 768px) {
  .footer-container {
    padding: 0 var(--spacing-md);
  }
  
  .app-main {
    padding: var(--spacing-md) 0;
  }
}
</style>
