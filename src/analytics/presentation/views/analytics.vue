<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAnalyticsStore } from '../../application/analytics.store.js';
import BurnRateChart from '../components/burn-rate-chart.vue';
import PortfolioRoiGauge from '../components/portfolio-roi-gauge.vue';
import ResourceSaturation from '../components/resource-saturation.vue';
import TopMoversTable from '../components/top-movers-table.vue';
import SummaryKpiCards from '../components/summary-kpi-cards.vue';

const { t } = useI18n();
const store = useAnalyticsStore();

onMounted(() => store.fetchDashboard());
</script>

<template>
  <div class="an-page">
    <div class="an-topbar">
      <div>
        <h1 class="an-title">{{ t('analytics.title') }}</h1>
        <p class="an-subtitle">{{ t('analytics.subtitle') }}</p>
      </div>
    </div>

    <div v-if="store.loading" class="an-loading">
      <i class="pi pi-spin pi-spinner" style="font-size:2rem" />
    </div>

    <div v-else-if="store.error" class="an-error">
      <i class="pi pi-exclamation-circle" />
      <span>{{ store.error }}</span>
    </div>

    <template v-else-if="store.dashboard">
      <!-- Row 1: Burn Rate + Portfolio ROI -->
      <div class="an-grid an-grid--2">
        <div class="an-card">
          <div class="an-card__head">
            <h2 class="an-card__title">{{ t('analytics.burnRate.title') }}</h2>
            <p class="an-card__sub">{{ t('analytics.burnRate.subtitle') }}</p>
          </div>
          <BurnRateChart :data="store.monthlyExpenditures" />
        </div>

        <div class="an-card an-card--dark">
          <div class="an-card__head">
            <h2 class="an-card__title an-card__title--light">{{ t('analytics.portfolioRoi.title') }}</h2>
            <p class="an-card__sub an-card__sub--light">{{ t('analytics.portfolioRoi.subtitle') }}</p>
          </div>
          <PortfolioRoiGauge :roi="store.portfolioRoi" />
        </div>
      </div>

      <!-- Row 2: Resource Saturation + Top Movers -->
      <div class="an-grid an-grid--2">
        <div class="an-card">
          <div class="an-card__head">
            <h2 class="an-card__title">{{ t('analytics.resourceSaturation.title') }}</h2>
            <p class="an-card__sub">{{ t('analytics.resourceSaturation.subtitle') }}</p>
          </div>
          <ResourceSaturation :departments="store.resourceSaturation" />
        </div>

        <div class="an-card">
          <div class="an-card__head an-card__head--row">
            <div>
              <h2 class="an-card__title">{{ t('analytics.topMovers.title') }}</h2>
              <p class="an-card__sub">{{ t('analytics.topMovers.subtitle') }}</p>
            </div>
            <span class="an-live-badge">{{ t('analytics.topMovers.liveUpdate') }}</span>
          </div>
          <TopMoversTable :movers="store.topMovers" />
        </div>
      </div>

      <!-- Row 3: Summary KPIs -->
      <SummaryKpiCards :kpis="store.summaryKpis" />
    </template>
  </div>
</template>

<style scoped>
.an-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-height: 100%;
}

.an-topbar { display: flex; justify-content: space-between; align-items: flex-start; }
.an-title  { font-size: 1.6rem; font-weight: 800; margin: 0; color: #111827; }
.an-subtitle { color: #6b7280; font-size: .9rem; margin: .2rem 0 0; }

.an-loading, .an-error {
  display: flex; align-items: center; justify-content: center;
  gap: .75rem; padding: 4rem; color: #6b7280;
}
.an-error { color: #dc2626; }

.an-grid { display: grid; gap: 1.25rem; }
.an-grid--2 { grid-template-columns: 1fr 1fr; }

.an-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.an-card--dark {
  background: linear-gradient(145deg, #0f172a 0%, #1e293b 100%);
  border-color: #1e293b;
}
.an-card__head { display: flex; flex-direction: column; gap: .2rem; }
.an-card__head--row {
  flex-direction: row; justify-content: space-between; align-items: flex-start;
}
.an-card__title {
  font-size: .95rem; font-weight: 800; color: #111827; margin: 0;
}
.an-card__title--light { color: #fff; }
.an-card__sub { font-size: .78rem; color: #9ca3af; margin: 0; }
.an-card__sub--light { color: rgba(255,255,255,.45); }

.an-live-badge {
  background: #dcfce7; color: #166534;
  font-size: .62rem; font-weight: 800; letter-spacing: .08em;
  border-radius: 6px; padding: 3px 10px; white-space: nowrap;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .an-grid--2 { grid-template-columns: 1fr; }
}
</style>
