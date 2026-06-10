<script setup>
import { onMounted, computed } from 'vue';
import { useDashboardStore } from '../../../application/dashboard.store.js';
import useIamStore from '../../../../iam/application/iam.store.js';
import { useDialog } from 'primevue/usedialog';
import AiInsightsPanel from '../../../../chat-hub/presentation/components/AiInsightsPanel.vue';

const store = useDashboardStore();
const iamStore = useIamStore();
const dialog = useDialog();

// Global portfolio context loading
onMounted(() => store.fetchAll('portfolio'));

// Reactive selectors from Pinia
const priorityTasks   = computed(() => store.tasks);
const scheduleItems   = computed(() => store.schedule);
const stats           = computed(() => store.stats);
const currentUsername = computed(() => iamStore.currentUsername || 'User');

// Opening the AI panel via PrimeVue
const openAiInsightsDialog = () => {
  dialog.open(AiInsightsPanel, {
    props: {
      header: 'AI Portfolio Insights',
      modal: true,
      style: { width: '50vw' },
      breakpoints: { '960px': '75vw', '641px': '100vw' }
    }
  });
};
</script>

<template>
  <div class="dashboard-container">
    <!-- Welcome Row -->
    <div class="welcome-row">
      <div class="welcome-text">
        <h1 class="welcome-title">{{ $t('portfolio.welcomeTitle') }}, {{ currentUsername }}</h1>
        <p class="welcome-sub" v-if="stats">
          {{ $t('portfolio.performanceMatrix') }} —
          <span class="status-healthy">{{ stats.portfolioHealth || '90.4%' }} {{ $t('portfolio.healthyStatus') }}</span>
        </p>
      </div>
      <div class="live-sync-badge">
        <span class="pulse-dot"></span>
        {{ $t('topbar.liveSync') }}
      </div>
    </div>

    <!-- Top Section: Status Cards and AI Card -->
    <div class="metrics-grid">
      <div class="stats-cards-wrapper" v-if="stats">
        <!-- Total Projects -->
        <div class="dashboard-card stat-card">
          <span class="stat-label">{{ $t('portfolio.totalProjects') }}</span>
          <div class="stat-value-group">
            <span class="stat-value">{{ stats.totalProjects }}</span>
            <span class="stat-trend trend-up">
              <i class="pi pi-arrow-up"></i> {{ stats.trend }}%
            </span>
          </div>
          <div class="card-progress-bar">
            <div class="progress-fill fill-success" :style="{ width: '80%' }"></div>
          </div>
        </div>

        <!-- On Track -->
        <div class="dashboard-card stat-card">
          <span class="stat-label">{{ $t('portfolio.onTrack') }}</span>
          <div class="stat-value-group">
            <span class="stat-value text-success">{{ stats.onTrack }}</span>
          </div>
          <div class="card-progress-bar">
            <div class="progress-fill fill-success" :style="{ width: (stats.onTrack / stats.totalProjects * 100) + '%' }"></div>
          </div>
        </div>

        <!-- At Risk -->
        <div class="dashboard-card stat-card risk-variant">
          <span class="stat-label">{{ $t('portfolio.atRisk') }}</span>
          <div class="stat-value-group">
            <span class="stat-value text-danger">{{ String(stats.atRisk).padStart(2, '0') }}</span>
            <span class="risk-indicator-icon"><i class="pi pi-exclamation-circle"></i></span>
          </div>
        </div>
      </div>

      <!-- Integrated AI Insights Card -->
      <div class="dashboard-card ai-insight-card">
        <div class="ai-card-header">
          <i class="pi pi-sparkles ai-spark-icon"></i>
          <span class="ai-card-title">{{ $t('portfolio.aiInsights') }}</span>
        </div>
        <p class="ai-card-description">{{ $t('portfolio.aiTextDesc') }}</p>
        <button class="ai-action-btn" @click="openAiInsightsDialog">Run Analysis</button>
      </div>
    </div>

    <!-- Bottom Section: Tasks and Schedule -->
    <div class="content-split-grid">
      <!-- Team Critical Tasks Panel -->
      <div class="dashboard-card data-section">
        <div class="section-top-bar">
          <h2 class="section-main-title">{{ $t('portfolio.teamPriorityTasks') }}</h2>
          <a href="#" class="section-action-link">{{ $t('home.viewAll') }}</a>
        </div>

        <div class="scrollable-task-list">
          <div v-for="task in priorityTasks" :key="task.id" class="custom-task-row">
            <div class="task-status-icon" :style="{ background: task.iconBg || '#e0e7ff' }">
              <i :class="task.icon || 'pi pi-tag'"></i>
            </div>
            <div class="task-core-details">
              <span class="task-main-text">{{ task.title }}</span>
              <span class="task-sub-text">{{ task.due }} • {{ task.team || task.department }}</span>
            </div>
            <div class="task-right-controls">
              <span
                  class="custom-priority-tag"
                  :class="task.priority === 'URGENT' || task.priority === 'CRITICAL' ? 'tag-critical' : 'tag-medium'"
              >
                {{ task.priority }}
              </span>
              <div class="avatar-stack">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" class="stacked-avatar" alt="Team member" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Corporate Schedule Panel -->
      <div class="dashboard-card side-schedule-section">
        <div class="section-top-bar">
          <h2 class="section-main-title">{{ $t('portfolio.calendar') }}</h2>
          <span class="current-schedule-date">Oct 24, 2023</span>
        </div>

        <div class="timeline-wrapper">
          <div v-for="item in scheduleItems" :key="item.time" class="timeline-row" :class="{ 'row-muted': !item.active }">
            <span class="timeline-time-label">{{ item.time }}</span>
            <div class="timeline-card-block" :class="{ 'block-highlighted': item.active }">
              <span class="block-event-title">{{ item.title }}</span>
              <span class="block-event-sub">{{ item.detail || item.location }}</span>
            </div>
          </div>
        </div>
        <button class="action-outline-btn">{{ $t('home.manageCalendar') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
   Vantage PMO - Global Styles
*/

.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc;
  padding: 4px;
}

.welcome-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.welcome-title {
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
  letter-spacing: -0.5px;
}
.welcome-sub {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}
.status-healthy {
  color: #16a34a;
  font-weight: 600;
}

.live-sync-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  padding: 6px 14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.pulse-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  position: relative;
}

.dashboard-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.04);
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 20px;
}
.stats-cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.stat-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
}
.risk-variant {
  border-left: 4px solid #ef4444;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.stat-value-group {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}
.text-success { color: #16a34a; }
.text-danger { color: #ef4444; }

.trend-up {
  font-size: 12px;
  color: #16a34a;
  font-weight: 600;
  background: #f0fdf4;
  padding: 2px 6px;
  border-radius: 4px;
}
.risk-indicator-icon {
  color: #ef4444;
  font-size: 20px;
}

.card-progress-bar {
  height: 6px;
  background: #f1f5f9;
  border-radius: 9999px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.4s ease;
}
.fill-success { background: #16a34a; }

.ai-insight-card {
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  padding: 20px;
  color: #ffffff;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
}
.ai-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ai-spark-icon {
  font-size: 18px;
  color: #93c5fd;
}
.ai-card-title {
  font-weight: 700;
  font-size: 15px;
  letter-spacing: -0.2px;
}
.ai-card-description {
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  color: #bfdbfe;
}
.ai-action-btn {
  background: #ffffff;
  color: #2563eb;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}
.ai-action-btn:hover {
  background-color: #f8fafc;
}
.ai-action-btn:active {
  transform: scale(0.98);
}

.content-split-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
}
.data-section {
  padding: 24px;
  display: flex;
  flex-direction: column;
}
.side-schedule-section {
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
}

.section-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.section-main-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}
.section-action-link {
  font-size: 13px;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
}
.section-action-link:hover {
  text-decoration: underline;
}

.scrollable-task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.custom-task-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  transition: background-color 0.15s ease;
}
.custom-task-row:hover {
  background: #f1f5f9;
}
.task-status-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #475569;
  flex-shrink: 0;
}
.task-core-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.task-main-text {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}
.task-sub-text {
  font-size: 12px;
  color: #64748b;
}

.task-right-controls {
  display: flex;
  align-items: center;
  gap: 14px;
}
.custom-priority-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: 0.03em;
}
.tag-critical {
  background: #fee2e2;
  color: #ef4444;
}
.tag-medium {
  background: #e0e7ff;
  color: #4f46e5;
}
.avatar-stack {
  display: flex;
  align-items: center;
}
.stacked-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  background: #dbeafe;
}

.current-schedule-date {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}
.timeline-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.timeline-row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}
.timeline-time-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  width: 45px;
  flex-shrink: 0;
  padding-top: 4px;
  text-align: right;
}
.timeline-card-block {
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  background: #f8fafc;
  border-left: 3px solid #cbd5e1;
}
.block-highlighted {
  background: #eff6ff;
  border-left-color: #2563eb;
}
.block-event-title {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  display: block;
  margin-bottom: 2px;
}
.block-event-sub {
  font-size: 12px;
  color: #64748b;
  display: block;
}
.row-muted {
  opacity: 0.6;
}

.action-outline-btn {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.action-outline-btn:hover {
  background: #f8fafc;
  color: #0f172a;
}

/*
   Media Queries
*/

@media (max-width: 1200px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  .ai-insight-card {
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }
  .ai-action-btn {
    white-space: nowrap;
  }
}

@media (max-width: 992px) {
  .content-split-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .welcome-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .stats-cards-wrapper {
    grid-template-columns: 1fr;
  }
  .ai-insight-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .ai-action-btn {
    width: 100%;
  }
  .custom-task-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .task-right-controls {
    width: 100%;
    justify-content: space-between;
  }
}
</style>