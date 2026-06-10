<script setup>
defineProps({
    kpis: { type: Object, default: null },
});

function formatMoney(val) {
    if (!val) return '—';
    return `$${val.toLocaleString()}`;
}
</script>

<template>
  <div class="kpi-row" v-if="kpis">
    <div class="kpi-card">
      <div class="kpi-card__icon kpi-card__icon--bank"><i class="pi pi-building-columns" /></div>
      <div class="kpi-card__body">
        <span class="kpi-card__label">Unallocated Funds</span>
        <span class="kpi-card__value">{{ formatMoney(kpis.unallocatedFunds) }}</span>
        <span class="kpi-card__sub">{{ kpis.unallocatedSubtext }}</span>
      </div>
    </div>
    <div class="kpi-card">
      <div class="kpi-card__icon kpi-card__icon--velocity"><i class="pi pi-gauge" /></div>
      <div class="kpi-card__body">
        <span class="kpi-card__label">Velocity Index</span>
        <span class="kpi-card__value">{{ kpis.velocityIndex }}x</span>
        <span class="kpi-card__sub kpi-card__sub--up">
          <i class="pi pi-arrow-up" /> {{ kpis.velocityChange }}% from previous sprint
        </span>
      </div>
    </div>
    <div class="kpi-card">
      <div class="kpi-card__icon kpi-card__icon--risk"><i class="pi pi-exclamation-triangle" /></div>
      <div class="kpi-card__body">
        <span class="kpi-card__label">Risk Exposure</span>
        <span class="kpi-card__value">{{ kpis.riskExposure }}</span>
        <span class="kpi-card__sub">{{ kpis.mitigationPlans }} active mitigation plans</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kpi-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
.kpi-card__icon--bank     { background: #eff6ff; color: #3b82f6; }
.kpi-card__icon--velocity { background: #f0fdf4; color: #16a34a; }
.kpi-card__icon--risk     { background: #fef3c7; color: #d97706; }
.kpi-card__body { display: flex; flex-direction: column; gap: .15rem; }
.kpi-card__label { font-size: .68rem; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: .06em; }
.kpi-card__value { font-size: 1.5rem; font-weight: 900; color: #111827; line-height: 1.2; }
.kpi-card__sub   { font-size: .75rem; color: #6b7280; }
.kpi-card__sub--up { color: #16a34a; font-weight: 600; display: flex; align-items: center; gap: .2rem; }

@media (max-width: 900px) {
  .kpi-row { grid-template-columns: 1fr; }
}
</style>
