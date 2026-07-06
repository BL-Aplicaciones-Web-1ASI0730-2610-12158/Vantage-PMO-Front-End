import { defineStore } from 'pinia';
import { ref } from 'vue';
import { profileApi } from '../infrastructure/profile-api.js';
import useIamStore from '../../iam/application/iam.store.js';

/**
 * Profile Application Store
 * Orchestrates profile use-cases using the infrastructure service.
 */
export const useProfileStore = defineStore('profile', () => {
    const user    = ref(null);
    const stats   = ref(null);
    const loading = ref(false);

    async function fetchProfile(userId) {
        const iamStore = useIamStore();
        const resolvedUserId = userId ?? (iamStore.currentUserId > 0 ? iamStore.currentUserId : 1);
        loading.value = true;
        try {
            [user.value, stats.value] = await Promise.all([
                profileApi.getById(resolvedUserId),
                profileApi.getStatsByUserId(resolvedUserId),
            ]);
        } finally {
            loading.value = false;
        }
    }

    return { user, stats, loading, fetchProfile };
});
