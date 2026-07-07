<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
    kpis: { type: Object, default: null },
});

const { t } = useI18n();
</script>

<template>
  <div class="kpi-row" v-if="kpis">
    <div class="kpi-card">
      <div class="kpi-card__icon kpi-card__icon--team"><i class="pi pi-users" /></div>
      <div class="kpi-card__body">
        <span class="kpi-card__label">{{ t('resourcePlanning.summary.totalResources') }}</span>
        <span class="kpi-card__value">{{ kpis.totalResources }}</span>
        <span class="kpi-card__sub">{{ t('resourcePlanning.summary.totalResourcesSub') }}</span>
      </div>
    </div>
    <div class="kpi-card">
      <div class="kpi-card__icon kpi-card__icon--util"><i class="pi pi-chart-pie" /></div>
      <div class="kpi-card__body">
        <span class="kpi-card__label">{{ t('resourcePlanning.summary.avgUtilization') }}</span>
        <span class="kpi-card__value">{{ kpis.avgUtilization }}%</span>
        <span class="kpi-card__sub">{{ t('resourcePlanning.summary.avgUtilizationSub') }}</span>
      </div>
    </div>
    <div class="kpi-card">
      <div class="kpi-card__icon kpi-card__icon--over"><i class="pi pi-exclamation-triangle" /></div>
      <div class="kpi-card__body">
        <span class="kpi-card__label">{{ t('resourcePlanning.summary.overAllocated') }}</span>
        <span class="kpi-card__value">{{ kpis.overAllocated }}</span>
        <span class="kpi-card__sub">{{ t('resourcePlanning.summary.overAllocatedSub') }}</span>
      </div>
    </div>
    <div class="kpi-card">
      <div class="kpi-card__icon kpi-card__icon--bench"><i class="pi pi-inbox" /></div>
      <div class="kpi-card__body">
        <span class="kpi-card__label">{{ t('resourcePlanning.summary.benchAvailable') }}</span>
        <span class="kpi-card__value">{{ kpis.benchAvailable }}</span>
        <span class="kpi-card__sub">{{ t('resourcePlanning.summary.benchAvailableSub') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.kpi-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}
.kpi-card__icon {
  width: 42px; height: 42px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; flex-shrink: 0;
}
.kpi-card__icon--team  { background: #eff6ff; color: #3b82f6; }
.kpi-card__icon--util  { background: #f0fdf4; color: #16a34a; }
.kpi-card__icon--over  { background: #fef2f2; color: #dc2626; }
.kpi-card__icon--bench { background: #f5f3ff; color: #7c3aed; }
.kpi-card__body { display: flex; flex-direction: column; gap: .15rem; }
.kpi-card__label { font-size: .68rem; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: .06em; }
.kpi-card__value { font-size: 1.5rem; font-weight: 900; color: #111827; line-height: 1.2; }
.kpi-card__sub   { font-size: .75rem; color: #6b7280; }

@media (max-width: 1100px) {
  .kpi-row { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .kpi-row { grid-template-columns: 1fr; }
}
</style>
