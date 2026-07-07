<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
    departments: { type: Array, default: () => [] },
});

const { t } = useI18n();

const DEPT_COLORS = {
    'Engineering':    '#3b82f6',
    'Product Design': '#16a34a',
    'Data Science':   '#8b5cf6',
    'Strategy & Ops': '#94a3b8',
};

function barColor(dept) {
    if (dept.status === 'over') return '#dc2626';
    if (dept.status === 'warning') return '#f59e0b';
    return DEPT_COLORS[dept.department] ?? '#94a3b8';
}

function barWidth(utilization) {
    return Math.min(utilization, 100);
}
</script>

<template>
  <div class="utilization">
    <div v-for="dept in departments" :key="dept.department" class="utilization__row">
      <div class="utilization__head">
        <span class="utilization__name">{{ dept.department }}</span>
        <span :class="['utilization__pct', `utilization__pct--${dept.status}`]">
          {{ dept.utilization }}% {{ t('resourcePlanning.departmentCapacity.utilization') }}
        </span>
      </div>
      <div class="utilization__track">
        <div
            class="utilization__fill"
            :style="{ width: barWidth(dept.utilization) + '%', background: barColor(dept) }"
        />
        <div
            v-if="dept.utilization > 100"
            class="utilization__overflow"
            :style="{ width: Math.min(dept.utilization - 100, 20) + '%' }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.utilization { display: flex; flex-direction: column; gap: 1.1rem; }
.utilization__row { display: flex; flex-direction: column; gap: .4rem; }
.utilization__head { display: flex; justify-content: space-between; align-items: center; }
.utilization__name { font-size: .85rem; font-weight: 700; color: #111827; }
.utilization__pct  { font-size: .78rem; font-weight: 600; color: #6b7280; }
.utilization__pct--warning { color: #d97706; font-weight: 800; }
.utilization__pct--over    { color: #dc2626; font-weight: 800; }
.utilization__track {
  height: 8px; background: #f1f5f9; border-radius: 99px; overflow: hidden;
  display: flex;
}
.utilization__fill {
  height: 100%; border-radius: 99px 0 0 99px;
  transition: width .5s cubic-bezier(.4,0,.2,1);
}
.utilization__overflow {
  height: 100%; background: #dc2626; border-radius: 0 99px 99px 0;
}
</style>
