<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTaskCollaborationStore } from '../../application/task-collaboration.store.js';
import AddTaskDialog    from '../components/add-task-dialog.vue';
import ExportBoardDialog from '../components/export-board-dialog.vue';

const { t } = useI18n();
const store = useTaskCollaborationStore();

onMounted(async () => {
    await store.fetchBoards();
    if (store.activeBoardId) await store.fetchTasksByBoard(store.activeBoardId);
});

// ── Tabs ──────────────────────────────────────────────────────────────────────
const activeTab = ref('board');
const tabs = computed(() => [
    { key: 'board',   label: t('taskCollaboration.tabs.board')   },
    { key: 'heatmap', label: t('taskCollaboration.tabs.heatmap') },
]);

// ── Dialogs ───────────────────────────────────────────────────────────────────
const showAddTask    = ref(false);
const showExport     = ref(false);

// ── Filter / Sort ─────────────────────────────────────────────────────────────
const filterPriority = ref(null);
const filterAssignee = ref(null);
const sortBy         = ref(null);
const showFilters    = ref(false);

const PRIORITY_OPTIONS = ['URGENT', 'MEDIUM', 'LOW', 'NORMAL', 'CRITICAL REVIEW'];

const assigneeOptions = computed(() =>
    [...new Set(store.tasks.map(t => t.assignee).filter(Boolean))]
);

const filteredTasks = computed(() => {
    let list = store.tasks;
    if (filterPriority.value) list = list.filter(t => t.priority === filterPriority.value);
    if (filterAssignee.value) list = list.filter(t => t.assignee === filterAssignee.value);
    if (sortBy.value === 'priority') {
        const order = { URGENT: 0, 'CRITICAL REVIEW': 1, MEDIUM: 2, NORMAL: 3, LOW: 4 };
        list = [...list].sort((a, b) => (order[a.priority] ?? 9) - (order[b.priority] ?? 9));
    } else if (sortBy.value === 'assignee') {
        list = [...list].sort((a, b) => a.assignee.localeCompare(b.assignee));
    }
    return list;
});

// ── Kanban columns ─────────────────────────────────────────────────────────────
const COLUMNS = [
    { key: 'To Do',      label: () => t('taskCollaboration.columns.todo'),       color: '#6b7280', dot: '#6b7280' },
    { key: 'In Progress',label: () => t('taskCollaboration.columns.inProgress'), color: '#3b82f6', dot: '#3b82f6' },
    { key: 'Review',     label: () => t('taskCollaboration.columns.review'),     color: '#10b981', dot: '#10b981' },
    { key: 'To Fix',     label: () => t('taskCollaboration.columns.toFix'),      color: '#f59e0b', dot: '#f59e0b' },
    { key: 'Done',       label: () => t('taskCollaboration.columns.done'),       color: '#8b5cf6', dot: '#8b5cf6' },
];

function tasksForCol(colKey) {
    return filteredTasks.value.filter(t => t.status === colKey);
}

function onDragStart(event, task) {
    event.dataTransfer.setData('taskId', String(task.id));
}
async function onDrop(event, status) {
    const taskId = Number(event.dataTransfer.getData('taskId'));
    const task   = store.tasks.find(t => t.id === taskId);
    if (task) await store.moveTask(task, status);
}

async function handleCreateTask(data) {
    await store.createTask(data);
}

// ── Heatmap ───────────────────────────────────────────────────────────────────
const DAYS  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKS = [1, 2, 3, 4];

const assignees = computed(() =>
    [...new Set(store.tasks.map(t => t.assignee).filter(Boolean))]
);

function activityLevel(assignee, week, dayIdx) {
    let hash = 0;
    const str = `${assignee}-${week}-${dayIdx}`;
    for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
    const base = hash % 5;
    const done = store.tasks.filter(t => t.assignee === assignee && t.completed).length;
    return Math.min(4, base + (done > 2 ? 1 : 0));
}
function heatColor(level) {
    return ['#ebedf0','#c6e48b','#7bc96f','#239a3b','#196127'][level] ?? '#ebedf0';
}
function heatLabel(level) {
    return [
        t('taskCollaboration.heatmap.noActivity'),
        t('taskCollaboration.heatmap.low'),
        t('taskCollaboration.heatmap.medium'),
        t('taskCollaboration.heatmap.high'),
        t('taskCollaboration.heatmap.veryHigh'),
    ][level] ?? '';
}
function memberTaskCount(m) { return store.tasks.filter(t => t.assignee === m).length; }
function memberDoneCount(m) { return store.tasks.filter(t => t.assignee === m && t.completed).length; }

// ── Helpers ───────────────────────────────────────────────────────────────────
function avatarLetter(name) { return name ? name.charAt(0).toUpperCase() : '?'; }
function avatarColor(name) {
    const colors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899'];
    let hash = 0;
    for (const c of (name ?? '')) hash += c.charCodeAt(0);
    return colors[hash % colors.length];
}
function statusColor(s) { return { online:'#22c55e', busy:'#f59e0b', offline:'#9ca3af' }[s] ?? '#9ca3af'; }
</script>

<template>
  <div class="tc-page">

    <!-- ══ BOARD SELECTOR ═════════════════════════════════════════════════════ -->
    <div class="boards-bar">
      <div
          v-for="board in store.boards" :key="board.id"
          :class="['board-chip', { 'board-chip--active': store.activeBoardId === board.id }]"
          @click="store.selectBoard(board.id)"
      >
        <span class="board-chip-dot" />
        {{ board.name }}
        <span class="board-chip-count">{{ board.projectsActive }}</span>
      </div>
    </div>

    <!-- ══ HEADER ════════════════════════════════════════════════════════════ -->
    <div class="tc-header">
      <div class="tc-header-left">
        <div>
          <h1 class="tc-title">{{ store.activeBoard?.name ?? t('taskCollaboration.title') }}</h1>
          <div class="tc-meta">
            <!-- Members avatars -->
            <div class="tc-members">
              <div
                  v-for="m in store.members.slice(0, 6)" :key="m.id"
                  class="tc-avatar"
                  :style="{ background: m.color }"
                  :title="m.name + ' — ' + m.role"
              >
                {{ m.avatar }}
                <span class="tc-status-dot" :style="{ background: statusColor(m.status) }" />
              </div>
              <div v-if="store.members.length > 6" class="tc-avatar tc-avatar-more">
                +{{ store.members.length - 6 }}
              </div>
            </div>
            <span class="tc-projects-active">
              <i class="pi pi-circle-fill" style="color:#22c55e; font-size:.6rem" />
              {{ store.activeBoard?.projectsActive ?? 0 }} {{ t('taskCollaboration.projectsActive') }}
            </span>
          </div>
        </div>
      </div>

      <div class="tc-header-actions">
        <!-- Filter toggle -->
        <pv-button
            :label="t('taskCollaboration.filter')"
            icon="pi pi-filter"
            severity="secondary" outlined
            @click="showFilters = !showFilters"
        />
        <!-- Sort -->
        <pv-select
            v-model="sortBy"
            :options="[
              { label: t('taskCollaboration.sortBy.priority'), value: 'priority' },
              { label: t('taskCollaboration.sortBy.assignee'), value: 'assignee' },
            ]"
            optionLabel="label" optionValue="value"
            :placeholder="t('taskCollaboration.sort')"
            class="tc-sort-select"
        />
        <!-- Export -->
        <pv-button
            :label="t('taskCollaboration.exportReport')"
            icon="pi pi-file-export"
            @click="showExport = true"
        />
        <!-- Add task -->
        <pv-button
            icon="pi pi-plus"
            :label="t('taskCollaboration.addTask.create')"
            @click="showAddTask = true"
            class="tc-add-btn"
        />
      </div>
    </div>

    <!-- Filter panel -->
    <div v-if="showFilters" class="tc-filters">
      <pv-select
          v-model="filterPriority"
          :options="PRIORITY_OPTIONS"
          :placeholder="t('taskCollaboration.filterByPriority')"
          showClear
          class="tc-filter-select"
      />
      <pv-select
          v-model="filterAssignee"
          :options="assigneeOptions"
          :placeholder="t('taskCollaboration.filterByAssignee')"
          showClear
          class="tc-filter-select"
      />
      <pv-button
          :label="t('taskCollaboration.clearFilters')"
          text size="small"
          @click="filterPriority = null; filterAssignee = null; sortBy = null"
      />
    </div>

    <!-- ── Tabs ─────────────────────────────────────────────────────────────── -->
    <div class="tc-tabs">
      <button
          v-for="tab in tabs" :key="tab.key"
          :class="['tc-tab', { 'tc-tab--active': activeTab === tab.key }]"
          @click="activeTab = tab.key"
      >{{ tab.label }}</button>
    </div>

    <div v-if="store.loading" class="tc-loading">
      <i class="pi pi-spin pi-spinner" style="font-size:2rem" />
    </div>

    <!-- ══ BOARD TAB ═════════════════════════════════════════════════════════ -->
    <div v-else-if="activeTab === 'board'" class="kanban-wrap">
      <div class="kanban-board">
        <div
            v-for="col in COLUMNS" :key="col.key"
            class="kanban-col"
            @dragover.prevent
            @drop="onDrop($event, col.key)"
        >
          <!-- Column header -->
          <div class="col-head">
            <div class="col-head-left">
              <span class="col-dot" :style="{ background: col.dot }" />
              <span class="col-title">{{ col.label() }}</span>
              <span class="col-count">{{ tasksForCol(col.key).length.toString().padStart(2,'0') }}</span>
            </div>
            <button class="col-add-btn" @click="showAddTask = true" title="Add task">
              <i class="pi pi-plus" />
            </button>
          </div>

          <!-- Task cards -->
          <div class="col-cards">
            <div
                v-for="task in tasksForCol(col.key)" :key="task.id"
                class="task-card"
                draggable="true"
                @dragstart="onDragStart($event, task)"
            >
              <!-- Card top: project + priority -->
              <div class="card-top">
                <span class="card-project">{{ task.project }}</span>
                <span
                    class="card-priority"
                    :style="{ color: task.priorityColor, background: task.priorityColor + '1a' }"
                >{{ task.priority }}</span>
              </div>

              <!-- Title -->
              <p class="card-title" :class="{ 'card-done': task.completed }">{{ task.title }}</p>

              <!-- Progress bar (if > 0) -->
              <div v-if="task.progress > 0" class="card-progress-wrap">
                <div class="card-progress-bar">
                  <div class="card-progress-fill" :style="{ width: task.progress + '%', background: col.color }" />
                </div>
                <span class="card-progress-label">{{ task.progress }}%</span>
              </div>

              <!-- Assignee + meta -->
              <div class="card-footer">
                <div class="card-assignee">
                  <div class="card-avatar" :style="{ background: task.assigneeColor || avatarColor(task.assignee) }">
                    {{ task.assigneeAvatar || avatarLetter(task.assignee) }}
                  </div>
                  <span class="card-assignee-name">{{ task.assignee }}</span>
                </div>
                <div class="card-meta">
                  <span v-if="task.comments" class="card-meta-item">
                    <i class="pi pi-comment" />{{ task.comments }}
                  </span>
                  <span v-if="task.attachments" class="card-meta-item">
                    <i class="pi pi-paperclip" />{{ task.attachments }}
                  </span>
                  <span v-if="task.dueDate" class="card-meta-item card-due">
                    <i class="pi pi-clock" />{{ task.dueDate }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Empty column placeholder -->
            <div v-if="!tasksForCol(col.key).length" class="col-empty">
              <i class="pi pi-inbox" style="font-size:1.5rem; color:#e5e7eb" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ HEATMAP TAB ═══════════════════════════════════════════════════════ -->
    <div v-else-if="activeTab === 'heatmap'" class="heatmap-section">
      <div class="hm-legend">
        <span class="hm-legend-label">{{ t('taskCollaboration.heatmap.less') }}</span>
        <div v-for="lvl in [0,1,2,3,4]" :key="lvl" class="hm-legend-cell"
             :style="{ background: heatColor(lvl) }" :title="heatLabel(lvl)" />
        <span class="hm-legend-label">{{ t('taskCollaboration.heatmap.more') }}</span>
      </div>

      <div v-if="assignees.length" class="hm-table-wrap">
        <table class="hm-table">
          <thead>
            <tr>
              <th class="hm-th-member">{{ t('taskCollaboration.heatmap.member') }}</th>
              <th v-for="day in DAYS" :key="day" class="hm-th-day">{{ day }}</th>
              <th class="hm-th-stat">{{ t('taskCollaboration.heatmap.tasks') }}</th>
              <th class="hm-th-stat">{{ t('taskCollaboration.heatmap.done') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, mIdx) in assignees" :key="mIdx" class="hm-row">
              <td class="hm-td-member">
                <div class="hm-member">
                  <div class="hm-avatar" :style="{ background: avatarColor(member) }">{{ avatarLetter(member) }}</div>
                  <span class="hm-member-name">{{ member }}</span>
                </div>
              </td>
              <td v-for="(day, dIdx) in DAYS" :key="day" class="hm-td-cell">
                <div class="hm-cells-col">
                  <div v-for="week in WEEKS" :key="week" class="hm-cell"
                       :style="{ background: heatColor(activityLevel(member, week, dIdx)) }"
                       :title="`W${week} ${day} — ${heatLabel(activityLevel(member, week, dIdx))}`" />
                </div>
              </td>
              <td class="hm-td-stat">{{ memberTaskCount(member) }}</td>
              <td class="hm-td-stat"><span class="hm-done-badge">{{ memberDoneCount(member) }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="hm-empty">
        <i class="pi pi-users" style="font-size:2.5rem; color:#d1d5db" />
        <p>{{ t('taskCollaboration.heatmap.noData') }}</p>
      </div>
    </div>

  </div>

  <!-- Dialogs -->
  <AddTaskDialog    v-model:visible="showAddTask" @create="handleCreateTask" />
  <ExportBoardDialog v-model:visible="showExport" :board="store.activeBoard" />
</template>

<style scoped>
.tc-page { display: flex; flex-direction: column; gap: 1rem; }

/* ── Board selector bar ──────────────────────────────────────────────────── */
.boards-bar {
  display: flex; gap: .6rem; flex-wrap: wrap;
  padding-bottom: .5rem;
  border-bottom: 1px solid #e5e7eb;
}
.board-chip {
  display: flex; align-items: center; gap: .5rem;
  background: #f1f5f9; border: 1.5px solid transparent;
  border-radius: 99px; padding: .35rem 1rem;
  font-size: .82rem; font-weight: 600; color: #475569;
  cursor: pointer; transition: all .15s;
}
.board-chip:hover { background: #e2e8f0; }
.board-chip--active { background: #eff6ff; border-color: #3b82f6; color: #1d4ed8; }
.board-chip-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.board-chip-count {
  background: #3b82f6; color: #fff;
  font-size: .68rem; font-weight: 800;
  border-radius: 99px; padding: 1px 7px;
}
.board-chip--active .board-chip-count { background: #1d4ed8; }

/* ── Header ──────────────────────────────────────────────────────────────── */
.tc-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; }
.tc-header-left { display: flex; flex-direction: column; gap: .5rem; }
.tc-title { font-size: 1.6rem; font-weight: 800; margin: 0; color: #111827; }
.tc-meta  { display: flex; align-items: center; gap: 1rem; }
.tc-members { display: flex; }
.tc-avatar {
  width: 30px; height: 30px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .7rem; font-weight: 700; color: #fff;
  border: 2px solid #fff; margin-left: -6px;
  position: relative; cursor: default;
}
.tc-avatar:first-child { margin-left: 0; }
.tc-avatar-more { background: #e5e7eb; color: #6b7280; font-size: .62rem; }
.tc-status-dot {
  position: absolute; bottom: 0; right: 0;
  width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid #fff;
}
.tc-projects-active { display: flex; align-items: center; gap: .3rem; font-size: .8rem; color: #6b7280; font-weight: 600; }

.tc-header-actions { display: flex; gap: .65rem; align-items: center; flex-wrap: wrap; }
.tc-sort-select { width: 160px; }
.tc-add-btn { background: #1d4ed8 !important; border-color: #1d4ed8 !important; font-weight: 700; }

/* ── Filters ─────────────────────────────────────────────────────────────── */
.tc-filters {
  display: flex; gap: .75rem; align-items: center; flex-wrap: wrap;
  background: #f8fafc; border: 1px solid #e5e7eb;
  border-radius: 10px; padding: .75rem 1rem;
}
.tc-filter-select { width: 200px; }

/* ── Tabs ────────────────────────────────────────────────────────────────── */
.tc-tabs { display: flex; gap: 0; border-bottom: 2px solid #e5e7eb; width: fit-content; }
.tc-tab {
  background: none; border: none; border-bottom: 2px solid transparent;
  margin-bottom: -2px; padding: .5rem 1.2rem;
  font-size: .92rem; font-weight: 500; color: #6b7280;
  cursor: pointer; transition: color .15s, border-color .15s;
}
.tc-tab:hover { color: #111827; }
.tc-tab--active { color: #1d4ed8; border-bottom-color: #1d4ed8; font-weight: 700; }

.tc-loading { display: flex; justify-content: center; padding: 3rem; }

/* ── Kanban ──────────────────────────────────────────────────────────────── */
.kanban-wrap { overflow-x: auto; }
.kanban-board {
  display: flex; gap: 1rem;
  min-width: max-content;
  padding-bottom: .5rem;
}
.kanban-col {
  width: 270px; flex-shrink: 0;
  background: #f8fafc; border-radius: 12px;
  display: flex; flex-direction: column;
}

/* Column header */
.col-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: .9rem 1rem .6rem;
}
.col-head-left { display: flex; align-items: center; gap: .45rem; }
.col-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.col-title { font-size: .75rem; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: #374151; }
.col-count { background: #e5e7eb; color: #374151; font-size: .7rem; font-weight: 800; border-radius: 99px; padding: 1px 8px; }
.col-add-btn { background: none; border: none; cursor: pointer; color: #9ca3af; font-size: .85rem; padding: .2rem; border-radius: 4px; }
.col-add-btn:hover { background: #e5e7eb; color: #374151; }

/* Cards */
.col-cards { flex: 1; padding: .4rem .65rem .75rem; display: flex; flex-direction: column; gap: .6rem; min-height: 100px; }
.col-empty { display: flex; justify-content: center; align-items: center; padding: 1.5rem; }

.task-card {
  background: #fff; border-radius: 10px;
  padding: .9rem 1rem; border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0,0,0,.05);
  cursor: grab; display: flex; flex-direction: column; gap: .5rem;
  transition: box-shadow .15s;
}
.task-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,.1); }
.task-card:active { cursor: grabbing; }

.card-top { display: flex; justify-content: space-between; align-items: center; gap: .4rem; }
.card-project { font-size: .68rem; font-weight: 800; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; }
.card-priority { font-size: .65rem; font-weight: 800; border-radius: 99px; padding: 2px 8px; white-space: nowrap; }

.card-title { font-size: .88rem; font-weight: 600; color: #111827; margin: 0; line-height: 1.4; }
.card-done  { text-decoration: line-through; color: #9ca3af; }

.card-progress-wrap { display: flex; align-items: center; gap: .5rem; }
.card-progress-bar  { flex: 1; height: 4px; background: #e5e7eb; border-radius: 99px; overflow: hidden; }
.card-progress-fill { height: 100%; border-radius: 99px; transition: width .3s; }
.card-progress-label { font-size: .72rem; font-weight: 700; color: #6b7280; }

.card-footer { display: flex; justify-content: space-between; align-items: center; gap: .4rem; }
.card-assignee { display: flex; align-items: center; gap: .4rem; }
.card-avatar {
  width: 22px; height: 22px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .6rem; font-weight: 700; color: #fff; flex-shrink: 0;
}
.card-assignee-name { font-size: .75rem; font-weight: 600; color: #374151; }
.card-meta { display: flex; gap: .5rem; align-items: center; }
.card-meta-item { display: flex; align-items: center; gap: .2rem; font-size: .72rem; color: #9ca3af; }
.card-meta-item .pi { font-size: .68rem; }
.card-due { color: #f59e0b; font-weight: 600; }

/* ── Heatmap ─────────────────────────────────────────────────────────────── */
.heatmap-section { display: flex; flex-direction: column; gap: 1.25rem; }
.hm-legend { display: flex; align-items: center; gap: .4rem; }
.hm-legend-label { font-size: .78rem; color: #6b7280; }
.hm-legend-cell  { width: 14px; height: 14px; border-radius: 3px; }
.hm-table-wrap { overflow-x: auto; }
.hm-table {
  border-collapse: separate; border-spacing: 0; width: 100%;
  background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;
}
.hm-table thead tr { background: #f9fafb; }
.hm-th-member { text-align: left; padding: .75rem 1.25rem; font-size: .72rem; font-weight: 800; color: #6b7280; text-transform: uppercase; letter-spacing: .06em; min-width: 160px; border-bottom: 1px solid #e5e7eb; }
.hm-th-day   { text-align: center; padding: .75rem .5rem; font-size: .72rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: .04em; border-bottom: 1px solid #e5e7eb; min-width: 52px; }
.hm-th-stat  { text-align: center; padding: .75rem .75rem; font-size: .72rem; font-weight: 800; color: #6b7280; text-transform: uppercase; letter-spacing: .06em; border-bottom: 1px solid #e5e7eb; min-width: 60px; }
.hm-row { border-bottom: 1px solid #f3f4f6; }
.hm-row:last-child { border-bottom: none; }
.hm-td-member { padding: .85rem 1.25rem; border-right: 1px solid #f3f4f6; }
.hm-member { display: flex; align-items: center; gap: .65rem; }
.hm-avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: .8rem; font-weight: 700; color: #fff; flex-shrink: 0; }
.hm-member-name { font-size: .88rem; font-weight: 600; color: #111827; }
.hm-td-cell { padding: .5rem .3rem; text-align: center; vertical-align: middle; }
.hm-cells-col { display: flex; flex-direction: column; gap: 3px; align-items: center; }
.hm-cell { width: 11px; height: 11px; border-radius: 2px; transition: transform .1s; cursor: default; }
.hm-cell:hover { transform: scale(1.4); }
.hm-td-stat { text-align: center; padding: .85rem .75rem; font-size: .88rem; font-weight: 700; color: #374151; border-left: 1px solid #f3f4f6; }
.hm-done-badge { display: inline-block; background: #d1fae5; color: #065f46; font-size: .78rem; font-weight: 700; border-radius: 99px; padding: 2px 10px; }
.hm-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .75rem; padding: 3rem; color: #9ca3af; background: #f9fafb; border-radius: 12px; }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .hm-table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .hm-th-member, .hm-td-member { min-width: 120px; padding: .6rem .75rem; }
  .hm-th-day, .hm-td-cell { min-width: 36px; padding: .4rem .2rem; }
  .hm-cell { width: 9px; height: 9px; }
}
</style>

