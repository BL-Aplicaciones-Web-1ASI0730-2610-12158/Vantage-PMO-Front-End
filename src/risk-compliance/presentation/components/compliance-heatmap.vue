<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
  rows:        { type: Array,  required: true },
  segment:     { type: String, default: '' },
  environment: { type: String, default: '' },
});

const likelihoods = ['REMOTE', 'UNLIKELY', 'POSSIBLE', 'PROBABLE', 'CERTAIN'];
</script>

<template>
  <div class="heatmap">
    <div class="heatmap__header">
      <div>
        <h2 class="heatmap__title">{{ t('riskCompliance.heatmap.title') }}</h2>
        <p  class="heatmap__sub">{{ t('riskCompliance.heatmap.subtitle', { segment }) }}</p>
      </div>
      <div class="heatmap__legend">
        <span class="heatmap__dot heatmap__dot--low"/>    {{ t('riskCompliance.heatmap.levelLow') }}
        <span class="heatmap__dot heatmap__dot--medium"/> {{ t('riskCompliance.heatmap.levelMedium') }}
        <span class="heatmap__dot heatmap__dot--high"/>   {{ t('riskCompliance.heatmap.levelHigh') }}
        <span class="heatmap__dot heatmap__dot--critical"/>{{ t('riskCompliance.heatmap.levelCritical') }}
      </div>
    </div>

    <div class="heatmap__grid-wrap">
      <div class="heatmap__y-label">{{ t('riskCompliance.heatmap.impact') }}</div>
      <div class="heatmap__grid">
        <div class="heatmap__row heatmap__row--header">
          <div class="heatmap__impact-col"/>
          <div v-for="lh in likelihoods" :key="lh" class="heatmap__col-head">
            {{ t(`riskCompliance.likelihood.${lh.toLowerCase()}`) }}
          </div>
        </div>
        <div v-for="row in rows" :key="row.impact" class="heatmap__row">
          <div class="heatmap__impact-label">
            {{ t(`riskCompliance.impact.${row.impact.toLowerCase()}`) }}
          </div>
          <div
            v-for="cell in row.cells"
            :key="cell.likelihood"
            :class="['heatmap__cell', `heatmap__cell--${cell.level}`]"
          >{{ cell.value }}</div>
        </div>
      </div>
      <p class="heatmap__x-label">{{ t('riskCompliance.heatmap.likelihoodProbability') }}</p>
    </div>
  </div>
</template>

<style scoped>
.heatmap { display: flex; flex-direction: column; gap: 1rem; }

.heatmap__header {
  display: flex; justify-content: space-between;
  align-items: flex-start; flex-wrap: wrap; gap: .5rem;
}
.heatmap__title { font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 0; }
.heatmap__sub   { font-size: .75rem; color: var(--text-secondary); margin: .15rem 0 0; }

.heatmap__legend {
  display: flex; align-items: center; gap: .75rem;
  font-size: .72rem; color: var(--text-secondary);
}
.heatmap__dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; }
.heatmap__dot--low      { background: #16a34a; }
.heatmap__dot--medium   { background: #d97706; }
.heatmap__dot--high     { background: #ea580c; }
.heatmap__dot--critical { background: #dc2626; }

.heatmap__grid-wrap { position: relative; padding-left: 1.2rem; display: flex; flex-direction: column; gap: .25rem; }
.heatmap__y-label {
  writing-mode: vertical-rl; transform: rotate(180deg);
  font-size: .62rem; color: var(--text-muted);
  letter-spacing: .08em; text-transform: uppercase;
  position: absolute; left: 0; top: 50%; translate: 0 -50%;
}
.heatmap__grid { display: flex; flex-direction: column; gap: 4px; }
.heatmap__row {
  display: grid; grid-template-columns: 64px repeat(5, 1fr);
  gap: 4px; align-items: center;
}
.heatmap__row--header { margin-bottom: 2px; }
.heatmap__impact-col {}
.heatmap__col-head {
  text-align: center; font-size: .62rem; font-weight: 700;
  color: var(--text-muted); text-transform: uppercase; letter-spacing: .06em;
}
.heatmap__impact-label {
  font-size: .68rem; font-weight: 700; color: var(--text-secondary);
  text-transform: uppercase; letter-spacing: .06em;
  text-align: right; padding-right: .5rem;
}

/* Cells — color palette works on both light & dark backgrounds */
.heatmap__cell {
  aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
  font-size: .9rem; font-weight: 800; border-radius: 8px;
  min-height: 52px; cursor: default;
  transition: transform .15s, box-shadow .15s;
}
.heatmap__cell:hover { transform: scale(1.04); box-shadow: 0 4px 12px rgba(0,0,0,.15); }

/* Low  — green */
.heatmap__cell--low {
  background: rgba(22,163,74,.22); color: #15803d;
  border: 1px solid rgba(22,163,74,.35);
}
.app-dark .heatmap__cell--low { color: #4ade80; background: rgba(34,197,94,.18); border-color: rgba(34,197,94,.25); }

/* Medium — amber */
.heatmap__cell--medium {
  background: rgba(217,119,6,.22); color: #b45309;
  border: 1px solid rgba(217,119,6,.35);
}
.app-dark .heatmap__cell--medium { color: #fbbf24; background: rgba(245,158,11,.18); border-color: rgba(245,158,11,.25); }

/* High — orange */
.heatmap__cell--high {
  background: rgba(234,88,12,.22); color: #c2410c;
  border: 1px solid rgba(234,88,12,.35);
}
.app-dark .heatmap__cell--high { color: #fb923c; background: rgba(249,115,22,.22); border-color: rgba(249,115,22,.3); }

/* Critical — red */
.heatmap__cell--critical {
  background: rgba(220,38,38,.22); color: #b91c1c;
  border: 1px solid rgba(220,38,38,.35);
}
.app-dark .heatmap__cell--critical { color: #f87171; background: rgba(239,68,68,.22); border-color: rgba(239,68,68,.3); }

.heatmap__x-label {
  text-align: center; font-size: .62rem; color: var(--text-muted);
  letter-spacing: .1em; text-transform: uppercase; margin-top: .5rem;
}
</style>

