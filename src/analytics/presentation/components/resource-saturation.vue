<script setup>
import { CapacityStatus } from '../../domain/model/capacity-status.js';

defineProps({
    departments: { type: Array, default: () => [] },
});

const DEPT_COLORS = {
    'Engineering':     '#3b82f6',
    'Product Design':  '#166534',
    'Data Science':    '#dc2626',
    'Strategy & Ops':  '#cbd5e1',
};

function barColor(dept) {
    if (dept.status === CapacityStatus.OVER) return '#dc2626';
    return DEPT_COLORS[dept.department] ?? '#94a3b8';
}

function barWidth(capacity) {
    return Math.min(capacity, 100);
}
</script>

<template>
  <div class="saturation">
    <div v-for="dept in departments" :key="dept.department" class="saturation__row">
      <div class="saturation__head">
        <span class="saturation__name">{{ dept.department }}</span>
        <span :class="['saturation__pct', { 'saturation__pct--over': dept.status === 'over' }]">
          {{ dept.capacity }}% Capacity
        </span>
      </div>
      <div class="saturation__track">
        <div
            class="saturation__fill"
            :style="{ width: barWidth(dept.capacity) + '%', background: barColor(dept) }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.saturation { display: flex; flex-direction: column; gap: 1.1rem; }
.saturation__row { display: flex; flex-direction: column; gap: .4rem; }
.saturation__head { display: flex; justify-content: space-between; align-items: center; }
.saturation__name { font-size: .85rem; font-weight: 700; color: #111827; }
.saturation__pct  { font-size: .78rem; font-weight: 600; color: #6b7280; }
.saturation__pct--over { color: #dc2626; font-weight: 800; }
.saturation__track {
  height: 8px; background: #f1f5f9; border-radius: 99px; overflow: hidden;
}
.saturation__fill {
  height: 100%; border-radius: 99px;
  transition: width .5s cubic-bezier(.4,0,.2,1);
}
</style>
