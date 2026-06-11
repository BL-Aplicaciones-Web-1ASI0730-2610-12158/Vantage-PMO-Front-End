<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
defineProps({
  docCompliance: { type: Number, required: true },
  slaCompliance: { type: Number, required: true },
});
</script>

<template>
  <div class="posture">
    <h3 class="posture__title">{{ t('riskCompliance.posture.title') }}</h3>
    <div class="posture__metrics">
      <div class="posture__kpi">
        <span class="posture__value" :class="docCompliance >= 90 ? 'posture__value--ok' : 'posture__value--warn'">
          {{ docCompliance }}<span class="posture__pct">%</span>
        </span>
        <span class="posture__key">{{ t('riskCompliance.posture.docFils') }}</span>
        <div class="posture__bar"><div class="posture__bar-fill" :style="{ width: docCompliance + '%' }" /></div>
      </div>
      <div class="posture__kpi">
        <span class="posture__value posture__value--ok">
          {{ slaCompliance }}<span class="posture__pct">%</span>
        </span>
        <span class="posture__key">{{ t('riskCompliance.posture.slaAlign') }}</span>
        <div class="posture__bar"><div class="posture__bar-fill posture__bar-fill--sla" :style="{ width: slaCompliance + '%' }" /></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.posture { display: flex; flex-direction: column; gap: .75rem; padding-top: .25rem; }
.posture__title {
  font-size: .67rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .1em; color: var(--text-secondary); margin: 0;
}
.posture__metrics { display: flex; gap: 1.5rem; }
.posture__kpi     { display: flex; flex-direction: column; gap: .3rem; }
.posture__value   { font-size: 2rem; font-weight: 800; line-height: 1; color: var(--text-primary); }
.posture__value--ok   { color: #16a34a; }
.posture__value--warn { color: #d97706; }
.app-dark .posture__value--ok   { color: #22c55e; }
.app-dark .posture__value--warn { color: #f59e0b; }
.posture__pct { font-size: 1rem; font-weight: 600; }
.posture__key {
  font-size: .62rem; font-weight: 700; letter-spacing: .1em;
  text-transform: uppercase; color: var(--text-muted);
}
.posture__bar { height: 4px; background: var(--border-color); border-radius: 2px; width: 80px; overflow: hidden; }
.posture__bar-fill     { height: 100%; background: #16a34a; border-radius: 2px; transition: width .6s ease; }
.posture__bar-fill--sla { background: #2563eb; }
.app-dark .posture__bar-fill     { background: #22c55e; }
.app-dark .posture__bar-fill--sla { background: #818cf8; }
</style>
