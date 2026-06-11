<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'

const router = useRouter()
const route  = useRoute()
const { t }  = useI18n()
const sidebarOpen = ref(false)

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

// Lógica dinámica: Si es view2, agregamos las opciones extras
const filteredNavItems = computed(() => {
  const items = [...navItems];
  const viewType = localStorage.getItem('viewType');

  if (viewType === 'view2') {
    items.push(
        { labelKey: 'nav.analytics',       icon: 'pi pi-chart-line',  name: 'analytics' },
        { labelKey: 'nav.resourcePlanning', icon: 'pi pi-briefcase',  name: 'resource-planning' }
    );
  }
  return items;
});

const bottomItems = [
  { labelKey: 'nav.profile',  icon: 'pi pi-user',            name: 'profile' },
  { labelKey: 'nav.settings', icon: 'pi pi-cog',             name: 'settings' },
  { labelKey: 'nav.support',  icon: 'pi pi-question-circle', name: 'support' },
]

function navigate(name) {
  if (name === 'home') {
    const viewType = localStorage.getItem('viewType');
    router.push({ name: viewType === 'view2' ? 'home-view2' : 'home' });
  } else {
    router.push({ name: name });
  }
  sidebarOpen.value = false;
}

function isActive(name) {
  if (name === 'profile') return route.path.startsWith('/dashboard/profile');
  return route.name === name;
}
</script>

<template>
  <div class="app-shell">
    <div class="sidebar-overlay" :class="{ active: sidebarOpen }" @click="sidebarOpen = false"></div>

    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-logo">
        <div class="logo-icon"><i class="pi pi-compass"></i></div>
        <div class="logo-text">
          <span class="logo-title">{{ $t('app.title') }}</span>
          <span class="logo-subtitle">{{ $t('app.subtitle') }}</span>
        </div>
      </div>

      <div class="sidebar-create">
        <button class="create-btn" @click="navigate('active-projects')">
          <i class="pi pi-plus"></i>
          <span>{{ $t('nav.createProject') }}</span>
        </button>
      </div>

      <nav class="sidebar-nav">
        <button
            v-for="item in filteredNavItems"
            :key="item.name"
            class="nav-item"
            :class="{ active: isActive(item.name) }"
            @click="navigate(item.name)"
        >
          <i :class="item.icon"></i>
          <span>{{ t(item.labelKey) }}</span>
        </button>
      </nav>

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

    <div class="main-area">
      <header class="topbar">
        <button class="hamburger" @click="sidebarOpen = !sidebarOpen"><i class="pi pi-bars"></i></button>
        <div class="topbar-search"><i class="pi pi-search search-icon"></i><input type="text" :placeholder="$t('topbar.search')" class="search-input" /></div>
        <div class="topbar-actions">
          <button class="profile-btn" @click="navigate('profile')"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Profile" class="avatar" /></button>
        </div>
      </header>
      <main class="content"><router-view /></main>
    </div>
  </div>
</template>