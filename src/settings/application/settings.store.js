import { defineStore } from 'pinia';
import { ref } from 'vue';
import { settingsApi } from '../infrastructure/settings-api.js';

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref(null);
    const loading = ref(false);
    const saving = ref(false);

    async function fetchSettings() {
        loading.value = true;
        try {
            settings.value = await settingsApi.getSettings();
        } finally {
            loading.value = false;
        }
    }

    async function saveSettings(updated) {
        saving.value = true;
        try {
            settings.value = await settingsApi.updateSettings(updated);
        } finally {
            saving.value = false;
        }
    }

    return { settings, loading, saving, fetchSettings, saveSettings };
});
