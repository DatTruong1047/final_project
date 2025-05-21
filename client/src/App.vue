<script setup lang="ts">
import { RouterView } from 'vue-router'
import ChatPageView from './views/chat/PageView.vue'
import NavBarComponent from './components/_utils/NavBarComponent.vue'
import ToastComponent from './components/molecules/_utils/ToastComponent.vue'
import { useChatStore } from './stores/chatStore'
import { computed } from 'vue'
import BotComponent from './components/chat/BotComponent.vue'
const chatStore = useChatStore()
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <NavBarComponent />
    <main class="pt-[6rem]">
      <template v-if="chatStore.isShowChat">
        <ChatPageView />
      </template>
      <template v-else>
        <BotComponent />
      </template>
      <RouterView />
    </main>
  </div>
  <ToastComponent />
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    font-size: 1rem;
    padding: 1rem 0;
  }
}
</style>
