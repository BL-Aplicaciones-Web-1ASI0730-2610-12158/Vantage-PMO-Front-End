import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { analyticsApi } from '../infrastructure/analytics-api.js';

export const useAnalyticsStore = defineStore('analytics', () => {
    const dashboard = ref(null);
    const loading   = ref(false);
    const error     = ref(null);

    async function fetchDashboard() {
        loading.value = true;
        error.value   = null;
        try {
            dashboard.value = await analyticsApi.getDashboard();
        } catch (e) {
            error.value = e.message ?? 'Failed to load analytics';
        } finally {
            loading.value = false;
        }
    }

    const monthlyExpenditures = computed(() => dashboard.value?.monthlyExpenditures ?? []);
    const portfolioRoi        = computed(() => dashboard.value?.portfolioRoi ?? null);
    const resourceSaturation  = computed(() => dashboard.value?.resourceSaturation ?? []);
    const topMovers           = computed(() => dashboard.value?.topMovers ?? []);
    const summaryKpis         = computed(() => dashboard.value?.summaryKpis ?? null);

    return {
        dashboard, loading, error,
        monthlyExpenditures, portfolioRoi, resourceSaturation, topMovers, summaryKpis,
        fetchDashboard,
    };
});
