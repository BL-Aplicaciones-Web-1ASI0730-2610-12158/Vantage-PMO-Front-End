<script setup>
import { computed } from 'vue';

const props = defineProps({
    roi: { type: Object, default: null },
});

const R = 70;
const STROKE = 12;
const CIRC = 2 * Math.PI * R;

const dashOffset = computed(() => {
    const pct = props.roi?.percentage ?? 0;
    return CIRC - (pct / 100) * CIRC;
});

function formatMoney(val) {
    if (!val) return '—';
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    return `$${val.toLocaleString()}`;
}
</script>

<template>
  <div class="roi-gauge" v-if="roi">
    <svg viewBox="0 0 180 180" class="roi-gauge__svg">
      <circle cx="90" cy="90" :r="R" fill="none" stroke="rgba(255,255,255,.12)" :stroke-width="STROKE" />
      <circle
          cx="90" cy="90" :r="R" fill="none"
          stroke="#3b82f6" :stroke-width="STROKE"
          :stroke-dasharray="CIRC"
          :stroke-dashoffset="dashOffset"
          stroke-linecap="round"
          transform="rotate(-90 90 90)"
      />
      <text x="90" y="82" text-anchor="middle" class="roi-gauge__pct">{{ roi.percentage }}%</text>
      <text x="90" y="104" text-anchor="middle" class="roi-gauge__label">{{ roi.efficiencyLabel }}</text>
    </svg>
    <div class="roi-gauge__stats">
      <div class="roi-stat">
        <span class="roi-stat__key">Target</span>
        <span class="roi-stat__val">{{ formatMoney(roi.target) }}</span>
      </div>
      <div class="roi-stat">
        <span class="roi-stat__key">Projected</span>
        <span class="roi-stat__val">{{ formatMoney(roi.projected) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.roi-gauge { display: flex; flex-direction: column; align-items: center; gap: 1.25rem; }
.roi-gauge__svg { width: 180px; height: 180px; }
.roi-gauge__pct {
  fill: #fff; font-size: 28px; font-weight: 900;
  font-family: inherit;
}
.roi-gauge__label {
  fill: rgba(255,255,255,.55); font-size: 9px; font-weight: 800;
  letter-spacing: .1em; font-family: inherit;
}
.roi-gauge__stats {
  display: flex; gap: 2rem; width: 100%; justify-content: center;
}
.roi-stat { display: flex; flex-direction: column; align-items: center; gap: .15rem; }
.roi-stat__key { font-size: .65rem; font-weight: 700; color: rgba(255,255,255,.45); text-transform: uppercase; letter-spacing: .06em; }
.roi-stat__val { font-size: .95rem; font-weight: 800; color: #fff; }
</style>
