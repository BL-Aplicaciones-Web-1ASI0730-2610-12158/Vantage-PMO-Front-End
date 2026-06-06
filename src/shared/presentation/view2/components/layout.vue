<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const route = useRoute()

const sidebarOpen = ref(false)

const navItems = [
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    name: 'home'
  },
  {
    label: 'Projects',
    icon: 'pi pi-briefcase',
    name: 'projects'
  },
  {
    label: 'Resource Planning',
    icon: 'pi pi-users',
    name: 'resource-planning'
  },
  {
    label: 'Risk & Compliance',
    icon: 'pi pi-shield',
    name: 'risk-compliance'
  },
  {
    label: 'Analytics',
    icon: 'pi pi-chart-line',
    name: 'analytics'
  },
  {
    label: 'Admin',
    icon: 'pi pi-cog',
    name: 'admin'
  }
]

function navigate(name){
  router.push({ name })
  sidebarOpen.value = false
}

function isActive(name){
  return route.name === name
}
</script>

<template>
  <div class="app-shell">

    <div
        class="sidebar-overlay"
        :class="{ active: sidebarOpen }"
        @click="sidebarOpen=false">
    </div>

    <aside
        class="sidebar"
        :class="{ open: sidebarOpen }">

      <button
          class="sidebar-close"
          @click="sidebarOpen=false">
        <i class="pi pi-times"></i>
      </button>

      <div class="sidebar-logo">
        <div class="logo-icon">
          <i class="pi pi-chart-line"></i>
        </div>

        <div class="logo-text">
          <span class="logo-title">
            Vantage PMO
          </span>

          <span class="logo-subtitle">
            Enterprise Suite
          </span>
        </div>
      </div>

      <button class="create-btn">
        <i class="pi pi-plus-circle"></i>
        New Project
      </button>

      <nav class="sidebar-nav">
        <button
            v-for="item in navItems"
            :key="item.name"
            class="nav-item"
            :class="{active:isActive(item.name)}"
            @click="navigate(item.name)">

          <i :class="item.icon"></i>

          <span>{{ item.label }}</span>
        </button>
      </nav>

    </aside>

    <div class="main-area">

      <header class="topbar">

        <button
            class="hamburger"
            @click="sidebarOpen=!sidebarOpen">

          <i class="pi pi-bars"></i>
        </button>

        <div class="topbar-left">
          <h2>Portfolio Master</h2>
        </div>

        <div class="topbar-search">
          <i class="pi pi-search"></i>

          <input
              type="text"
              placeholder="Search projects..." />
        </div>

        <div class="topbar-actions">
          <button class="icon-btn">
            <i class="pi pi-bell"></i>
          </button>

          <button class="icon-btn">
            <i class="pi pi-question-circle"></i>
          </button>

          <img
              class="avatar"
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Manager"
              alt="avatar">
        </div>

      </header>

      <main class="content">
        <router-view/>
      </main>

    </div>
  </div>
</template>

<style scoped>

</style>