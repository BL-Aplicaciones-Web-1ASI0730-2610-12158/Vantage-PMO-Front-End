<script setup>
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '../../application/settings.store.js';

const { t } = useI18n();
const store = useSettingsStore();

const form = ref(null);

onMounted(async () => {
    await store.fetchSettings();
    if (store.settings) {
        form.value = { ...store.settings };
    }
});

watch(() => store.settings, (val) => {
    if (val && !form.value) form.value = { ...val };
});

const themeOptions = ['light', 'dark', 'system'];
const languageOptions = ['en', 'es'];
const timezoneOptions = ['America/New_York', 'America/Los_Angeles', 'Europe/Madrid', 'UTC'];
const dateFormatOptions = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];
const visibilityOptions = ['team', 'public', 'private'];

async function save() {
    await store.saveSettings(form.value);
}
</script>

<template>
  <div class="settings-page">
    <div class="settings-header">
      <h1 class="settings-title">{{ t('settings.title') }}</h1>
      <p class="settings-subtitle">{{ t('settings.subtitle') }}</p>
    </div>

    <div v-if="store.loading" class="loading-state">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem;" />
    </div>

    <div v-else-if="form" class="settings-body">

      <!-- Appearance -->
      <pv-card class="settings-section">
        <template #title>{{ t('settings.appearance') }}</template>
        <template #content>
          <div class="settings-row">
            <div class="settings-field">
              <label>{{ t('settings.theme') }}</label>
              <pv-select v-model="form.theme" :options="themeOptions" class="w-full" />
            </div>
            <div class="settings-field">
              <label>{{ t('settings.language') }}</label>
              <pv-select v-model="form.language" :options="languageOptions" class="w-full" />
            </div>
          </div>
        </template>
      </pv-card>

      <!-- Regional -->
      <pv-card class="settings-section">
        <template #title>{{ t('settings.regional') }}</template>
        <template #content>
          <div class="settings-row">
            <div class="settings-field">
              <label>{{ t('settings.timezone') }}</label>
              <pv-select v-model="form.timezone" :options="timezoneOptions" class="w-full" />
            </div>
            <div class="settings-field">
              <label>{{ t('settings.dateFormat') }}</label>
              <pv-select v-model="form.dateFormat" :options="dateFormatOptions" class="w-full" />
            </div>
          </div>
        </template>
      </pv-card>

      <!-- Notifications -->
      <pv-card class="settings-section">
        <template #title>{{ t('settings.notifications') }}</template>
        <template #content>
          <div class="toggle-row">
            <div class="toggle-item">
              <span>{{ t('settings.emailNotifications') }}</span>
              <pv-checkbox v-model="form.emailNotifications" :binary="true" />
            </div>
            <div class="toggle-item">
              <span>{{ t('settings.pushNotifications') }}</span>
              <pv-checkbox v-model="form.pushNotifications" :binary="true" />
            </div>
            <div class="toggle-item">
              <span>{{ t('settings.weeklyDigest') }}</span>
              <pv-checkbox v-model="form.weeklyDigest" :binary="true" />
            </div>
          </div>
        </template>
      </pv-card>

      <!-- Security -->
      <pv-card class="settings-section">
        <template #title>{{ t('settings.security') }}</template>
        <template #content>
          <div class="toggle-row">
            <div class="toggle-item">
              <span>{{ t('settings.twoFactor') }}</span>
              <pv-checkbox v-model="form.twoFactorEnabled" :binary="true" />
            </div>
          </div>
          <div class="settings-row" style="margin-top: 1rem;">
            <div class="settings-field">
              <label>{{ t('settings.profileVisibility') }}</label>
              <pv-select v-model="form.profileVisibility" :options="visibilityOptions" class="w-full" />
            </div>
          </div>
        </template>
      </pv-card>

      <div class="settings-actions">
        <pv-button
            :label="t('settings.save')"
            icon="pi pi-check"
            :loading="store.saving"
            @click="save"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page { padding: 2rem; max-width: 900px; }
.settings-header { margin-bottom: 2rem; }
.settings-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--p-primary-color, #3b82f6);
  margin: 0 0 0.5rem;
}
.settings-subtitle { color: #6b7280; margin: 0; }
.loading-state { display: flex; justify-content: center; padding: 3rem; }
.settings-body { display: flex; flex-direction: column; gap: 1.5rem; }
.settings-section { border-radius: 12px; }
.settings-row { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.settings-field { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 0.5rem; }
.settings-field label { font-weight: 600; color: #374151; }
.toggle-row { display: flex; flex-direction: column; gap: 1rem; }
.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}
.toggle-item:last-child { border-bottom: none; }
.settings-actions { display: flex; justify-content: flex-end; }
</style>
