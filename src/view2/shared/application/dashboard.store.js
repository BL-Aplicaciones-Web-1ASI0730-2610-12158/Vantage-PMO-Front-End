import { defineStore } from 'pinia';
import { ref } from 'vue';
import { dashboardApi } from '../infrastructure/dashboard-api.js';

/**
 * Dashboard Store (View 2)
 */
export const useDashboardStore = defineStore('dashboard', () => {
    const stats = ref(null);
    const loading = ref(false);

    async function fetchDashboard() {
        loading.value = true;
        try {
            stats.value = await dashboardApi.getStats();
        } finally {
            loading.value = false;
        }
    }

    return { stats, loading, fetchDashboard };
});