import { defineStore } from 'pinia';
import { ref } from 'vue';
import { reportsApi } from '../infrastructure/reports-api.js';

export const useReportsStore = defineStore('reports', () => {

    const reports = ref([]);
    const loading = ref(false);

    async function fetchReports() {
        loading.value = true;

        try {
            reports.value = await reportsApi.getAllReports();
        } finally {
            loading.value = false;
        }
    }

    return {
        reports,
        loading,
        fetchReports
    };
});