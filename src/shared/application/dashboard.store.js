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

    async function fetchAll() {
        loading.value = true;
        try {
            [tasks.value, schedule.value, departments.value, stats.value] = await Promise.all([
                tasksApi.getAll(),
                scheduleApi.getAll(),
                departmentsApi.getAll(),
                statsApi.getFirst(),
            ]);
        } finally {
            loading.value = false;
        }
    }

    return { tasks, schedule, departments, stats, loading, fetchAll };
});
