import { defineStore } from 'pinia';
import { ref } from 'vue';
import { tasksApi, scheduleApi, departmentsApi, statsApi } from '../infrastructure/dashboard-api.js';

/**
 * Dashboard Application Store
 * Orchestrates home dashboard use-cases.
 */
export const useDashboardStore = defineStore('dashboard', () => {
    const tasks       = ref([]);
    const schedule    = ref([]);
    const departments = ref([]);
    const stats       = ref(null);
    const loading     = ref(false);

    async function fetchAll(userId = 1) {
        loading.value = true;
        try {
            const results = await Promise.allSettled([
                tasksApi.getAll(),
                scheduleApi.getAll(),
                departmentsApi.getAll(),
                statsApi.getByUserId(userId),
            ]);

            if (results[0].status === 'fulfilled') tasks.value = results[0].value;
            if (results[1].status === 'fulfilled') schedule.value = results[1].value;
            if (results[2].status === 'fulfilled') departments.value = results[2].value;
            if (results[3].status === 'fulfilled') stats.value = results[3].value;
        } finally {
            loading.value = false;
        }
    }

    return { tasks, schedule, departments, stats, loading, fetchAll };
});
