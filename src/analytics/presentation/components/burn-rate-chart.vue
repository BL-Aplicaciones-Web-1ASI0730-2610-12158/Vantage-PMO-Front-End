<script setup>
import { computed } from 'vue';

const props = defineProps({
    data: { type: Array, default: () => [] },
});

const CHART_W = 520;
const CHART_H = 180;
const PAD = { top: 16, right: 16, bottom: 28, left: 16 };

const maxVal = computed(() => {
    const vals = props.data.flatMap(d => [d.forecast, d.actual]);
    return Math.max(...vals, 1) * 1.1;
});

function xPos(idx) {
    const inner = CHART_W - PAD.left - PAD.right;
    return PAD.left + (idx / Math.max(props.data.length - 1, 1)) * inner;
}

function yPos(val) {
    const inner = CHART_H - PAD.top - PAD.bottom;
    return PAD.top + inner - (val / maxVal.value) * inner;
}

const forecastPath = computed(() => {
    if (!props.data.length) return '';
    const pts = props.data.map((d, i) => `${xPos(i)},${yPos(d.forecast)}`);
    const first = pts[0].split(',');
    const last  = pts[pts.length - 1].split(',');
    const bottom = CHART_H - PAD.bottom;
    return `M ${first[0]},${bottom} L ${pts.join(' L ')} L ${last[0]},${bottom} Z`;
});

const forecastLine = computed(() =>
    props.data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i)},${yPos(d.forecast)}`).join(' ')
);

const actualLine = computed(() =>
    props.data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i)},${yPos(d.actual)}`).join(' ')
);
</script>

<template>
  <div class="burn-chart">
    <svg :viewBox="`0 0 ${CHART_W} ${CHART_H}`" class="burn-chart__svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.02" />
        </linearGradient>
      </defs>
      <path :d="forecastPath" fill="url(#forecastFill)" />
      <path :d="forecastLine" fill="none" stroke="#3b82f6" stroke-width="2.5" />
      <path :d="actualLine" fill="none" stroke="#93c5fd" stroke-width="2" stroke-dasharray="6 4" />
    </svg>
    <div class="burn-chart__labels">
      <span v-for="d in data" :key="d.month" class="burn-chart__label">{{ d.month }}</span>
    </div>
    <div class="burn-chart__legend">
      <span class="legend-item"><span class="legend-dot legend-dot--forecast" /> Forecast</span>
      <span class="legend-item"><span class="legend-dot legend-dot--actual" /> Actuals</span>
    </div>
  </div>
</template>

<style scoped>
.burn-chart { display: flex; flex-direction: column; gap: .5rem; }
.burn-chart__svg { width: 100%; height: 180px; display: block; }
.burn-chart__labels {
  display: flex; justify-content: space-between;
  padding: 0 .5rem;
}
.burn-chart__label { font-size: .68rem; font-weight: 700; color: #9ca3af; letter-spacing: .04em; }
.burn-chart__legend { display: flex; gap: 1.25rem; padding: .25rem .5rem 0; }
.legend-item { display: flex; align-items: center; gap: .4rem; font-size: .75rem; color: #6b7280; font-weight: 600; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.legend-dot--forecast { background: #3b82f6; }
.legend-dot--actual   { background: #d1d5db; }
</style>
