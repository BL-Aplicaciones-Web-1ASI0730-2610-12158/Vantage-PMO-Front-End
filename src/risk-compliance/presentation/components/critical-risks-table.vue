<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useTaskCollaborationStore } from '../../../task-collaboration/application/task-collaboration.store.js';

const { t } = useI18n();
const router = useRouter();
const taskStore = useTaskCollaborationStore();

const props = defineProps({ risks: { type: Array, required: true } });
const emit = defineEmits(['export-pdf', 'bulk-audit']);

/* ── Action-Plan Dialog ───────────────────────────────────── */
const showDialog = ref(false);
const selectedRisk = ref(null);
const taskForm = ref({ title: '', description: '', priority: 'High', assignee: '' });
const saving = ref(false);
const saved  = ref(false);

function openActionPlan(risk) {
  selectedRisk.value = risk;
  taskForm.value = {
    title: `[${risk.riskId}] Action Plan: ${risk.description.slice(0, 60)}`,
    description: risk.description,
    priority: risk.severity === 'CRITICAL' ? 'Critical' : risk.severity === 'HIGH' ? 'High' : 'Medium',
    assignee: risk.flaggedBy,
  };
  showDialog.value = true;
}

async function submitTask() {
  saving.value = true;
  try {
    await taskStore.fetchBoards();
    await taskStore.createTask({
      title:       taskForm.value.title,
      description: taskForm.value.description,
      priority:    taskForm.value.priority,
      assignee:    taskForm.value.assignee,
      status:      'To Do',
      completed:   false,
      dueDate:     '',
      progress:    0,
    });
    saved.value = true;
    setTimeout(() => {
      showDialog.value = false;
      saved.value = false;
    }, 1400);
  } finally {
    saving.value = false;
  }
}

function goToTasks() {
  showDialog.value = false;
  router.push({ name: 'team' });
}

const severityClass = sev => ({
  CRITICAL: 'badge--critical', HIGH: 'badge--high',
  MEDIUM:   'badge--medium',   LOW:  'badge--low',
}[sev] ?? 'badge--low');
</script>

<template>
  <div class="crt">
    <!-- Toolbar -->
    <div class="crt__toolbar">
      <div>
        <h2 class="crt__title">{{ t('riskCompliance.table.title') }}</h2>
        <p  class="crt__sub">{{ t('riskCompliance.table.subtitle') }}</p>
      </div>
      <div class="crt__actions">
        <button class="crt__btn crt__btn--outline" @click="emit('export-pdf')">
          <i class="pi pi-file-export" /> {{ t('riskCompliance.table.exportPdf') }}
        </button>
        <button class="crt__btn crt__btn--outline" @click="emit('bulk-audit')">
          <i class="pi pi-check-square" /> {{ t('riskCompliance.table.bulkAudit') }}
        </button>
      </div>
    </div>

    <!-- Column headers -->
    <div class="crt__head">
      <span>{{ t('riskCompliance.table.colRiskId') }}</span>
      <span>{{ t('riskCompliance.table.colDescription') }}</span>
      <span>{{ t('riskCompliance.table.colAuditTrail') }}</span>
      <span>{{ t('riskCompliance.table.colFlaggedBy') }}</span>
      <span>{{ t('riskCompliance.table.colActions') }}</span>
    </div>

    <!-- Rows -->
    <div class="crt__body">
      <div v-for="risk in risks" :key="risk.id" class="crt__row">
        <div class="crt__cell crt__cell--id">
          <span class="crt__risk-id">{{ risk.riskId }}</span>
          <span :class="['badge', severityClass(risk.severity)]">{{ risk.severity }}</span>
        </div>
        <div class="crt__cell">
          <p class="crt__desc">{{ risk.description }}</p>
        </div>
        <div class="crt__cell">
          <p class="crt__audit-trail">{{ risk.auditTrail }}</p>
          <span class="crt__control-log">{{ risk.controlLog }}</span>
        </div>
        <div class="crt__cell">
          <span class="crt__flagged-by">{{ risk.flaggedBy }}</span>
          <span class="crt__days">{{ risk.daysOpen }}d {{ t('riskCompliance.table.daysOpen') }}</span>
        </div>
        <div class="crt__cell crt__cell--action">
          <button
            :class="['crt__action-btn', risk.hasActionPlan ? 'crt__action-btn--plan' : 'crt__action-btn--new']"
            @click="openActionPlan(risk)"
          >
            <i class="pi pi-clipboard" />
            {{ risk.hasActionPlan ? t('riskCompliance.table.actionPlan') : t('riskCompliance.table.actionNew') }}
          </button>
        </div>
      </div>
      <div v-if="!risks.length" class="crt__empty">{{ t('riskCompliance.table.noRisks') }}</div>
    </div>

    <!-- ── Action Plan Dialog ─────────────────────────────────── -->
    <Teleport to="body">
      <div v-if="showDialog" class="ap-overlay" @click.self="showDialog = false">
        <div class="ap-dialog">
          <div class="ap-dialog__header">
            <div>
              <h3 class="ap-dialog__title">{{ t('riskCompliance.actionPlan.title') }}</h3>
              <p class="ap-dialog__sub">
                <span :class="['badge', severityClass(selectedRisk?.severity)]">{{ selectedRisk?.severity }}</span>
                {{ selectedRisk?.riskId }}
              </p>
            </div>
            <button class="ap-dialog__close" @click="showDialog = false">
              <i class="pi pi-times" />
            </button>
          </div>

          <!-- Success state -->
          <div v-if="saved" class="ap-dialog__success">
            <i class="pi pi-check-circle ap-dialog__success-icon" />
            <p>{{ t('riskCompliance.actionPlan.taskCreated') }}</p>
            <button class="ap-dialog__go-btn" @click="goToTasks">
              {{ t('riskCompliance.actionPlan.viewInBoard') }}
              <i class="pi pi-arrow-right" />
            </button>
          </div>

          <!-- Form -->
          <template v-else>
            <div class="ap-dialog__body">
              <div class="ap-field">
                <label class="ap-field__label">{{ t('riskCompliance.actionPlan.taskTitle') }}</label>
                <input v-model="taskForm.title" class="ap-field__input" />
              </div>
              <div class="ap-field">
                <label class="ap-field__label">{{ t('riskCompliance.actionPlan.description') }}</label>
                <textarea v-model="taskForm.description" class="ap-field__textarea" rows="3" />
              </div>
              <div class="ap-field-row">
                <div class="ap-field">
                  <label class="ap-field__label">{{ t('riskCompliance.actionPlan.priority') }}</label>
                  <select v-model="taskForm.priority" class="ap-field__select">
                    <option>Critical</option><option>High</option>
                    <option>Medium</option><option>Low</option>
                  </select>
                </div>
                <div class="ap-field">
                  <label class="ap-field__label">{{ t('riskCompliance.actionPlan.assignee') }}</label>
                  <input v-model="taskForm.assignee" class="ap-field__input" />
                </div>
              </div>
              <!-- Info: links to Task Collaboration BC -->
              <p class="ap-dialog__hint">
                <i class="pi pi-info-circle" />
                {{ t('riskCompliance.actionPlan.boardHint') }}
              </p>
            </div>
            <div class="ap-dialog__footer">
              <button class="ap-dialog__cancel" @click="showDialog = false">{{ t('riskCompliance.actionPlan.cancel') }}</button>
              <button class="ap-dialog__submit" :disabled="saving" @click="submitTask">
                <i v-if="saving" class="pi pi-spin pi-spinner" />
                <i v-else class="pi pi-plus" />
                {{ t('riskCompliance.actionPlan.createTask') }}
              </button>
            </div>
          </template>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* ── Table ───────────────────────────────────────────────── */
.crt { display: flex; flex-direction: column; gap: .75rem; }
.crt__toolbar { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: .75rem; }
.crt__title { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0; }
.crt__sub   { font-size: .75rem; color: var(--text-secondary); margin: .15rem 0 0; }
.crt__actions { display: flex; gap: .5rem; }
.crt__btn {
  display: flex; align-items: center; gap: .35rem;
  padding: .45rem .85rem; border-radius: 6px;
  font-size: .75rem; font-weight: 600; cursor: pointer;
}
.crt__btn--outline {
  background: transparent; border: 1px solid var(--border-color);
  color: var(--text-secondary); transition: background .15s;
}
.crt__btn--outline:hover { background: var(--hover-bg); color: var(--text-primary); }

.crt__head {
  display: grid; grid-template-columns: 110px 1fr 160px 120px 130px;
  gap: .5rem; padding: .4rem .75rem;
  background: var(--hover-bg); border-radius: 6px;
  font-size: .63rem; font-weight: 700; letter-spacing: .08em;
  text-transform: uppercase; color: var(--text-muted);
}
.crt__body { display: flex; flex-direction: column; gap: 4px; }
.crt__row {
  display: grid; grid-template-columns: 110px 1fr 160px 120px 130px;
  gap: .5rem; align-items: center; padding: .65rem .75rem;
  background: var(--bg-card); border-radius: 8px;
  border: 1px solid var(--border-color); transition: background .15s;
}
.crt__row:hover { background: var(--hover-bg); }
.crt__cell { display: flex; flex-direction: column; gap: 4px; }
.crt__cell--id { align-items: flex-start; }
.crt__cell--action { align-items: flex-start; }

.crt__risk-id    { font-size: .82rem; font-weight: 700; color: var(--text-primary); }
.crt__desc       { margin: 0; font-size: .73rem; color: var(--text-secondary); line-height: 1.4; }
.crt__audit-trail{ margin: 0; font-size: .73rem; color: var(--text-secondary); }
.crt__control-log{ font-size: .63rem; color: var(--text-muted); }
.crt__flagged-by { font-size: .73rem; color: var(--text-secondary); }
.crt__days       { font-size: .63rem; color: var(--text-muted); }

.badge {
  display: inline-flex; align-items: center; padding: 2px 8px;
  border-radius: 4px; font-size: .6rem; font-weight: 800;
  letter-spacing: .06em; text-transform: uppercase;
}
.badge--critical { background: rgba(220,38,38,.15);  color: #b91c1c; border: 1px solid rgba(220,38,38,.3); }
.badge--high     { background: rgba(234,88,12,.15);  color: #c2410c; border: 1px solid rgba(234,88,12,.3); }
.badge--medium   { background: rgba(217,119,6,.15);  color: #92400e; border: 1px solid rgba(217,119,6,.3); }
.badge--low      { background: rgba(22,163,74,.15);  color: #166534; border: 1px solid rgba(22,163,74,.3); }
.app-dark .badge--critical { color: #f87171; border-color: rgba(239,68,68,.3); background: rgba(239,68,68,.18); }
.app-dark .badge--high     { color: #fb923c; border-color: rgba(249,115,22,.3); background: rgba(249,115,22,.18); }
.app-dark .badge--medium   { color: #fbbf24; border-color: rgba(245,158,11,.3); background: rgba(245,158,11,.18); }
.app-dark .badge--low      { color: #4ade80; border-color: rgba(34,197,94,.3);  background: rgba(34,197,94,.18); }

.crt__action-btn {
  display: flex; align-items: center; gap: .3rem;
  padding: .38rem .7rem; border-radius: 5px; font-size: .72rem;
  font-weight: 700; cursor: pointer; border: none;
  white-space: nowrap; transition: filter .15s;
}
.crt__action-btn:hover { filter: brightness(1.1); }
.crt__action-btn--plan { background: #2563eb; color: #fff; }
.crt__action-btn--new  { background: transparent; border: 1px solid var(--border-color); color: var(--text-secondary); }

.crt__empty { text-align: center; padding: 1.5rem; color: var(--text-secondary); font-size: .85rem; }

/* ── Action Plan Dialog ──────────────────────────────────── */
.ap-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,.45); backdrop-filter: blur(2px);
  display: flex; align-items: center; justify-content: center; padding: 1rem;
}
.ap-dialog {
  background: var(--bg-card); border: 1px solid var(--border-color);
  border-radius: 14px; width: 100%; max-width: 520px;
  box-shadow: 0 20px 60px rgba(0,0,0,.25);
  animation: ap-in .18s ease;
}
@keyframes ap-in { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }

.ap-dialog__header {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 1.25rem 1.25rem .75rem; border-bottom: 1px solid var(--border-color);
}
.ap-dialog__title { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0 0 .3rem; }
.ap-dialog__sub   { display: flex; align-items: center; gap: .5rem; font-size: .78rem; color: var(--text-secondary); margin: 0; }
.ap-dialog__close {
  background: none; border: none; cursor: pointer; color: var(--text-muted);
  font-size: 1rem; padding: .25rem; border-radius: 4px;
  transition: background .15s; line-height: 1;
}
.ap-dialog__close:hover { background: var(--hover-bg); color: var(--text-primary); }

.ap-dialog__body { padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: .85rem; }
.ap-field { display: flex; flex-direction: column; gap: .3rem; }
.ap-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
.ap-field__label { font-size: .72rem; font-weight: 600; color: var(--text-secondary); }
.ap-field__input,
.ap-field__textarea,
.ap-field__select {
  padding: .5rem .7rem; border-radius: 7px;
  border: 1px solid var(--border-color); background: var(--bg-content);
  color: var(--text-primary); font-size: .8rem;
  outline: none; font-family: inherit;
  transition: border-color .15s;
}
.ap-field__input:focus,
.ap-field__textarea:focus,
.ap-field__select:focus { border-color: #2563eb; }
.ap-field__textarea { resize: vertical; }

.ap-dialog__hint {
  font-size: .7rem; color: var(--text-muted); margin: 0;
  display: flex; align-items: center; gap: .35rem;
}

.ap-dialog__footer {
  display: flex; justify-content: flex-end; gap: .6rem;
  padding: .75rem 1.25rem 1.25rem;
}
.ap-dialog__cancel {
  padding: .5rem 1rem; border-radius: 7px; border: 1px solid var(--border-color);
  background: transparent; color: var(--text-secondary); font-size: .8rem;
  cursor: pointer; transition: background .15s;
}
.ap-dialog__cancel:hover { background: var(--hover-bg); }
.ap-dialog__submit {
  display: flex; align-items: center; gap: .4rem;
  padding: .5rem 1.1rem; border-radius: 7px; border: none;
  background: #2563eb; color: #fff; font-size: .8rem; font-weight: 700;
  cursor: pointer; transition: background .15s;
}
.ap-dialog__submit:hover:not(:disabled) { background: #1d4ed8; }
.ap-dialog__submit:disabled { opacity: .65; cursor: not-allowed; }

.ap-dialog__success {
  padding: 2rem 1.25rem; display: flex; flex-direction: column;
  align-items: center; gap: .75rem; text-align: center;
}
.ap-dialog__success-icon { font-size: 2.5rem; color: #16a34a; }
.app-dark .ap-dialog__success-icon { color: #22c55e; }
.ap-dialog__success p { margin: 0; font-size: .9rem; color: var(--text-primary); font-weight: 600; }
.ap-dialog__go-btn {
  display: flex; align-items: center; gap: .4rem;
  padding: .5rem 1rem; border-radius: 7px; border: none;
  background: #2563eb; color: #fff; font-size: .8rem; font-weight: 700; cursor: pointer;
}
</style>

