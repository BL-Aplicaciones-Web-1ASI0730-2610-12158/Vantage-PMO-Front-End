<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useReportsStore } from '../../application/reports.store.js';
import ExportReportDialog from '../components/export-report-dialog.vue';

const { t } = useI18n();
const store = useReportsStore();

onMounted(() => store.fetchReports());

// ── Left-panel state ───────────────────────────────────────────────────────
const selectedProjectId = ref(null);
const selectedPeriod    = ref('Q3 FY24');
const customFrom        = ref('');
const customTo          = ref('');
const selectedType      = ref('Health & Risk Assessment');

const PERIODS    = ['Q1 FY24', 'Q2 FY24', 'Q3 FY24', 'Q4 FY24', 'Custom'];
const REPORT_TYPES = [
    { key: 'Health & Risk Assessment',       icon: 'pi-heart',         desc: t('reports.types.healthDesc')    },
    { key: 'Progress & Milestone Tracking',  icon: 'pi-chart-line',    desc: t('reports.types.progressDesc')  },
    { key: 'Financial & Resource Allocation',icon: 'pi-dollar',        desc: t('reports.types.financialDesc') },
];

const projectOptions = computed(() =>
    store.reports.map(r => ({ label: r.project, value: r.id }))
);

const selectedReport = computed(() =>
    selectedProjectId.value
        ? store.reports.find(r => r.id === selectedProjectId.value)
        : store.activeReport
);

// ── Velocity chart — data per report type ─────────────────────────────────
const CHART_CONFIGS = {
    'Health & Risk Assessment': {
        label:       'Portfolio Velocity Trend',
        sublabel:    'Last 90 Days Telemetry',
        barLabels:   ['Wk1', 'Wk2', 'Wk3', 'Wk4', 'Wk5', 'Wk6', 'Wk7'],
        // Goes up then slight plateau — healthy portfolio climbing
        values:      [42, 55, 48, 62, 70, 68, 80],
        colorUp:     '#3b82f6',
        colorUpDark: '#1d4ed8',
        colorDown:   '#fca5a5',
        colorDownDark:'#ef4444',
        yLabel:      'Velocity Score',
    },
    'Progress & Milestone Tracking': {
        label:       'Milestone Completion Rate',
        sublabel:    'Current Sprint Burndown',
        barLabels:   ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'],
        // Sprint burndown — steady completion curve
        values:      [88, 81, 74, 66, 55, 45, 30],
        colorUp:     '#a3e635',
        colorUpDark: '#65a30d',
        colorDown:   '#fde68a',
        colorDownDark:'#d97706',
        yLabel:      'Remaining Work (%)',
    },
    'Financial & Resource Allocation': {
        label:       'Budget Burn Rate',
        sublabel:    'Monthly vs Planned Spend',
        barLabels:   ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        // Budget spend — stays mostly under plan then spikes
        values:      [55, 60, 58, 63, 72, 80, 76],
        colorUp:     '#34d399',
        colorUpDark: '#059669',
        colorDown:   '#f87171',
        colorDownDark:'#dc2626',
        yLabel:      'Spend vs Plan (%)',
    },
};

const chartConfig = computed(() => CHART_CONFIGS[selectedType.value] ?? CHART_CONFIGS['Health & Risk Assessment']);

// When type changes, animate by resetting a key
const chartKey = ref(0);
watch(selectedType, () => { chartKey.value++; });

const activeVelocityTrend = computed(() => {
    // Use project-specific if available, else use type defaults
    if (selectedReport.value?.velocityTrend && selectedReport.value.velocityTrend.length) {
        return selectedReport.value.velocityTrend;
    }
    return chartConfig.value.values;
});

const chartTrend = computed(() => selectedReport.value?.healthTrend ?? 4.2);

function barHeight(val) {
    const maxVal = Math.max(...activeVelocityTrend.value, 1);
    return Math.round((val / maxVal) * 130);
}

function barColor(val, idx) {
    const len   = activeVelocityTrend.value.length;
    const isRecent = idx >= len - 2;
    if (chartTrend.value >= 0) return isRecent ? chartConfig.value.colorUpDark : chartConfig.value.colorUp;
    return isRecent ? chartConfig.value.colorDownDark : chartConfig.value.colorDown;
}

// ── KPI overrides per report type ──────────────────────────────────────────
const kpiConfig = computed(() => {
    const r = selectedReport.value;
    if (selectedType.value === 'Progress & Milestone Tracking') {
        return {
            kpi1Label: t('reports.kpi.milestonesCompleted'),
            kpi1Value: `${r?.completion ?? 78}%`,
            kpi1Color: healthColor(r?.completion ?? 78),
            kpi1Trend: `+${Math.abs(r?.healthTrend ?? 4.2)}% vs last sprint`,
            kpi1Up:    (r?.healthTrend ?? 4.2) >= 0,
            kpi2Label: t('reports.kpi.openMilestones'),
            kpi2Value: String(r?.activeRisks ?? 12),
            kpi2Sub:   `${r?.criticalRisks ?? 2} ${t('reports.overdue')} · ${r?.minorRisks ?? 10} ${t('reports.onTrack')}`,
            kpi3Label: t('reports.kpi.scheduleVariance'),
            kpi3Value: `${(r?.budgetVariance ?? -1.2) >= 0 ? '+' : ''}${r?.budgetVariance ?? -1.2}d`,
            kpi3Sub:   (r?.budgetVariance ?? -1.2) >= 0 ? t('reports.aheadSchedule') : t('reports.behindSchedule'),
            kpi3Up:    (r?.budgetVariance ?? -1.2) >= 0,
        };
    }
    if (selectedType.value === 'Financial & Resource Allocation') {
        return {
            kpi1Label: t('reports.kpi.budgetUtilization'),
            kpi1Value: `${r?.aggregateHealth ?? 88.4}%`,
            kpi1Color: healthColor(r?.aggregateHealth ?? 88.4),
            kpi1Trend: `${(r?.healthTrend ?? 4.2) >= 0 ? '+' : ''}${r?.healthTrend ?? 4.2}% vs Q2`,
            kpi1Up:    (r?.healthTrend ?? 4.2) >= 0,
            kpi2Label: t('reports.kpi.openPOs'),
            kpi2Value: String(r?.activeRisks ?? 12),
            kpi2Sub:   `${r?.criticalRisks ?? 2} ${t('reports.blocked')} · ${r?.minorRisks ?? 10} ${t('reports.pending')}`,
            kpi3Label: t('reports.budgetVariance'),
            kpi3Value: `${(r?.budgetVariance ?? -1.2) >= 0 ? '+' : ''}$${Math.abs(r?.budgetVariance ?? 1.2)}M`,
            kpi3Sub:   (r?.budgetVariance ?? -1.2) >= 0 ? t('reports.budgetOver') : t('reports.budgetUnder'),
            kpi3Up:    (r?.budgetVariance ?? -1.2) >= 0,
        };
    }
    // Default: Health & Risk
    return {
        kpi1Label: t('reports.aggregateHealth'),
        kpi1Value: `${r?.aggregateHealth ?? 88.4}%`,
        kpi1Color: healthColor(r?.aggregateHealth ?? 88.4),
        kpi1Trend: `+${Math.abs(r?.healthTrend ?? 4.2)}% vs Q2`,
        kpi1Up:    (r?.healthTrend ?? 4.2) >= 0,
        kpi2Label: t('reports.activeRisks'),
        kpi2Value: String(r?.activeRisks ?? 12),
        kpi2Sub:   `${r?.criticalRisks ?? 2} ${t('reports.critical')} · ${r?.minorRisks ?? 10} ${t('reports.minor')}`,
        kpi3Label: t('reports.budgetVariance'),
        kpi3Value: `${(r?.budgetVariance ?? -1.2) >= 0 ? '+' : ''}$${Math.abs(r?.budgetVariance ?? 1.2)}M`,
        kpi3Sub:   (r?.budgetVariance ?? -1.2) >= 0 ? t('reports.budgetOver') : t('reports.budgetUnder'),
        kpi3Up:    (r?.budgetVariance ?? -1.2) >= 0,
    };
});

// ── Status helpers ─────────────────────────────────────────────────────────
function statusBadgeClass(status) {
    return {
        Healthy:  'badge-healthy',
        Warning:  'badge-warning',
        Critical: 'badge-critical',
    }[status] ?? 'badge-warning';
}
function healthColor(pct) {
    if (pct >= 80) return '#22c55e';
    if (pct >= 60) return '#f59e0b';
    return '#ef4444';
}
function progressBarColor(pct) {
    if (pct >= 70) return '#22c55e';
    if (pct >= 40) return '#f59e0b';
    return '#ef4444';
}

// ── Actions ────────────────────────────────────────────────────────────────
const showExportDialog = ref(false);

async function onGenerate() {
    const id = selectedReport.value?.id ?? store.reports[0]?.id;
    if (id) await store.generatePreview(id);
}

function onDownloadPdf() {
    showExportDialog.value = true;
}
function onShare() {
    alert(t('reports.shareAlert'));
}
</script>

<template>
  <div class="rp-page">

    <!-- ══ TOP BAR ══════════════════════════════════════════════════════════ -->
    <div class="rp-topbar">
      <div>
        <h1 class="rp-title">{{ t('reports.title') }}</h1>
        <p class="rp-subtitle">{{ t('reports.subtitle') }}</p>
      </div>
    </div>

    <div v-if="store.loading" class="rp-loading">
      <i class="pi pi-spin pi-spinner" style="font-size:2rem" />
    </div>

    <div v-else class="rp-body">

      <!-- ══ LEFT — Parameters Panel ════════════════════════════════════════ -->
      <div class="rp-left">

        <!-- Project range -->
        <div class="rp-field">
          <label class="rp-label">{{ t('reports.projectRange') }}</label>
          <pv-select
              v-model="selectedProjectId"
              :options="projectOptions"
              optionLabel="label" optionValue="value"
              :placeholder="t('reports.allActiveInitiatives')"
              class="w-full"
              showClear
          />
        </div>

        <!-- Date period -->
        <div class="rp-field">
          <label class="rp-label">{{ t('reports.datePeriod') }}</label>
          <div class="rp-periods">
            <button
                v-for="p in PERIODS" :key="p"
                :class="['rp-period-btn', { 'rp-period-active': selectedPeriod === p }]"
                @click="selectedPeriod = p"
            >{{ p }}</button>
          </div>
          <div v-if="selectedPeriod === 'Custom'" class="rp-custom-dates">
            <input type="date" v-model="customFrom" class="rp-date-input" />
            <span class="rp-date-sep">→</span>
            <input type="date" v-model="customTo"   class="rp-date-input" />
          </div>
        </div>

        <!-- Report type -->
        <div class="rp-field">
          <label class="rp-label">{{ t('reports.reportType') }}</label>
          <div class="rp-types">
            <div
                v-for="rt in REPORT_TYPES" :key="rt.key"
                :class="['rp-type-card', { 'rp-type-active': selectedType === rt.key }]"
                @click="selectedType = rt.key"
            >
              <div class="rp-type-radio">
                <span :class="['rp-radio-dot', { 'rp-radio-on': selectedType === rt.key }]" />
              </div>
              <div class="rp-type-info">
                <span class="rp-type-name">{{ t(`reports.types.${rt.key.replace(/ & /g,'And').replace(/ /g,'').charAt(0).toLowerCase() + rt.key.replace(/ & /g,'And').replace(/ /g,'').slice(1)}`) }}</span>
                <span class="rp-type-desc">{{ rt.desc }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Generate -->
        <pv-button
            :label="store.generating ? t('reports.generating') : t('reports.generatePreview')"
            :icon="store.generating ? 'pi pi-spin pi-spinner' : 'pi pi-bolt'"
            :disabled="store.generating"
            class="rp-gen-btn w-full"
            @click="onGenerate"
        />

        <!-- Export options -->
        <div class="rp-field rp-export-section">
          <label class="rp-label">{{ t('reports.exportOptions') }}</label>
          <button class="rp-export-btn" @click="onDownloadPdf">
            <i class="pi pi-file-pdf" style="color:#ef4444" />
            <span>{{ t('reports.downloadPdf') }}</span>
            <i class="pi pi-chevron-right rp-export-chevron" />
          </button>
          <button class="rp-export-btn" @click="onShare">
            <i class="pi pi-share-alt" style="color:#3b82f6" />
            <span>{{ t('reports.shareWithStakeholders') }}</span>
            <i class="pi pi-chevron-right rp-export-chevron" />
          </button>
        </div>

      </div>

      <!-- ══ RIGHT — Report Preview ══════════════════════════════════════════ -->
      <div class="rp-right">

        <!-- No preview yet -->
        <div v-if="!store.previewMode && !selectedReport" class="rp-empty">
          <i class="pi pi-chart-bar" style="font-size:3rem; color:#e5e7eb" />
          <p>{{ t('reports.selectToPreview') }}</p>
        </div>

        <!-- Preview card -->
        <div v-else class="rp-preview">

          <!-- Preview badge -->
          <div class="rp-preview-top">
            <span class="rp-preview-badge" v-if="store.previewMode">
              {{ t('reports.previewMode') }}
            </span>
            <span class="rp-preview-badge rp-preview-badge--draft" v-else>
              {{ t('reports.draft') }}
            </span>
            <button class="rp-print-btn" @click="onDownloadPdf">
              <i class="pi pi-print" />
            </button>
          </div>

          <!-- Executive title -->
          <div class="rp-exec-header">
            <h2 class="rp-exec-title">{{ t('reports.execTitle') }}</h2>
            <p class="rp-exec-sub">{{ selectedReport?.period ?? selectedPeriod }} {{ t('reports.performanceAnalysis') }} • {{ t('reports.confidential') }}</p>
          </div>

          <!-- KPI row -->
          <div class="rp-kpis">
            <div class="rp-kpi">
              <span class="rp-kpi-label">{{ kpiConfig.kpi1Label }}</span>
              <span class="rp-kpi-value" :style="{ color: kpiConfig.kpi1Color }">
                {{ kpiConfig.kpi1Value }}
              </span>
              <span class="rp-kpi-trend" :class="kpiConfig.kpi1Up ? 'trend-up' : 'trend-down'">
                <i :class="['pi', kpiConfig.kpi1Up ? 'pi-arrow-up' : 'pi-arrow-down']" />
                {{ kpiConfig.kpi1Trend }}
              </span>
            </div>
            <div class="rp-kpi-divider" />
            <div class="rp-kpi">
              <span class="rp-kpi-label">{{ kpiConfig.kpi2Label }}</span>
              <span class="rp-kpi-value" style="color:#111827">{{ kpiConfig.kpi2Value }}</span>
              <span class="rp-kpi-sub">{{ kpiConfig.kpi2Sub }}</span>
            </div>
            <div class="rp-kpi-divider" />
            <div class="rp-kpi">
              <span class="rp-kpi-label">{{ kpiConfig.kpi3Label }}</span>
              <span class="rp-kpi-value" :class="kpiConfig.kpi3Up ? 'budget-ok' : 'budget-over'">
                {{ kpiConfig.kpi3Value }}
              </span>
              <span class="rp-kpi-sub" :class="kpiConfig.kpi3Up ? 'trend-up' : 'trend-down'">
                {{ kpiConfig.kpi3Sub }}
              </span>
            </div>
          </div>

          <!-- Velocity chart -->
          <div class="rp-section">
            <div class="rp-section-head">
              <span class="rp-section-title">{{ chartConfig.label }}</span>
              <span class="rp-section-sub">{{ chartConfig.sublabel }}</span>
            </div>
            <div class="rp-chart" :key="chartKey">
              <div
                  v-for="(val, idx) in activeVelocityTrend"
                  :key="idx"
                  class="rp-bar-wrap"
              >
                <div
                    class="rp-bar"
                    :style="{
                      height: barHeight(val) + 'px',
                      background: barColor(val, idx)
                    }"
                    :title="`${chartConfig.barLabels[idx]}: ${val}`"
                />
                <span class="rp-bar-label">{{ chartConfig.barLabels[idx] }}</span>
              </div>
            </div>
          </div>

          <!-- Strategic initiative status -->
          <div class="rp-section">
            <div class="rp-section-head">
              <span class="rp-section-title">{{ t('reports.strategicInitiatives') }}</span>
            </div>
            <div class="rp-initiatives">
              <div
                  v-for="r in store.reports.slice(0, 4)" :key="r.id"
                  class="rp-initiative"
              >
                <div class="rp-initiative-label">{{ r.label }}</div>
                <div class="rp-initiative-body">
                  <div class="rp-initiative-top">
                    <span class="rp-initiative-name">{{ r.project }}</span>
                    <span :class="['rp-status-badge', statusBadgeClass(r.status)]">{{ t(`reports.status.${r.status}`) }}</span>
                  </div>
                  <span class="rp-initiative-lead">Lead: {{ r.manager }}</span>
                  <div class="rp-initiative-progress">
                    <div class="rp-prog-bar">
                      <div class="rp-prog-fill"
                           :style="{ width: r.completion + '%', background: progressBarColor(r.completion) }" />
                    </div>
                    <span class="rp-prog-pct">{{ r.completion }}% {{ t('reports.complete') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI insight -->
          <div class="rp-insight">
            <i class="pi pi-microchip-ai rp-insight-icon" />
            <blockquote class="rp-insight-text">
              "{{ selectedReport?.aiInsight ?? t('reports.defaultInsight') }}"
            </blockquote>
          </div>

          <!-- Footer -->
          <div class="rp-preview-footer">
            <div>
              <span class="rp-footer-label">{{ t('reports.generatedBy') }}</span>
              <span class="rp-footer-value">Vantage PMO</span>
            </div>
            <div>
              <span class="rp-footer-label">System ID: ARC-882-990-24</span>
            </div>
            <div class="rp-footer-bars">
              <span class="rp-fbar rp-fbar--gray" />
              <span class="rp-fbar rp-fbar--gray" />
              <span class="rp-fbar rp-fbar--blue" />
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>

  <ExportReportDialog
      v-model:visible="showExportDialog"
      :report="selectedReport"
      @export="() => {}"
  />
</template>

<style scoped>
.rp-page { display: flex; flex-direction: column; gap: 1.25rem; height: 100%; }

/* ── Top bar ───────────────────────────────────────────────────────────────── */
.rp-topbar { display: flex; justify-content: space-between; align-items: flex-start; }
.rp-title  { font-size: 1.6rem; font-weight: 800; margin: 0; color: #111827; }
.rp-subtitle { color: #6b7280; font-size: .9rem; margin: .2rem 0 0; }

.rp-loading { display: flex; justify-content: center; padding: 4rem; }

/* ── Body layout ───────────────────────────────────────────────────────────── */
.rp-body {
  display: flex;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;
}

/* ══ LEFT PANEL ══════════════════════════════════════════════════════════════ */
.rp-left {
  width: 270px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  height: fit-content;
}

.rp-field { display: flex; flex-direction: column; gap: .5rem; }
.rp-label {
  font-size: .68rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: .08em; color: #6b7280;
}

/* Periods */
.rp-periods { display: flex; flex-wrap: wrap; gap: .4rem; }
.rp-period-btn {
  background: #f1f5f9; border: 1.5px solid transparent;
  border-radius: 8px; padding: .35rem .75rem;
  font-size: .8rem; font-weight: 600; color: #475569;
  cursor: pointer; transition: all .15s;
}
.rp-period-btn:hover { background: #e2e8f0; }
.rp-period-active { background: #eff6ff !important; border-color: #3b82f6 !important; color: #1d4ed8 !important; }
.rp-custom-dates { display: flex; align-items: center; gap: .4rem; margin-top: .35rem; }
.rp-date-input { flex: 1; border: 1px solid #e5e7eb; border-radius: 6px; padding: .35rem .5rem; font-size: .78rem; outline: none; color: #374151; }
.rp-date-sep { color: #9ca3af; font-size: .9rem; }

/* Type cards */
.rp-types { display: flex; flex-direction: column; gap: .5rem; }
.rp-type-card {
  display: flex; align-items: flex-start; gap: .75rem;
  border: 1.5px solid #e5e7eb; border-radius: 10px; padding: .75rem;
  cursor: pointer; transition: all .15s;
}
.rp-type-card:hover { border-color: #93c5fd; background: #f8fafc; }
.rp-type-active { border-color: #3b82f6 !important; background: #eff6ff !important; }
.rp-type-radio { padding-top: .15rem; }
.rp-radio-dot {
  display: inline-block;
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid #d1d5db; background: transparent;
  transition: all .15s;
}
.rp-radio-on { border-color: #3b82f6; background: #3b82f6; box-shadow: 0 0 0 3px #bfdbfe; }
.rp-type-name { display: block; font-size: .83rem; font-weight: 700; color: #111827; }
.rp-type-desc { display: block; font-size: .73rem; color: #6b7280; line-height: 1.4; margin-top: .1rem; }

/* Generate button */
.rp-gen-btn {
  background: #1d4ed8 !important; border-color: #1d4ed8 !important;
  font-weight: 800 !important; font-size: .9rem !important;
  justify-content: center;
}

/* Export section */
.rp-export-section { border-top: 1px solid #f3f4f6; padding-top: 1rem; }
.rp-export-btn {
  display: flex; align-items: center; gap: .75rem;
  width: 100%; background: none; border: 1px solid #e5e7eb;
  border-radius: 10px; padding: .75rem 1rem;
  cursor: pointer; font-size: .85rem; font-weight: 600; color: #374151;
  transition: background .15s; margin-top: .4rem;
  text-align: left;
}
.rp-export-btn:hover { background: #f9fafb; }
.rp-export-chevron { margin-left: auto; color: #9ca3af; font-size: .75rem; }

/* ══ RIGHT PANEL ═════════════════════════════════════════════════════════════ */
.rp-right {
  flex: 1;
  overflow-y: auto;
}
.rp-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 1rem; height: 400px; background: #f9fafb; border-radius: 16px;
  color: #9ca3af; font-size: .95rem;
}

/* Preview card */
.rp-preview {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 2rem 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  box-shadow: 0 4px 24px rgba(0,0,0,.06);
}

.rp-preview-top { display: flex; justify-content: space-between; align-items: center; }
.rp-preview-badge {
  background: #3b82f6; color: #fff;
  font-size: .68rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
  border-radius: 6px; padding: 3px 10px;
}
.rp-preview-badge--draft { background: #9ca3af; }
.rp-print-btn {
  background: #f3f4f6; border: none; border-radius: 8px; padding: .4rem .6rem;
  cursor: pointer; color: #6b7280; font-size: .9rem;
}
.rp-print-btn:hover { background: #e5e7eb; }

/* Exec header */
.rp-exec-header { }
.rp-exec-title {
  font-size: 2rem; font-weight: 900; color: #111827; margin: 0;
  letter-spacing: -.02em; text-transform: uppercase; line-height: 1.1;
}
.rp-exec-sub { margin: .4rem 0 0; color: #6b7280; font-size: .88rem; }

/* KPIs */
.rp-kpis {
  display: flex;
  align-items: stretch;
  gap: 0;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}
.rp-kpi {
  flex: 1; padding: 1rem 1.5rem;
  display: flex; flex-direction: column; gap: .2rem;
}
.rp-kpi-divider { width: 1px; background: #e5e7eb; flex-shrink: 0; }
.rp-kpi-label { font-size: .68rem; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; color: #9ca3af; }
.rp-kpi-value { font-size: 1.9rem; font-weight: 900; line-height: 1.1; }
.rp-kpi-trend { display: flex; align-items: center; gap: .25rem; font-size: .75rem; font-weight: 600; }
.rp-kpi-sub   { font-size: .75rem; color: #6b7280; }
.trend-up   { color: #22c55e; }
.trend-down { color: #ef4444; }
.budget-ok  { color: #22c55e; }
.budget-over { color: #ef4444; }

/* Chart */
.rp-section { display: flex; flex-direction: column; gap: .75rem; }
.rp-section-head { display: flex; justify-content: space-between; align-items: center; }
.rp-section-title { font-size: .88rem; font-weight: 800; color: #111827; text-transform: uppercase; letter-spacing: .04em; }
.rp-section-sub   { font-size: .75rem; color: #9ca3af; }

.rp-chart {
  display: flex;
  align-items: flex-end;
  gap: .5rem;
  height: 160px;
  background: #f8fafc;
  border-radius: 10px;
  padding: 1rem 1rem .5rem;
  animation: chart-fade-in .4s ease;
}
@keyframes chart-fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0);   }
}
.rp-bar-wrap { display: flex; flex-direction: column; align-items: center; gap: .35rem; flex: 1; }
.rp-bar {
  width: 100%; border-radius: 6px 6px 0 0;
  transition: height .5s cubic-bezier(.4,0,.2,1), background .3s ease;
  min-height: 4px;
  animation: bar-grow .5s ease both;
}
@keyframes bar-grow {
  from { transform: scaleY(0); transform-origin: bottom; }
  to   { transform: scaleY(1); transform-origin: bottom; }
}
.rp-bar-label { font-size: .65rem; color: #9ca3af; font-weight: 600; }

/* Initiatives */
.rp-initiatives { display: flex; flex-direction: column; gap: .6rem; }
.rp-initiative {
  display: flex; align-items: flex-start; gap: 1rem;
  background: #f9fafb; border-radius: 10px; padding: .85rem 1rem;
  border: 1px solid #f3f4f6;
}
.rp-initiative-label {
  width: 32px; height: 32px; border-radius: 8px;
  background: #1d4ed8; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: .72rem; font-weight: 800; flex-shrink: 0;
}
.rp-initiative-body { flex: 1; display: flex; flex-direction: column; gap: .3rem; }
.rp-initiative-top  { display: flex; justify-content: space-between; align-items: center; gap: .5rem; }
.rp-initiative-name { font-size: .88rem; font-weight: 700; color: #111827; }
.rp-initiative-lead { font-size: .75rem; color: #6b7280; }
.rp-initiative-progress { display: flex; align-items: center; gap: .6rem; margin-top: .25rem; }
.rp-prog-bar  { flex: 1; height: 5px; background: #e5e7eb; border-radius: 99px; overflow: hidden; }
.rp-prog-fill { height: 100%; border-radius: 99px; transition: width .4s; }
.rp-prog-pct  { font-size: .73rem; font-weight: 700; color: #374151; white-space: nowrap; }

/* Status badges */
.rp-status-badge { font-size: .68rem; font-weight: 800; border-radius: 99px; padding: 2px 10px; white-space: nowrap; }
.badge-healthy  { background: #d1fae5; color: #065f46; }
.badge-warning  { background: #fef3c7; color: #92400e; }
.badge-critical { background: #fee2e2; color: #991b1b; }

/* AI insight */
.rp-insight {
  display: flex; gap: 1rem;
  background: #f8fafc; border-radius: 12px;
  padding: 1.25rem 1.5rem;
  border-left: 4px solid #3b82f6;
}
.rp-insight-icon { font-size: 1.3rem; color: #3b82f6; flex-shrink: 0; margin-top: .15rem; }
.rp-insight-text { font-size: .88rem; color: #374151; line-height: 1.65; margin: 0; font-style: italic; }

/* Footer */
.rp-preview-footer {
  display: flex; justify-content: space-between; align-items: center;
  border-top: 1px solid #f3f4f6; padding-top: 1rem;
}
.rp-footer-label { display: block; font-size: .65rem; color: #9ca3af; text-transform: uppercase; letter-spacing: .06em; }
.rp-footer-value { display: block; font-size: .78rem; font-weight: 700; color: #374151; }
.rp-footer-bars  { display: flex; gap: .35rem; align-items: center; }
.rp-fbar { display: inline-block; width: 24px; height: 4px; border-radius: 99px; }
.rp-fbar--gray { background: #e5e7eb; }
.rp-fbar--blue { background: #3b82f6; }

/* Scrollbar */
.rp-right::-webkit-scrollbar { width: 4px; }
.rp-right::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }

@media (max-width: 900px) {
  .rp-body { flex-direction: column; }
  .rp-left { width: 100%; }
  .rp-kpis { flex-direction: column; }
  .rp-kpi-divider { width: 100%; height: 1px; }
}
</style>

