<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './language-switcher.vue'
import AuthenticationSection from "../../../iam/presentation/components/authentication-section.vue";

const router = useRouter()
const route  = useRoute()
const { t }  = useI18n()

const navItems = [
  { labelKey: 'nav.home',           icon: 'pi pi-home',        name: 'home' },
  { labelKey: 'nav.activeProjects', icon: 'pi pi-folder-open', name: 'active-projects' },
  { labelKey: 'nav.team',           icon: 'pi pi-users',       name: 'team' },
  { labelKey: 'nav.chatHub',        icon: 'pi pi-comments',    name: 'chat-hub' },
  { labelKey: 'nav.schedule',       icon: 'pi pi-calendar',    name: 'schedule' },
  { labelKey: 'nav.meetings',       icon: 'pi pi-video',       name: 'meetings' },
  { labelKey: 'nav.reports',        icon: 'pi pi-chart-bar',   name: 'reports' },
  { labelKey: 'nav.systemAdministration', icon: 'pi pi-cog', name: 'system-administration' },
]

const bottomItems = [
  { labelKey: 'nav.support',  icon: 'pi pi-question-circle', name: 'support' },
  { labelKey: 'nav.settings', icon: 'pi pi-cog',             name: 'settings' },
]

function navigate(name) {
  if (name === 'home') {
    router.push({ path: '/dashboard' });
  } else {
    router.push({ name: name });
  }
}
function isActive(name)  { return route.name === name }
</script>

<template>
  <div class="app-shell">
    <!-- Sidebar -->
    <aside class="sidebar">
      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="logo-icon">
          <i class="pi pi-compass"></i>
        </div>
        <div class="logo-text">
          <span class="logo-title">{{ $t('app.title') }}</span>
          <span class="logo-subtitle">{{ $t('app.subtitle') }}</span>
        </div>
      </div>

      <!-- Create Project Button -->
      <div class="sidebar-create">
        <button class="create-btn" @click="navigate('home')">
          <i class="pi pi-plus"></i>
          <span>{{ $t('nav.createProject') }}</span>
        </button>
      </div>

      <!-- Main Navigation -->
      <nav class="sidebar-nav">
        <button
          v-for="item in navItems"
          :key="item.name"
          class="nav-item"
          :class="{ active: isActive(item.name) }"
          @click="navigate(item.name)"
        >
          <i :class="item.icon"></i>
          <span>{{ t(item.labelKey) }}</span>
        </button>
      </nav>

      <!-- Bottom Items -->
      <div class="sidebar-bottom">
        <button
          v-for="item in bottomItems"
          :key="item.name"
          class="nav-item"
          :class="{ active: isActive(item.name) }"
          @click="navigate(item.name)"
        >
          <i :class="item.icon"></i>
          <span>{{ t(item.labelKey) }}</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main-area">
      <!-- Top Bar -->
      <header class="topbar">
        <div class="topbar-search">
          <i class="pi pi-search search-icon"></i>
          <input type="text" :placeholder="$t('topbar.search')" class="search-input" />
        </div>
        <div class="topbar-actions">
          <button class="icon-btn"><i class="pi pi-bell"></i></button>
          <button class="icon-btn"><i class="pi pi-history"></i></button>
          <button class="icon-btn"><i class="pi pi-sliders-h"></i></button>
          <language-switcher />
          <button class="dashboard-btn">{{ $t('topbar.executiveDashboard') }} <i class="pi pi-chevron-down"></i></button>
          <button class="profile-btn" @click="navigate('profile')">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Profile" class="avatar" />
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
  background: #f5f6fa;
}

/* Sidebar */
.sidebar {
  width: 200px;
  min-width: 200px;
  background: #fff;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  gap: 0;
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
  color: #1e293b;
  line-height: 1.2;
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
  color: #64748b;
  font-weight: 500;
  width: 100%;
  text-align: left;
  transition: background 0.15s, color 0.15s;
}

.nav-item i {
  font-size: 15px;
}

.nav-item:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.nav-item.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.sidebar-bottom {
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-top: 1px solid #e9ecef;
  padding-top: 12px;
  margin-top: 8px;
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
  background: #fff;
  border-bottom: 1px solid #e9ecef;
  gap: 16px;
  min-height: 60px;
}

.topbar-search {
  flex: 1;
  max-width: 420px;
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
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: #475569;
  outline: none;
  background: #f8fafc;
}

.search-input:focus {
  border-color: #2563eb;
  background: white;
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
  color: #64748b;
  font-size: 16px;
  transition: background 0.15s;
}

.icon-btn:hover {
  background: #f1f5f9;
}

.dashboard-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  white-space: nowrap;
}

.dashboard-btn:hover {
  background: #f1f5f9;
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
  background: #dbeafe;
}

/* Content */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
}
</style>
