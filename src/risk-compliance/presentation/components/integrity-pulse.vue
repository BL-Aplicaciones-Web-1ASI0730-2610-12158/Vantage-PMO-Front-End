<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
  pulse: { type: Number, required: true },
  delta: { type: Number, required: true },
});

const formattedDelta = computed(() =>
  props.delta >= 0 ? `+${props.delta}%` : `${props.delta}%`
);
const deltaClass = computed(() =>
  props.delta >= 0 ? 'pulse__delta--positive' : 'pulse__delta--negative'
);
const circumference = 220;
const offset = computed(() => circumference - (props.pulse / 100) * circumference);
</script>

<template>
  <div class="pulse">
    <div class="pulse__header">
      <span class="pulse__label">{{ t('riskCompliance.pulse.title') }}</span>
    </div>
    <div class="pulse__gauge-wrap">
      <svg viewBox="0 0 80 80" class="pulse__svg">
        <circle class="pulse__track" cx="40" cy="40" r="35" />
        <circle
          class="pulse__arc"
          cx="40" cy="40" r="35"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="offset"
        />
      </svg>
      <div class="pulse__inner">
        <span class="pulse__value">{{ pulse }}<span class="pulse__pct">%</span></span>
        <span :class="['pulse__delta', deltaClass]">{{ formattedDelta }}</span>
      </div>
    </div>
    <p class="pulse__sub">{{ t('riskCompliance.pulse.subtitle') }}</p>
  </div>
</template>

<style scoped>
.pulse { display: flex; flex-direction: column; align-items: center; gap: .6rem; padding: .5rem 0; }

.pulse__header { width: 100%; }
.pulse__label  {
  font-size: .68rem; font-weight: 700;
  letter-spacing: .12em; text-transform: uppercase;
  color: var(--text-secondary);
}
.pulse__gauge-wrap { position: relative; width: 130px; height: 130px; }
.pulse__svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.pulse__track { fill: none; stroke: var(--border-color); stroke-width: 6; }
.pulse__arc {
  fill: none; stroke: #16a34a; stroke-width: 6;
  stroke-linecap: round; transition: stroke-dashoffset .6s ease;
}
.app-dark .pulse__arc { stroke: #22c55e; }

.pulse__inner {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.pulse__value { font-size: 1.9rem; font-weight: 800; color: var(--text-primary); line-height: 1; }
.pulse__pct { font-size: 1rem; font-weight: 600; }
.pulse__delta { font-size: .75rem; font-weight: 700; margin-top: 2px; }
.pulse__delta--positive { color: #16a34a; }
.pulse__delta--negative { color: #dc2626; }
.app-dark .pulse__delta--positive { color: #22c55e; }
.app-dark .pulse__delta--negative { color: #ef4444; }

.pulse__sub {
  font-size: .68rem; color: var(--text-secondary);
  text-align: center; margin: 0; max-width: 140px;
}
</style>
