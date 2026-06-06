<script setup>
import { onMounted, computed } from 'vue';
import { useDashboardStore } from '../../application/dashboard.store.js';
import useIamStore from '../../../iam/application/iam.store.js';

const store = useDashboardStore();
const iamStore = useIamStore();

onMounted(() => store.fetchAll());


const stats = computed(() => store.stats || null);
const currentUsername = computed(() => iamStore.currentUsername || 'User');
</script>

<template>
  <div class="home">

    <!-- Welcome Header (MISMO BLOQUE QUE VIEW1) -->
    <div class="welcome-row">
      <div>
        <h1 class="welcome-title">
          {{ $t('home.welcomeBack', { name: currentUsername }) }}
        </h1>

        <p class="welcome-sub" v-if="stats">
          {{ $t('home.portfolioHealth') }}
          <span class="healthy">{{ stats.portfolioHealth }}</span>.
          {{ $t('home.attentionItems', { n: stats.attentionItems }) }}
        </p>
      </div>

      <div class="live-sync">
        <span class="live-dot"></span>
        {{ $t('topbar.liveSync') }}
      </div>
    </div>

    <!-- SOLO STATS (recortado pero MISMO BLOQUE) -->
    <div class="stats-row" v-if="stats">
      <div class="stats-cards">

        <div class="stat-card">
          <span class="stat-label">{{ $t('home.totalProjects') }}</span>
          <div class="stat-value-row">
            <span class="stat-value">{{ stats.totalProjects }}</span>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-label">{{ $t('home.onTrack') }}</span>
          <div class="stat-value-row">
            <span class="stat-value green">{{ stats.onTrack }}</span>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-label">{{ $t('home.atRisk') }}</span>
          <div class="stat-value-row">
            <span class="stat-value red">
              {{ String(stats.atRisk).padStart(2, '0') }}
            </span>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
/* AQUÍ NO TOQUES EL ESTILO */
.home {
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: 'Inter', sans-serif;
}

/* reutilizas EXACTO el CSS de View1 */
.welcome-row { display: flex; justify-content: space-between; }
.welcome-title { font-size: 24px; font-weight: 700; color: #1e293b; }
.welcome-sub { font-size: 14px; color: #64748b; }
.healthy { color: #16a34a; font-weight: 600; }

.live-sync {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 6px 14px;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
}

/* stats igual estilo base */
.stats-row { display: flex; gap: 20px; }
.stats-cards { display: flex; gap: 16px; flex: 1; }

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  flex: 1;
  border: 1px solid #e9ecef;
}

.stat-label {
  font-size: 11px;
  color: #94a3b8;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
}

.stat-value.green { color: #16a34a; }
.stat-value.red { color: #dc2626; }

.stat-value-row {
  display: flex;
  gap: 10px;
}
</style>