<script setup>
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProfileStore } from '../../../application/profile.store.js';
import useIamStore from '../../../../iam/application/iam.store.js';

const route    = useRoute();
const router   = useRouter();
const store    = useProfileStore();
const iamStore = useIamStore();

const tabs = [
  { name: 'profile',             labelKey: 'profile.tabs.profile',      path: '/dashboard/profile' },
  { name: 'profile-preferences', labelKey: 'profile.tabs.preferences',  path: '/dashboard/profile/preferences' },
  { name: 'profile-security',    labelKey: 'profile.tabs.security',     path: '/dashboard/profile/security' },
];

const activeTab = computed(() => route.name);

onMounted(() => {
  const userId = iamStore.currentUserId || 2;
  const email  = iamStore.currentUserEmail || 'alex.sterling@vantagepmo.io';
  if (!store.user) store.fetchProfile(userId, email);
});

function goTab(tab) {
  router.push({ name: tab.name });
}
</script>

<template>
  <div class="profile-shell">
    <nav class="profile-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        class="profile-tab"
        :class="{ active: activeTab === tab.name }"
        @click="goTab(tab)"
      >
        {{ $t(tab.labelKey) }}
      </button>
    </nav>

    <router-view />
  </div>
</template>

<style scoped>
.profile-shell {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1200px;
}

.profile-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e2e8f0;
}

.profile-tab {
  background: none;
  border: none;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.15s, border-color 0.15s;
}

.profile-tab:hover { color: #1e293b; }

.profile-tab.active {
  color: #2563eb;
  font-weight: 600;
  border-bottom-color: #2563eb;
}
</style>
