<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const sidebarOpen = ref(false);

const navItems = [
  { name: 'home', label: 'Home', icon: 'pi pi-home' },
  { name: 'projects', label: 'Projects', icon: 'pi pi-folder' },
  { name: 'analysis', label: 'Analysis', icon: 'pi pi-chart-bar' }
];

function navigate(name) {
  router.push({ name });
  sidebarOpen.value = false;
}

function isActive(name) {
  return route.name === name;
}
</script>

<template>
  <div class="layout">

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <button
          v-for="item in navItems"
          :key="item.name"
          :class="{ active: isActive(item.name) }"
          @click="navigate(item.name)"
      >
        <i :class="item.icon"></i>
        {{ item.label }}
      </button>
    </aside>

    <!-- Main -->
    <div class="main">
      <header class="topbar">
        <button @click="sidebarOpen = !sidebarOpen">
          <i class="pi pi-bars"></i>
        </button>
      </header>

      <main class="content">
        <router-view />
      </main>
    </div>

  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 200px;
  background: #111827;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 8px;
}

.sidebar button {
  background: transparent;
  border: none;
  color: white;
  padding: 10px;
  text-align: left;
  cursor: pointer;
}

.sidebar button.active {
  background: #2563eb;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid #e5e7eb;
}

.content {
  flex: 1;
  padding: 20px;
}
</style>