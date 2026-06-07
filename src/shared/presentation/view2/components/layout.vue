<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const route = useRoute()

const sidebarOpen = ref(false)

const navItems = [
  { label: 'topbar.dashboard',       fallback: 'Dashboard',           icon: 'pi pi-home',        name: 'portfolio-home' },
  { label: 'topbar.projects',        fallback: 'Projects',            icon: 'pi pi-briefcase',   name: 'projects' },
  { label: 'topbar.resourcePlanning',fallback: 'Resource Planning',   icon: 'pi pi-users',       name: 'resource-planning' },
  { label: 'topbar.riskCompliance',  fallback: 'Risk & Compliance',   icon: 'pi pi-shield',      name: 'risk-compliance' },
  { label: 'topbar.analytics',       fallback: 'Analytics',           icon: 'pi pi-chart-line',  name: 'analytics' },
  { label: 'topbar.admin',           fallback: 'Admin',               icon: 'pi pi-cog',         name: 'admin' }
]

function navigate(name){
  if (name === 'portfolio-home') {
    router.push({ path: '/portfolio' });
  } else {
    router.push({ name: name });
  }
  sidebarOpen.value = false
}

function isActive(name){
  return route.name === name
}
</script>

<template>
  <div class="app-shell">
    <!-- Mobile overlay -->
    <div class="sidebar-overlay" :class="{ active: sidebarOpen }" @click="sidebarOpen = false"></div>

    <!-- Sidebar Principal -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <!-- Close btn (mobile) -->
      <button class="sidebar-close" @click="sidebarOpen = false">
        <i class="pi pi-times"></i>
      </button>


      <div class="sidebar-logo">
        <div class="logo-icon"><i class="pi pi-chart-line"></i></div>
        <div class="logo-text">
          <span class="logo-title">Vantage PMO</span>
          <span class="logo-subtitle">Enterprise Suite</span>
        </div>
      </div>

      <!-- Create Project Button -->
      <div class="sidebar-create">
        <button class="create-btn" @click="navigate('projects')">
          <i class="pi pi-plus-circle"></i>
          <span>{{ $t('topbar.newProject') || 'New Project' }}</span>
        </button>
      </div>

      <!-- Main Navigation -->
      <nav class="sidebar-nav">
        <button
            v-for="item in navItems"
            :key="item.name"
            class="nav-item"
            :class="{ active: isActive(item.name) }"
            @click="navigate(item.name)">
          <i :class="item.icon"></i>
          <span>{{ $te(item.label) ? $t(item.label) : item.fallback }}</span>
        </button>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="main-area">
      <!-- Top Bar -->
      <header class="topbar">
        <!-- Hamburger (mobile only) -->
        <button class="hamburger" @click="sidebarOpen = !sidebarOpen">
          <i class="pi pi-bars"></i>
        </button>

        <div class="topbar-left">
          <h2>{{ $t('portfolio.portfolioMaster') || 'Portfolio Master' }}</h2>
        </div>

        <div class="topbar-search">
          <i class="pi pi-search search-icon"></i>
          <input
              type="text"
              :placeholder="$t('topbar.searchPlaceholder') || 'Search projects...'"
              class="search-input" />
        </div>

        <div class="topbar-actions">
          <button class="icon-btn"><i class="pi pi-bell"></i></button>
          <button class="icon-btn hide-sm"><i class="pi pi-question-circle"></i></button>
          <button class="profile-btn">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Manager" alt="Profile" class="avatar" />
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; }

.app-shell {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  background: var(--bg-shell);
  transition: background .3s;
}

/* Sidebar  */
.sidebar {
  width: 200px;
  min-width: 200px;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  gap: 0;
  transition: background .3s, border-color .3s;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 18px 24px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: #2563eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-weight: 700;
  font-size: 14px;
  color: var(--logo-title);
  line-height: 1.2;
  transition: color .3s;
}

.logo-subtitle {
  font-size: 9px;
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.sidebar-create {
  padding: 0 14px 20px;
}

.create-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.create-btn:hover {
  background: #1d4ed8;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
  width: 100%;
  text-align: left;
  transition: background .15s, color .15s;
}

.nav-item i {
  font-size: 15px;
}

.nav-item:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--active-bg);
  color: var(--active-color);
  font-weight: 600;
}

/* Main area */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Topbar */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: var(--bg-topbar);
  border-bottom: 1px solid var(--border-color);
  gap: 16px;
  min-height: 60px;
  transition: background .3s, border-color .3s;
}

.topbar-left h2 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
}

.topbar-search {
  flex: 1;
  max-width: 320px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #94a3b8;
  font-size: 14px;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid var(--input-border);
  border-radius: 8px;
  font-size: 13px;
  color: var(--search-color);
  outline: none;
  background: var(--input-bg);
  transition: background .3s, border-color .15s, color .3s;
}

.search-input:focus {
  border-color: #2563eb;
  background: var(--bg-card);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--btn-icon-color);
  font-size: 16px;
  transition: background .15s;
}

.icon-btn:hover {
  background: var(--hover-bg);
}

.profile-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  border-radius: 50%;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  object-fit: cover;
  background: #ffedd5;
}

/* Content */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
  background: var(--bg-content);
  transition: background .3s;
}

/* ── RESPONSIVE COMPATIBLE CON VIEW 1 ── */
.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: var(--text-primary);
  padding: 4px 8px;
  border-radius: 6px;
}
.hamburger:hover { background: var(--hover-bg); }

.sidebar-close {
  display: none;
  position: absolute;
  top: 14px;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: var(--text-secondary);
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 99;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s;
}

@media (max-width: 768px) {
  .hamburger { display: flex; align-items: center; }
  .sidebar-close { display: block; }

  .sidebar-overlay { display: block; }
  .sidebar-overlay.active {
    opacity: 1;
    pointer-events: all;
  }

  .sidebar {
    position: fixed;
    left: -220px;
    top: 0;
    height: 100vh;
    z-index: 100;
    transition: left 0.25s ease;
    box-shadow: 4px 0 20px rgba(0,0,0,0.15);
  }
  .sidebar.open { left: 0; }

  .app-shell, .main-area {
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }

  .content {
    flex: none;
    height: auto;
    overflow-y: visible;
    padding: 16px;
  }

  .topbar {
    position: sticky;
    top: 0;
    z-index: 50;
    padding: 10px 14px;
    gap: 10px;
  }

  .topbar-search {
    display: none;
  }

  .hide-sm { display: none !important; }
}
</style>