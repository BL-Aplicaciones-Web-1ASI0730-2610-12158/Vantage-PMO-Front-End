import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { riskComplianceApi } from '../infrastructure/risk-compliance-api.js';

export const useRiskComplianceStore = defineStore('risk-compliance', () => {
    const risks             = ref([]);
    const riskMatrix        = ref(null);
    const complianceMetrics = ref(null);
    const loading           = ref(false);
    const error             = ref(null);

    async function fetchAll() {
        loading.value = true;
        error.value   = null;
        try {
            const [r, m, c] = await Promise.all([
                riskComplianceApi.getRisks(),
                riskComplianceApi.getRiskMatrix(),
                riskComplianceApi.getComplianceMetrics(),
            ]);
            risks.value             = r;
            riskMatrix.value        = m;
            complianceMetrics.value = c;
        } catch (e) {
            error.value = e.message ?? 'Failed to load risk & compliance data';
        } finally {
            loading.value = false;
        }
    }

    /* ── Computed helpers ─────────────────────────────────────────── */

    const criticalRisks = computed(() =>
        risks.value.filter(r => r.severity === 'CRITICAL' || r.severity === 'HIGH')
    );

    const openRisksCount = computed(() =>
        risks.value.filter(r => r.status === 'open').length
    );

    const heatmapRows = computed(() => {
        if (!riskMatrix.value) return [];
        const impacts = ['HIGH', 'MEDIUM', 'LOW'];
        const likelihoods = ['REMOTE', 'UNLIKELY', 'POSSIBLE', 'PROBABLE', 'CERTAIN'];
        return impacts.map(impact => ({
            impact,
            cells: likelihoods.map(likelihood =>
                riskMatrix.value.heatmapCells.find(
                    c => c.impact === impact && c.likelihood === likelihood
                ) ?? { impact, likelihood, value: 0, level: 'low' }
            ),
        }));
    });

    return {
        risks,
        riskMatrix,
        complianceMetrics,
        loading,
        error,
        criticalRisks,
        openRisksCount,
        heatmapRows,
        fetchAll,
    };
});