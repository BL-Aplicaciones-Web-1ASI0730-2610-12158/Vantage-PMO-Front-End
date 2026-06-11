import { defineStore } from 'pinia';
import { ref } from 'vue';
import { riskComplianceApi } from '../infrastructure/risk-compliance-api.js';
import { RiskComplianceAssembler } from '../infrastructure/risk-compliance.assembler.js';

export const useRiskComplianceStore = defineStore('risk-compliance', () => {
    const reports = ref([]);
    const loading = ref(false);

    async function fetchReports() {
        loading.value = true;
        try {
            const data = await riskComplianceApi.getReports();
            reports.value = data.map(RiskComplianceAssembler.toEntity);
        } catch (e) {
            console.error('Error loading risks:', e);
        } finally {
            loading.value = false;
        }
    }

    return { reports, loading, fetchReports };
});