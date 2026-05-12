<script setup>
import { onMounted, computed } from 'vue';
import { useDashboardStore } from '../../application/dashboard.store.js';
const store = useDashboardStore();

onMounted(() => store.fetchAll());

const priorityTasks = computed(() => store.tasks);
const scheduleItems = computed(() => store.schedule);
const departments   = computed(() => store.departments);
const stats         = computed(() => store.stats);
</script>

<template>
  <div class="home">
    <!-- Welcome Header -->
    <div class="welcome-row">
      <div>
        <h1 class="welcome-title">{{ $t('home.welcomeBack') }}</h1>
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

    <!-- Stats + AI Insights -->
    <div class="stats-row">
      <div class="stats-cards" v-if="stats">
        <div class="stat-card">
          <span class="stat-label">{{ $t('home.totalProjects') }}</span>
          <div class="stat-value-row">
            <span class="stat-value">{{ stats.totalProjects }}</span>
            <span class="stat-trend up"><i class="pi pi-arrow-up"></i> {{ stats.trend }}%</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-label">{{ $t('home.onTrack') }}</span>
          <div class="stat-value-row">
            <span class="stat-value green">{{ stats.onTrack }}</span>
          </div>
          <div class="progress-bar"><div class="progress-fill green-fill" :style="{ width: (stats.onTrack / stats.totalProjects * 100) + '%' }"></div></div>
        </div>
        <div class="stat-card at-risk">
          <span class="stat-label">{{ $t('home.atRisk') }}</span>
          <div class="stat-value-row">
            <span class="stat-value red">{{ String(stats.atRisk).padStart(2, '0') }}</span>
            <span class="risk-icon"><i class="pi pi-exclamation-circle"></i></span>
          </div>
        </div>
      </div>

      <!-- AI Insights -->
      <div class="ai-card">
        <div class="ai-header">
          <span class="ai-icon"><i class="pi pi-sparkles"></i></span>
          <span class="ai-title">{{ $t('home.aiInsights') }}</span>
        </div>
        <p class="ai-text">{{ $t('home.aiText') }}</p>
        <button class="apply-btn">{{ $t('home.applyOptimization') }}</button>
      </div>
    </div>

    <!-- Priority Tasks + Schedule -->
    <div class="mid-row">
      <!-- Priority Tasks -->
      <div class="tasks-section">
        <div class="section-header">
          <h2 class="section-title">{{ $t('home.priorityTasks') }}</h2>
          <a href="#" class="view-all">{{ $t('home.viewAll') }}</a>
        </div>
        <div class="task-list">
          <div v-for="task in priorityTasks" :key="task.id" class="task-card">
            <div class="task-icon" :style="{ background: task.iconBg }">
              <i :class="task.icon"></i>
            </div>
            <div class="task-info">
              <span class="task-title">{{ task.title }}</span>
              <span class="task-meta">{{ $t('home.assignedTo') }} {{ task.assignee }} • {{ task.department }}</span>
            </div>
            <div class="task-right">
              <span
                class="priority-badge"
                :class="task.priority === 'CRITICAL' ? 'critical' : 'medium'"
              >{{ task.priority }}</span>
              <div class="avatars">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=A" class="mini-avatar" />
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=B" class="mini-avatar" v-if="task.priority === 'CRITICAL'" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Schedule -->
      <div class="schedule-section">
        <div class="section-header">
          <h2 class="section-title">Schedule</h2>
          <span class="schedule-date">Oct 24, 2023</span>
        </div>
        <div class="schedule-list">
          <div v-for="item in scheduleItems" :key="item.time" class="schedule-item" :class="{ inactive: !item.active }">
            <span class="schedule-time">{{ item.time }}</span>
            <div class="schedule-block" :class="{ 'schedule-block-active': item.active }">
              <span class="schedule-event">{{ item.title }}</span>
              <span class="schedule-detail">{{ item.detail }}</span>
            </div>
          </div>
        </div>
        <button class="manage-cal-btn">{{ $t('home.manageCalendar') }}</button>
      </div>
    </div>

    <!-- Portfolio Velocity -->
    <div class="velocity-section">
      <h2 class="section-title">{{ $t('home.portfolioVelocity') }}</h2>
      <p class="velocity-sub">{{ $t('home.velocitySub') }}</p>
      <div class="velocity-content">
        <div class="velocity-chart">
          <div
            v-for="(h, i) in [30, 40, 50, 65, 80, 100, 90, 60, 45]"
            :key="i"
            class="bar"
            :class="{ 'bar-active': i === 6 }"
            :style="{ height: h + 'px' }"
          ></div>
        </div>
        <div class="velocity-stats">
          <div v-for="dept in departments" :key="dept.name" class="dept-row">
            <div class="dept-header">
              <span class="dept-name">{{ dept.name }}</span>
              <span class="dept-percent">{{ dept.percent }}%</span>
            </div>
            <div class="dept-bar">
              <div class="dept-fill" :style="{ width: dept.percent + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: 'Inter', sans-serif;
}

/* Welcome */
.welcome-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.welcome-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 6px;
}

.welcome-sub {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.healthy {
  color: #16a34a;
  font-weight: 600;
}

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
  white-space: nowrap;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  display: inline-block;
}

/* Stats */
.stats-row {
  display: flex;
  gap: 20px;
  align-items: stretch;
}

.stats-cards {
  display: flex;
  gap: 16px;
  flex: 1;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  flex: 1;
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.stat-value-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
}

.stat-value.green { color: #16a34a; }
.stat-value.red { color: #dc2626; }

.stat-trend.up {
  font-size: 12px;
  color: #16a34a;
  font-weight: 600;
}

.progress-bar {
  height: 4px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill.green-fill {
  height: 100%;
  background: #16a34a;
  border-radius: 4px;
}

.risk-icon { color: #dc2626; font-size: 18px; }

/* AI Card */
.ai-card {
  background: #2563eb;
  border-radius: 12px;
  padding: 20px;
  width: 240px;
  min-width: 240px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-icon {
  font-size: 18px;
}

.ai-title {
  font-weight: 700;
  font-size: 14px;
}

.ai-text {
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
  color: #dbeafe;
}

.ai-link {
  color: white;
  text-decoration: underline;
}

.apply-btn {
  background: white;
  color: #2563eb;
  border: none;
  border-radius: 8px;
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.apply-btn:hover { opacity: 0.9; }

/* Mid Row */
.mid-row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.tasks-section {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e9ecef;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.view-all {
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e9ecef;
}

.task-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: #475569;
  flex-shrink: 0;
}

.task-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.task-title {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.task-meta {
  font-size: 11px;
  color: #94a3b8;
}

.task-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.priority-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  letter-spacing: 0.5px;
}

.priority-badge.critical {
  background: #fee2e2;
  color: #dc2626;
}

.priority-badge.medium {
  background: #e0e7ff;
  color: #4338ca;
}

.avatars {
  display: flex;
}

.mini-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid white;
  margin-left: -6px;
  background: #dbeafe;
}

.mini-avatar:first-child { margin-left: 0; }

/* Schedule */
.schedule-section {
  width: 240px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-date {
  font-size: 12px;
  color: #94a3b8;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.schedule-item.inactive .schedule-event,
.schedule-item.inactive .schedule-detail {
  color: #94a3b8;
}

.schedule-time {
  font-size: 12px;
  color: #64748b;
  width: 38px;
  flex-shrink: 0;
  padding-top: 2px;
}

.schedule-block {
  flex: 1;
  padding: 8px 10px;
  border-radius: 8px;
  background: #f8fafc;
}

.schedule-block-active {
  background: #dbeafe;
}

.schedule-event {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  display: block;
}

.schedule-detail {
  font-size: 11px;
  color: #64748b;
  display: block;
}

.manage-cal-btn {
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  letter-spacing: 0.5px;
  width: 100%;
}

.manage-cal-btn:hover { background: #f1f5f9; }

/* Velocity */
.velocity-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e9ecef;
}

.velocity-sub {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0 20px;
}

.velocity-content {
  display: flex;
  gap: 40px;
  align-items: flex-end;
}

.velocity-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 100px;
}

.bar {
  width: 28px;
  background: #dbeafe;
  border-radius: 4px 4px 0 0;
  transition: background 0.2s;
}

.bar-active {
  background: #2563eb;
}

.velocity-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.dept-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.dept-header {
  display: flex;
  justify-content: space-between;
}

.dept-name {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.dept-percent {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.dept-bar {
  height: 5px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.dept-fill {
  height: 100%;
  background: #2563eb;
  border-radius: 4px;
}
</style>
