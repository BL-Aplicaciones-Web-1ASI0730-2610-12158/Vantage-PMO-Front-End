export const useSettingsStore = defineStore('settings', () => {
    const settings = ref(null);
    const loading = ref(false);
    const saving = ref(false);

    async function fetchSettings(orgId) {
        loading.value = true;
        try {
            settings.value = await settingsApi.getSettings(orgId);
        } finally {
            loading.value = false;
        }
    }

    async function saveSettings(updated) {
        if (settings.value?.orgPolicyLocked) return;
        saving.value = true;
        try {
            settings.value = await settingsApi.updateSettings(updated);
        } finally {
            saving.value = false;
        }
    }

    return { settings, loading, saving, fetchSettings, saveSettings };
});