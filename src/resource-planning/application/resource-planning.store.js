import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { resourcePlanningApi } from '../infrastructure/resource-planning-api.js';

export const useResourcePlanningStore = defineStore('resource-planning', () => {
    const dashboard = ref(null);
    const loading   = ref(false);
    const error     = ref(null);

    async function fetchDashboard() {
        loading.value = true;
        error.value   = null;
        try {
            dashboard.value = await resourcePlanningApi.getDashboard();
        } catch (e) {
            error.value = e.message ?? 'Failed to load resource planning';
        } finally {
            loading.value = false;
        }
    }

    const period             = computed(() => dashboard.value?.period ?? '');
    const summaryKpis        = computed(() => dashboard.value?.summaryKpis ?? null);
    const departmentCapacity = computed(() => dashboard.value?.departmentCapacity ?? []);
    const allocations        = computed(() => dashboard.value?.allocations ?? []);
    const capacityGaps       = computed(() => dashboard.value?.capacityGaps ?? []);

    return {
        dashboard, loading, error,
        period, summaryKpis, departmentCapacity, allocations, capacityGaps,
        fetchDashboard,
    };
});
