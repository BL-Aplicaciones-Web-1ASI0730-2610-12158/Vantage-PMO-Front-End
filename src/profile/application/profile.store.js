import { defineStore } from 'pinia';
import { ref } from 'vue';
import { profileApi } from '../infrastructure/profile-api.js';

/**
 * Profile Application Store
 * Orchestrates profile use-cases using the infrastructure service.
 */
export const useProfileStore = defineStore('profile', () => {
    const user    = ref(null);
    const stats   = ref(null);
    const loading = ref(false);

    async function fetchProfile(userId = 1) {
        loading.value = true;
        try {
            [user.value, stats.value] = await Promise.all([
                profileApi.getById(userId),
                profileApi.getStatsByUserId(userId),
            ]);
        } finally {
            loading.value = false;
        }
    }

    return { user, stats, loading, fetchProfile };
});
