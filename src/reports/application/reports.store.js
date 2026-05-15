import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { reportsApi } from '../infrastructure/reports-api.js';

export const useReportsStore = defineStore('reports', () => {

    const reports       = ref([]);
    const loading       = ref(false);
    const activeReport  = ref(null);
    const previewMode   = ref(false);
    const generating    = ref(false);

    async function fetchReports() {
        loading.value = true;
        try {
            reports.value = await reportsApi.getAllReports();
            if (reports.value.length && !activeReport.value) {
                activeReport.value = reports.value[0];
            }
        } finally { loading.value = false; }
    }

    function selectReport(report) {
        activeReport.value = report;
        previewMode.value  = false;
    }

    async function generatePreview(reportId) {
        generating.value = true;
        await new Promise(r => setTimeout(r, 900)); // simulate generation
        const found = reports.value.find(r => r.id === reportId);
        if (found) activeReport.value = found;
        previewMode.value = true;
        generating.value  = false;
    }

    const projectOptions = computed(() =>
        [...new Set(reports.value.map(r => r.project))]
    );

    return {
        reports, loading, activeReport, previewMode, generating,
        projectOptions, fetchReports, selectReport, generatePreview
    };
});