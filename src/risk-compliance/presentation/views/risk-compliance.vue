<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRiskComplianceStore } from '../../application/risk-compliance.store.js';
import ComplianceHeatmap    from '../components/compliance-heatmap.vue';
import IntegrityPulse       from '../components/integrity-pulse.vue';
import SystemIntegrityCard  from '../components/system-integrity-card.vue';
import CriticalRisksTable   from '../components/critical-risks-table.vue';
import CompliancePosture    from '../components/compliance-posture.vue';
import AtRiskProjectsPanel  from '../components/at-risk-projects-panel.vue';

const { t } = useI18n();
const store = useRiskComplianceStore();

onMounted(() => store.fetchAll());

function handleExportPdf() {
  window.print();
}
function handleBulkAudit() {
  alert(t('riskCompliance.actions.bulkAuditAlert'));
}
</script>

<template>
  <div class="rc-page">

    <!--  Page header  -->
    <div class="rc-topbar">
      <div>
        <h1 class="rc-page__title">{{ t('riskCompliance.title') }}</h1>
        <p  class="rc-page__sub">{{ t('riskCompliance.subtitle') }}</p>
      </div>
      <span v-if="store.riskMatrix" class="rc-env-badge">
        <i class="pi pi-circle-fill rc-env-badge__dot" />
        {{ store.riskMatrix.environment }}
      </span>
    </div>

    <!--  Loading  -->
    <div v-if="store.loading" class="rc-state">
      <i class="pi pi-spin pi-spinner rc-state__icon" />
      <span>{{ t('riskCompliance.loading') }}</span>
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="rc-state rc-state--error">
      <i class="pi pi-exclamation-circle rc-state__icon" />
      <span>{{ store.error }}</span>
    </div>

    <!--  Content  -->
    <template v-else>

      <!-- Row 1: Heatmap  |  Right panel -->
      <div class="rc-grid rc-grid--main">

        <!-- Heatmap -->
        <div class="rc-card rc-card--heatmap">
          <ComplianceHeatmap
            :rows="store.heatmapRows"
            :segment="store.riskMatrix?.segment ?? ''"
            :environment="store.riskMatrix?.environment ?? ''"
          />
        </div>

        <!-- Right panel stack -->
        <div class="rc-panel">
          <!-- Integrity Pulse -->
          <div class="rc-card" v-if="store.complianceMetrics">
            <IntegrityPulse
              :pulse="store.complianceMetrics.integrityPulse"
              :delta="store.complianceMetrics.integrityDelta"
            />
          </div>

          <!-- System Integrity Alerts -->
          <div class="rc-card" v-if="store.complianceMetrics">
            <SystemIntegrityCard
              :alerts="store.complianceMetrics.systemIntegrityAlerts"
            />
          </div>

          <!-- Compliance Posture KPIs -->
          <div class="rc-card" v-if="store.complianceMetrics">
            <CompliancePosture
              :doc-compliance="store.complianceMetrics.docCompliance"
              :sla-compliance="store.complianceMetrics.slaCompliance"
            />
          </div>

          <!-- ⬇ Cross-BC: At-Risk Projects from Projects BC -->
          <div class="rc-card">
            <AtRiskProjectsPanel />
          </div>
        </div>
      </div>

      <!-- Row 2: Critical Risks & Control Logs -->
      <div class="rc-card">
        <CriticalRisksTable
          :risks="store.criticalRisks"
          @export-pdf="handleExportPdf"
          @bulk-audit="handleBulkAudit"
        />
      </div>

    </template>
  </div>
</template>

<style scoped>
.rc-page {
  padding: 1.5rem 1.75rem;
  display: flex; flex-direction: column; gap: 1.25rem;
  background: var(--bg-content);
  min-height: 100%;
  color: var(--text-primary);
}

/* Header */
.rc-topbar {
  display: flex; justify-content: space-between;
  align-items: center; flex-wrap: wrap; gap: .75rem;
}
.rc-page__title { font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin: 0; }
.rc-page__sub   { font-size: .8rem; color: var(--text-secondary); margin: .2rem 0 0; }

.rc-env-badge {
  display: inline-flex; align-items: center; gap: .4rem;
  padding: .3rem .85rem; border-radius: 20px;
  font-size: .68rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  background: rgba(22,163,74,.12); color: #16a34a;
  border: 1px solid rgba(22,163,74,.25);
}
.app-dark .rc-env-badge { background: rgba(34,197,94,.12); color: #4ade80; border-color: rgba(34,197,94,.25); }
.rc-env-badge__dot { font-size: .45rem; }

/* State (loading / error) */
.rc-state {
  display: flex; align-items: center; justify-content: center;
  gap: .75rem; padding: 3rem; color: var(--text-secondary);
  font-size: .9rem;
}
.rc-state--error { color: #dc2626; }
.rc-state__icon  { font-size: 1.4rem; }

/* Grid layout */
.rc-grid--main {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.25rem;
  align-items: start;
}
.rc-panel { display: flex; flex-direction: column; gap: 1.25rem; }

/* Cards */
.rc-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
}
.rc-card--heatmap { padding: 1.5rem; }

@media (max-width: 900px) {
  .rc-page { padding: 1rem; }
  .rc-grid--main { grid-template-columns: 1fr; }
}
</style>
