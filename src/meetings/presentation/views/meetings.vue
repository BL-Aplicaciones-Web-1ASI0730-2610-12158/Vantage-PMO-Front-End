<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeetingsStore } from '../../application/meetings.store.js';
import ScheduleMeetingDialog from '../components/schedule-meeting-dialog.vue';
import ExportMinutesDialog from '../components/export-minutes-dialog.vue';

const { t } = useI18n();
const store = useMeetingsStore();

onMounted(() => store.fetchMeetings());

const selected = ref(null);
const showScheduleDialog = ref(false);
const showExportDialog   = ref(false);

function onExportMinutes(payload) {
    alert(`Exporting ${payload.format} minutes for: ${selected.value?.title ?? 'All meetings'}`);
}

// Auto-select first meeting once loaded
const meetings = computed(() => store.meetings);
function selectFirst() {
    if (meetings.value.length && !selected.value) {
        selected.value = meetings.value[0];
    }
}
watch(meetings, selectFirst, { immediate: true });

async function onSchedule(payload) {
    const created = await store.scheduleMeeting(payload);
    if (created) selected.value = created;
}


// ── Helpers ──────────────────────────────────────────────────────────────────
function statusClass(status) {
    const m = { Active: 'status-active', Completed: 'status-completed', Upcoming: 'status-upcoming' };
    return m[status] ?? 'status-completed';
}
function typeSeverity(type) {
    const m = { Strategic: 'success', Review: 'info', Sync: 'warn', Workshop: 'secondary', Planning: 'contrast' };
    return m[type] ?? 'info';
}
function agreementIcon(tag) {
    return tag === 'Task' ? 'pi-list-check' : 'pi-shield';
}
function agreementIconBg(tag) {
    return tag === 'Task' ? '#ede9fe' : '#d1fae5';
}
function agreementIconColor(tag) {
    return tag === 'Task' ? '#7c3aed' : '#059669';
}
function avatarLetter(name) {
    return name ? name.charAt(0).toUpperCase() : '?';
}
function avatarColor(name) {
    const colors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899'];
    let hash = 0;
    for (const c of name) hash += c.charCodeAt(0);
    return colors[hash % colors.length];
}
function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}
function formatShortDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
</script>

<template>
  <div class="meetings-page">

    <!-- ── Top Bar ── -->
    <div class="meetings-topbar">
      <div class="topbar-left">
        <h1 class="meetings-title">{{ t('meetings.title') }}</h1>
        <p class="meetings-segment">{{ selected?.segment ?? '' }}</p>
      </div>
      <div class="topbar-actions">
        <pv-button
            :label="t('meetings.scheduleMeeting')"
            icon="pi pi-calendar-plus"
            severity="secondary"
            outlined
            @click="showScheduleDialog = true"
        />
        <pv-button
            :label="t('meetings.exportMinutes')"
            icon="pi pi-file-export"
            @click="showExportDialog = true"
        />
      </div>
    </div>

    <div v-if="store.loading" class="loading-state">
      <i class="pi pi-spin pi-spinner" style="font-size:2rem" />
    </div>

    <div v-else class="meetings-body">

      <!-- ══ LEFT PANEL — Session List ══ -->
      <div class="sessions-panel">
        <div class="sessions-header">
          <span class="sessions-label">{{ t('meetings.recentSessions') }}</span>
          <span class="sessions-count">{{ meetings.length }} {{ t('meetings.total') }}</span>
        </div>

        <div class="sessions-list">
          <div
              v-for="m in meetings"
              :key="m.id"
              :class="['session-card', { 'session-active': selected?.id === m.id }]"
              @click="selected = m"
          >
            <div class="session-meta">
              <span :class="['session-status', statusClass(m.status)]">
                {{ m.status === 'Active' ? t('meetings.activeSelection') : m.status.toUpperCase() }}
              </span>
              <span class="session-date">{{ formatShortDate(m.date) }}</span>
            </div>
            <div class="session-title">{{ m.title }}</div>

            <!-- Avatars -->
            <div class="session-avatars">
              <div
                  v-for="(att, i) in m.attendees.slice(0, 4)"
                  :key="i"
                  class="s-avatar"
                  :style="{ background: avatarColor(att), zIndex: 10 - i }"
                  :title="att"
              >{{ avatarLetter(att) }}</div>
              <div v-if="m.attendees.length > 4" class="s-avatar s-avatar-more">
                +{{ m.attendees.length - 4 }}
              </div>
            </div>

            <div class="session-footer">
              <span class="s-meta-item">
                <i class="pi pi-clock" />
                {{ m.duration }}m
              </span>
              <span class="s-meta-item">
                <i class="pi pi-check-square" />
                {{ m.agreements.length }} {{ t('meetings.agreements') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ RIGHT PANEL — Meeting Detail ══ -->
      <div v-if="selected" class="detail-panel">

        <!-- Meeting header -->
        <div class="detail-head">
          <div class="detail-head-left">
            <pv-tag :value="selected.type" :severity="typeSeverity(selected.type)" />
            <span class="detail-date">
              <i class="pi pi-calendar" />
              {{ formatDate(selected.date) }}
            </span>
          </div>
          <div class="detail-participants">
            <span class="participants-label">{{ t('meetings.participants') }}</span>
            <span class="participants-count">{{ String(selected.attendees.length).padStart(2,'0') }}</span>
          </div>
        </div>

        <h2 class="detail-title">{{ selected.title }}</h2>
        <p class="detail-desc">{{ selected.description }}</p>

        <!-- Session Minutes -->
        <div v-if="selected.minutes.length" class="section">
          <h3 class="section-title">{{ t('meetings.sessionMinutes') }}</h3>
          <div class="minutes-grid">
            <div v-for="min in selected.minutes" :key="min.id" class="minute-item">
              <span class="minute-time">{{ min.time }}</span>
              <div class="minute-body">
                <strong>{{ min.title }}:</strong> {{ min.body }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="selected.status === 'Upcoming' && !selected.minutes.length" class="empty-minutes">
          <i class="pi pi-clock" style="font-size:2rem; color:#d1d5db" />
          <p>{{ t('meetings.minutesPending') }}</p>
        </div>

        <!-- Decisions & Agreements -->
        <div v-if="selected.agreements.length" class="section">
          <div class="section-head">
            <h3 class="section-title">{{ t('meetings.decisionsAgreements') }}</h3>
            <span class="agreements-count-label">
              {{ selected.agreements.length }} {{ t('meetings.pointsOfConsensus') }}
            </span>
          </div>

          <div class="agreements-list">
            <div v-for="ag in selected.agreements" :key="ag.id" class="agreement-card">
              <div class="ag-icon" :style="{ background: agreementIconBg(ag.tag) }">
                <i :class="['pi', agreementIcon(ag.tag)]" :style="{ color: agreementIconColor(ag.tag) }" />
              </div>
              <div class="ag-body">
                <p :class="['ag-title', { 'ag-converted': ag.status === 'converted' }]">
                  {{ ag.title }}
                </p>
                <div class="ag-meta">
                  <span v-if="ag.owner"><i class="pi pi-user" /> {{ ag.owner }}</span>
                  <span v-if="ag.deadline"><i class="pi pi-clock" /> {{ t('meetings.deadline') }}: {{ ag.deadline }}</span>
                  <span v-if="ag.verified"><i class="pi pi-check-circle" /> {{ t('meetings.verifiedBy') }}: {{ ag.verified }}</span>
                  <span v-if="ag.note"><i class="pi pi-exclamation-triangle" /> {{ ag.note }}</span>
                </div>
              </div>
              <div class="ag-action">
                <template v-if="ag.status === 'converted'">
                  <span class="converted-badge">
                    <i class="pi pi-check-circle" style="color:#10b981" />
                    {{ t('meetings.convertedTo') }} {{ ag.taskRef }}
                  </span>
                  <pv-button text :label="t('meetings.viewTask')" size="small" />
                </template>
                <pv-button
                    v-else
                    :label="t('meetings.convertToTask')"
                    icon="pi pi-list-check"
                    size="small"
                    outlined
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Empty state -->
      <div v-else class="empty-detail">
        <i class="pi pi-calendar" style="font-size:3rem; color:#d1d5db" />
        <p>{{ t('meetings.selectSession') }}</p>
      </div>

    </div>
  </div>

  <!-- ── Schedule New Meeting Dialog ── -->
  <ScheduleMeetingDialog
      v-model:visible="showScheduleDialog"
      @schedule="onSchedule"
  />

  <ExportMinutesDialog
      v-model:visible="showExportDialog"
      :meeting="selected"
      @export="onExportMinutes"
  />
</template>

<style scoped>
/* ─── Page ─────────────────────────────────────────────────────────────── */
.meetings-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
  background: #f8fafc;
}

/* ─── Topbar ─────────────────────────────────────────────────────────────── */
.meetings-topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 2rem 1rem;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 1rem;
}
.meetings-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 .2rem;
}
.meetings-segment { color: #6b7280; margin: 0; font-size: .9rem; }
.topbar-actions { display: flex; gap: .75rem; align-items: center; }

.loading-state { display: flex; justify-content: center; padding: 4rem; }

/* ─── Body layout ─────────────────────────────────────────────────────────── */
.meetings-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  height: calc(100vh - 130px);
}

/* ══ LEFT PANEL ══ */
.sessions-panel {
  width: 300px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.sessions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem .75rem;
  border-bottom: 1px solid #f3f4f6;
}
.sessions-label { font-size: .7rem; font-weight: 800; color: #6b7280; text-transform: uppercase; letter-spacing: .08em; }
.sessions-count { font-size: .75rem; font-weight: 700; color: #fff; background: #3b82f6; border-radius: 99px; padding: 2px 8px; }

.sessions-list { flex: 1; overflow-y: auto; padding: .5rem; display: flex; flex-direction: column; gap: .25rem; }

.session-card {
  padding: .9rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background .15s;
  border: 1px solid transparent;
}
.session-card:hover { background: #f9fafb; }
.session-card.session-active {
  background: #eff6ff;
  border-color: #bfdbfe;
}
.session-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: .35rem; }
.session-status { font-size: .67rem; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }
.status-active   { color: #3b82f6; }
.status-completed { color: #6b7280; }
.status-upcoming  { color: #f59e0b; }
.session-date { font-size: .72rem; color: #9ca3af; }
.session-title { font-weight: 600; font-size: .9rem; color: #111827; margin-bottom: .6rem; line-height: 1.3; }
.session-avatars { display: flex; margin-bottom: .6rem; }
.s-avatar {
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .65rem; font-weight: 700; color: #fff;
  border: 2px solid #fff; margin-left: -6px;
}
.s-avatar:first-child { margin-left: 0; }
.s-avatar-more { background: #e5e7eb; color: #6b7280; font-size: .6rem; }
.session-footer { display: flex; gap: 1rem; }
.s-meta-item { display: flex; align-items: center; gap: .3rem; font-size: .75rem; color: #6b7280; }
.s-meta-item .pi { font-size: .7rem; }

/* ══ RIGHT PANEL ══ */
.detail-panel {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: .75rem;
}
.detail-head-left { display: flex; align-items: center; gap: 1rem; }
.detail-date { font-size: .88rem; color: #6b7280; display: flex; align-items: center; gap: .4rem; }
.detail-participants {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: .6rem 1.2rem;
  text-align: center;
}
.participants-label { display: block; font-size: .65rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: .06em; }
.participants-count { display: block; font-size: 1.8rem; font-weight: 800; color: #3b82f6; line-height: 1.1; }

.detail-title { font-size: 1.6rem; font-weight: 700; color: #111827; margin: 0; line-height: 1.25; }
.detail-desc { color: #4b5563; font-size: .92rem; line-height: 1.6; margin: 0; }

/* ─── Sections ─────────────────────────────────────────────────────────────── */
.section { display: flex; flex-direction: column; gap: .75rem; }
.section-head { display: flex; justify-content: space-between; align-items: center; }
.section-title { font-size: 1rem; font-weight: 700; color: #111827; margin: 0; }
.agreements-count-label { font-size: .8rem; color: #6b7280; }

/* ─── Minutes grid ─────────────────────────────────────────────────────────── */
.minutes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .75rem;
}
.minute-item {
  display: flex;
  gap: .75rem;
  background: #f9fafb;
  border-radius: 8px;
  padding: .75rem 1rem;
}
.minute-time {
  font-weight: 800;
  color: #3b82f6;
  font-size: .88rem;
  min-width: 42px;
  flex-shrink: 0;
}
.minute-body { font-size: .86rem; color: #374151; line-height: 1.5; }
.minute-body strong { color: #111827; }

.empty-minutes {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .75rem;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 12px;
  color: #9ca3af;
}

/* ─── Agreements ─────────────────────────────────────────────────────────── */
.agreements-list { display: flex; flex-direction: column; gap: .6rem; }
.agreement-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  box-shadow: 0 1px 3px rgba(0,0,0,.04);
}
.ag-icon {
  width: 42px; height: 42px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; font-size: 1rem;
}
.ag-body { flex: 1; }
.ag-title { font-weight: 600; color: #111827; font-size: .9rem; margin: 0 0 .35rem; }
.ag-converted { text-decoration: line-through; color: #9ca3af; }
.ag-meta { display: flex; flex-wrap: wrap; gap: .75rem; font-size: .78rem; color: #6b7280; }
.ag-meta span { display: flex; align-items: center; gap: .3rem; }
.ag-meta .pi { font-size: .72rem; }
.ag-action { display: flex; flex-direction: column; align-items: flex-end; gap: .25rem; flex-shrink: 0; }
.converted-badge { display: flex; align-items: center; gap: .35rem; font-size: .78rem; color: #10b981; font-weight: 600; }

.empty-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #9ca3af;
}

/* ─── Scrollbar ─────────────────────────────────────────────────────────── */
.sessions-list::-webkit-scrollbar,
.detail-panel::-webkit-scrollbar { width: 4px; }
.sessions-list::-webkit-scrollbar-thumb,
.detail-panel::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }

@media (max-width: 768px) {
  .meetings-body { flex-direction: column; height: auto; }
  .sessions-panel { width: 100%; border-right: none; border-bottom: 1px solid #e5e7eb; max-height: 300px; }
  .minutes-grid { grid-template-columns: 1fr; }
}
</style>
