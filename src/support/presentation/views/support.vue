<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSupportStore } from '../../application/support.store.js';

const { t } = useI18n();
const store = useSupportStore();

onMounted(() => store.fetchTickets());

// ── Tabs ──────────────────────────────────────────────────────────────────
const activeTab = ref('all');
const TABS = [
    { key: 'all',         labelKey: 'support.tabs.all'        },
    { key: 'Open',        labelKey: 'support.tabs.open'       },
    { key: 'In Progress', labelKey: 'support.tabs.inProgress' },
    { key: 'Resolved',    labelKey: 'support.tabs.resolved'   },
];

// ── Search / Filter / Sort ────────────────────────────────────────────────
const search      = ref('');
const filterCat   = ref(null);
const filterPri   = ref(null);
const sortMode    = ref('newest');
const CAT_OPTIONS = ['Bug', 'Feature Request', 'Performance', 'Other'];
const PRI_OPTIONS = ['High', 'Medium', 'Low'];
const PRI_WEIGHT = { High: 3, Medium: 2, Low: 1 };

const filtered = computed(() => {
    let list = [...store.tickets];
    if (activeTab.value !== 'all') list = list.filter(t => t.status === activeTab.value);
    if (filterCat.value)  list = list.filter(t => t.category === filterCat.value);
    if (filterPri.value)  list = list.filter(t => t.priority === filterPri.value);
    if (search.value.trim()) {
        const q = search.value.toLowerCase();
        list = list.filter(t =>
            t.title?.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q) ||
            t.category?.toLowerCase().includes(q)
        );
    }
    if (sortMode.value === 'newest')   list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortMode.value === 'oldest')   list.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortMode.value === 'priority') list.sort((a,b) => (PRI_WEIGHT[b.priority]||0) - (PRI_WEIGHT[a.priority]||0));
    return list;
});

// ── New Ticket Dialog ─────────────────────────────────────────────────────
const showDialog = ref(false);
const form = ref({ title:'', description:'', category:'Bug', priority:'Medium' });

async function submitTicket() {
    if (!form.value.title.trim()) return;
    await store.submitTicket({ ...form.value });
    form.value = { title:'', description:'', category:'Bug', priority:'Medium' };
    showDialog.value = false;
}

// ── Selected ticket detail ────────────────────────────────────────────────
const selectedTicket = ref(null);
const comments       = ref([]);
const newComment     = ref('');

function openTicket(ticket) {
    selectedTicket.value = ticket;
    comments.value = [
        { id:1, author:'Support Team', avatar:'ST', time:'2026-05-10', text:'Ticket received. We are looking into this.' },
    ].filter(() => Math.random() > .4);
    newComment.value = '';
}
function closeDetail() { selectedTicket.value = null; }

function postComment() {
    if (!newComment.value.trim()) return;
    comments.value.push({
        id: Date.now(), author:'Alex Sterling', avatar:'AS', time: new Date().toISOString().split('T')[0],
        text: newComment.value.trim()
    });
    newComment.value = '';
}

function escalateTicket(ticket) {
    ticket.priority = 'High';
    store.updateTicketStatus(ticket, ticket.status);
}

// ── FAQ ───────────────────────────────────────────────────────────────────
const openFaq    = ref(null);
const showFaq    = ref(false);
function toggleFaq(i) { openFaq.value = openFaq.value === i ? null : i; }
const FAQ_ITEMS = computed(() => [
    { q: t('support.faq.q1'), a: t('support.faq.a1') },
    { q: t('support.faq.q2'), a: t('support.faq.a2') },
    { q: t('support.faq.q3'), a: t('support.faq.a3') },
    { q: t('support.faq.q4'), a: t('support.faq.a4') },
]);

// ── Helpers ───────────────────────────────────────────────────────────────
const resolvedPct = computed(() => {
    if (!store.tickets.length) return 0;
    return Math.round(store.resolvedTickets.length / store.tickets.length * 100);
});

function priorityColor(p) { return { High:'#ef4444', Medium:'#f59e0b', Low:'#22c55e' }[p]??'#9ca3af'; }
function priorityBg(p)    { return { High:'#fee2e2', Medium:'#fef3c7', Low:'#d1fae5' }[p]??'#f3f4f6'; }
function statusColor(s)   { return { Open:'#f59e0b', 'In Progress':'#3b82f6', Resolved:'#22c55e' }[s]??'#9ca3af'; }
function statusBg(s)      { return { Open:'#fef3c7', 'In Progress':'#eff6ff', Resolved:'#d1fae5' }[s]??'#f3f4f6'; }
function catIcon(c)  { return { Bug:'pi-bug', 'Feature Request':'pi-lightbulb', Performance:'pi-chart-line', Other:'pi-tag' }[c]??'pi-tag'; }
function catColor(c) { return { Bug:'#ef4444', 'Feature Request':'#8b5cf6', Performance:'#3b82f6', Other:'#6b7280' }[c]??'#6b7280'; }
function catBg(c)    { return { Bug:'#fee2e2', 'Feature Request':'#ede9fe', Performance:'#eff6ff', Other:'#f3f4f6' }[c]??'#f3f4f6'; }
function tabCount(key) { if (key==='all') return store.tickets.length; return store.tickets.filter(t=>t.status===key).length; }
function relativeDate(d) {
    if (!d) return '';
    const diff = Math.floor((Date.now()-new Date(d))/86400000);
    if (diff===0) return t('support.today');
    if (diff===1) return t('support.yesterday');
    return `${diff} ${t('support.daysAgo')}`;
}
</script>

<template>
  <div class="sp-page">

    <!-- ── Header ────────────────────────────────────────────────────────── -->
    <div class="sp-header">
      <div>
        <h1 class="sp-title">{{ t('support.title') }}</h1>
        <p class="sp-subtitle">{{ t('support.subtitle') }}</p>
      </div>
      <div class="sp-header-actions">
        <pv-button :label="t('support.faq.title')" icon="pi pi-book" severity="secondary" outlined @click="showFaq=true" />
        <pv-button :label="t('support.newTicket')" icon="pi pi-plus" class="sp-new-btn" @click="showDialog=true" />
      </div>
    </div>

    <!-- ── KPI row ────────────────────────────────────────────────────────── -->
    <div class="sp-kpis">
      <div class="sp-kpi sp-kpi--open"     @click="activeTab='Open'">
        <div class="sp-kpi-icon"><i class="pi pi-exclamation-circle" /></div>
        <div>
          <span class="sp-kpi-label">{{ t('support.tabs.open') }}</span>
          <span class="sp-kpi-val">{{ store.openTickets.length }}</span>
        </div>
      </div>
      <div class="sp-kpi sp-kpi--progress" @click="activeTab='In Progress'">
        <div class="sp-kpi-icon"><i class="pi pi-spin pi-cog" /></div>
        <div>
          <span class="sp-kpi-label">{{ t('support.tabs.inProgress') }}</span>
          <span class="sp-kpi-val">{{ store.inProgressTickets.length }}</span>
        </div>
      </div>
      <div class="sp-kpi sp-kpi--resolved" @click="activeTab='Resolved'">
        <div class="sp-kpi-icon"><i class="pi pi-check-circle" /></div>
        <div>
          <span class="sp-kpi-label">{{ t('support.tabs.resolved') }}</span>
          <span class="sp-kpi-val">{{ store.resolvedTickets.length }}</span>
        </div>
      </div>
      <div class="sp-kpi sp-kpi--pct">
        <div class="sp-kpi-icon"><i class="pi pi-chart-pie" /></div>
        <div style="flex:1">
          <span class="sp-kpi-label">{{ t('support.totalTickets') }}</span>
          <span class="sp-kpi-val">{{ store.tickets.length }}</span>
          <div class="sp-progress-bar">
            <div class="sp-progress-fill" :style="{ width: resolvedPct + '%' }" />
          </div>
          <span class="sp-kpi-pct">{{ resolvedPct }}% resolved</span>
        </div>
      </div>
    </div>

    <!-- ── Tabs + Search + Filter + Sort ─────────────────────────────────── -->
    <div class="sp-toolbar">
      <div class="sp-tabs">
        <button
            v-for="tab in TABS" :key="tab.key"
            :class="['sp-tab', { 'sp-tab--active': activeTab === tab.key }]"
            @click="activeTab = tab.key"
        >
          {{ t(tab.labelKey) }}
          <span class="sp-tab-count">{{ tabCount(tab.key) }}</span>
        </button>
      </div>
      <div class="sp-search-row">
        <div class="sp-search">
          <i class="pi pi-search sp-search-icon" />
          <input v-model="search" :placeholder="t('support.searchPlaceholder')" class="sp-search-input" />
        </div>
        <pv-select v-model="filterCat" :options="CAT_OPTIONS" :placeholder="t('support.filterCategory')" showClear class="sp-filter" />
        <pv-select v-model="filterPri" :options="PRI_OPTIONS" :placeholder="t('support.filterPriority')" showClear class="sp-filter" />
        <pv-select v-model="sortMode"
            :options="[{label: t('support.sortNewest'), value:'newest'},{label:t('support.sortOldest'),value:'oldest'},{label:t('support.sortPriority'),value:'priority'}]"
            optionLabel="label" optionValue="value"
            class="sp-filter" />
      </div>
    </div>

    <!-- ── Loading ─────────────────────────────────────────────────────────── -->
    <div v-if="store.loading" class="sp-loading">
      <i class="pi pi-spin pi-spinner" style="font-size:2rem" />
    </div>

    <!-- ── Main content (list + detail) ──────────────────────────────────── -->
    <div v-else class="sp-body" :class="{ 'sp-body--split': selectedTicket }">

      <!-- Ticket list -->
      <div class="sp-list">
        <div v-if="!filtered.length" class="sp-empty">
          <i class="pi pi-inbox" style="font-size:2.5rem; color:#e5e7eb" />
          <p>{{ t('support.noTickets') }}</p>
          <pv-button :label="t('support.newTicket')" icon="pi pi-plus" size="small" @click="showDialog=true" />
        </div>

        <div
            v-for="ticket in filtered" :key="ticket.id"
            :class="['sp-ticket', { 'sp-ticket--active': selectedTicket?.id === ticket.id }]"
            @click="openTicket(ticket)"
        >
          <div class="sp-ticket-icon" :style="{ background: catBg(ticket.category) }">
            <i :class="['pi', catIcon(ticket.category)]" :style="{ color: catColor(ticket.category) }" />
          </div>
          <div class="sp-ticket-body">
            <div class="sp-ticket-top">
              <span class="sp-ticket-title">{{ ticket.title }}</span>
              <span class="sp-ticket-id">#{{ ticket.id }}</span>
            </div>
            <p class="sp-ticket-desc">{{ ticket.description }}</p>
            <div class="sp-ticket-meta">
              <span class="sp-badge" :style="{ color: statusColor(ticket.status), background: statusBg(ticket.status) }">
                {{ ticket.status }}
              </span>
              <span class="sp-badge" :style="{ color: priorityColor(ticket.priority), background: priorityBg(ticket.priority) }">
                {{ ticket.priority }}
              </span>
              <span class="sp-ticket-date">{{ relativeDate(ticket.createdAt) }}</span>
              <span class="sp-ticket-assignee"><i class="pi pi-user" /> {{ ticket.assignee }}</span>
            </div>
          </div>
          <i class="pi pi-chevron-right sp-ticket-chevron" />
        </div>
      </div>

      <!-- Ticket detail panel -->
      <div v-if="selectedTicket" class="sp-detail">
        <div class="sp-detail-head">
          <div>
            <span class="sp-detail-id">#{{ selectedTicket.id }}</span>
            <h2 class="sp-detail-title">{{ selectedTicket.title }}</h2>
          </div>
          <button class="sp-close-btn" @click="closeDetail"><i class="pi pi-times" /></button>
        </div>

        <div class="sp-detail-badges">
          <span class="sp-badge sp-badge--lg" :style="{ color: statusColor(selectedTicket.status), background: statusBg(selectedTicket.status) }">{{ selectedTicket.status }}</span>
          <span class="sp-badge sp-badge--lg" :style="{ color: priorityColor(selectedTicket.priority), background: priorityBg(selectedTicket.priority) }">{{ selectedTicket.priority }}</span>
          <span class="sp-badge sp-badge--lg" :style="{ color: catColor(selectedTicket.category), background: catBg(selectedTicket.category) }">
            <i :class="['pi', catIcon(selectedTicket.category)]" style="margin-right:.3rem" />{{ selectedTicket.category }}
          </span>
        </div>

        <div class="sp-detail-section">
          <span class="sp-detail-label">{{ t('support.detail.description') }}</span>
          <p class="sp-detail-text">{{ selectedTicket.description || t('support.detail.noDescription') }}</p>
        </div>

        <div class="sp-detail-row">
          <div class="sp-detail-field">
            <span class="sp-detail-label">{{ t('support.detail.assignee') }}</span>
            <div class="sp-assignee">
              <div class="sp-assignee-avatar">{{ selectedTicket.assignee?.charAt(0)??'?' }}</div>
              <span>{{ selectedTicket.assignee }}</span>
            </div>
          </div>
          <div class="sp-detail-field">
            <span class="sp-detail-label">{{ t('support.detail.created') }}</span>
            <span class="sp-detail-val">{{ selectedTicket.createdAt }}</span>
          </div>
        </div>

        <!-- Timeline -->
        <div class="sp-detail-section">
          <span class="sp-detail-label">{{ t('support.detail.timeline') }}</span>
          <div class="sp-timeline">
            <div class="sp-tl-item">
              <div class="sp-tl-dot sp-tl-dot--open" />
              <div>
                <span class="sp-tl-action">{{ t('support.timeline.created') }}</span>
                <span class="sp-tl-date">{{ selectedTicket.createdAt }}</span>
              </div>
            </div>
            <div v-if="selectedTicket.status !== 'Open'" class="sp-tl-item">
              <div class="sp-tl-dot sp-tl-dot--progress" />
              <div>
                <span class="sp-tl-action">{{ t('support.timeline.inProgress') }}</span>
                <span class="sp-tl-date">{{ t('support.timeline.assignedTo') }} {{ selectedTicket.assignee }}</span>
              </div>
            </div>
            <div v-if="selectedTicket.status === 'Resolved'" class="sp-tl-item">
              <div class="sp-tl-dot sp-tl-dot--resolved" />
              <div>
                <span class="sp-tl-action">{{ t('support.timeline.resolved') }}</span>
                <span class="sp-tl-date">{{ t('support.timeline.closedBy') }} {{ selectedTicket.assignee }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments -->
        <div class="sp-detail-section">
          <span class="sp-detail-label">{{ t('support.detail.comments') }}</span>
          <div v-if="!comments.length" class="sp-no-comments">{{ t('support.detail.noComments') }}</div>
          <div v-for="c in comments" :key="c.id" class="sp-comment">
            <div class="sp-comment-avatar">{{ c.avatar }}</div>
            <div class="sp-comment-body">
              <div class="sp-comment-meta">
                <span class="sp-comment-author">{{ c.author }}</span>
                <span class="sp-comment-time">{{ c.time }}</span>
              </div>
              <p class="sp-comment-text">{{ c.text }}</p>
            </div>
          </div>
          <div class="sp-comment-input">
            <input v-model="newComment" :placeholder="t('support.detail.addComment')" class="sp-comment-field"
                @keyup.enter="postComment" />
            <pv-button :label="t('support.detail.postComment')" size="small" @click="postComment" />
          </div>
        </div>

        <!-- Actions -->
        <div class="sp-detail-actions">
          <pv-button :label="t('support.detail.markResolved')" icon="pi pi-check" class="sp-resolve-btn"
              :disabled="selectedTicket.status === 'Resolved'"
              @click="store.updateTicketStatus(selectedTicket,'Resolved'); closeDetail()" />
          <pv-button :label="t('support.detail.markInProgress')" severity="secondary" outlined
              :disabled="selectedTicket.status === 'In Progress' || selectedTicket.status === 'Resolved'"
              @click="store.updateTicketStatus(selectedTicket,'In Progress')" />
          <pv-button :label="t('support.detail.escalate')" severity="warning" outlined icon="pi pi-arrow-up"
              :disabled="selectedTicket.priority === 'High' || selectedTicket.status === 'Resolved'"
              @click="escalateTicket(selectedTicket)" />
        </div>
      </div>

    </div>
  </div>

  <!-- ── New Ticket Dialog ──────────────────────────────────────────────── -->
  <pv-dialog v-model:visible="showDialog" :header="t('support.newTicket')" modal style="width:520px">
    <div class="sp-form">
      <div class="sp-form-field">
        <label>{{ t('support.form.title') }} *</label>
        <pv-input-text v-model="form.title" :placeholder="t('support.form.titlePlaceholder')" class="w-full" />
      </div>
      <div class="sp-form-field">
        <label>{{ t('support.form.description') }}</label>
        <pv-textarea v-model="form.description" rows="4" :placeholder="t('support.form.descPlaceholder')" class="w-full" />
      </div>
      <div class="sp-form-row">
        <div class="sp-form-field">
          <label>{{ t('support.form.category') }}</label>
          <pv-select v-model="form.category" :options="CAT_OPTIONS" class="w-full" />
        </div>
        <div class="sp-form-field">
          <label>{{ t('support.form.priority') }}</label>
          <pv-select v-model="form.priority" :options="PRI_OPTIONS" class="w-full" />
        </div>
      </div>
    </div>
    <template #footer>
      <pv-button :label="t('support.form.cancel')" text @click="showDialog=false" />
      <pv-button :label="t('support.form.submit')" icon="pi pi-send" @click="submitTicket" />
    </template>
  </pv-dialog>

  <!-- ── FAQ / Knowledge Base Dialog ───────────────────────────────────── -->
  <pv-dialog v-model:visible="showFaq" :header="t('support.faq.title')" modal style="width:560px">
    <p class="sp-faq-subtitle">{{ t('support.faq.subtitle') }}</p>
    <div class="sp-faq-list">
      <div v-for="(faq, i) in FAQ_ITEMS" :key="i" class="sp-faq-item">
        <button class="sp-faq-q" @click="toggleFaq(i)">
          <i class="pi pi-question-circle sp-faq-q-icon" />
          <span>{{ faq.q }}</span>
          <i :class="['pi sp-faq-chevron', openFaq===i ? 'pi-chevron-up' : 'pi-chevron-down']" />
        </button>
        <div v-if="openFaq===i" class="sp-faq-a">{{ faq.a }}</div>
      </div>
    </div>
    <template #footer>
      <pv-button :label="t('support.newTicket')" icon="pi pi-plus" @click="showFaq=false; showDialog=true" />
    </template>
  </pv-dialog>
</template>

<style scoped>
.sp-page { display: flex; flex-direction: column; gap: 1.25rem; }

/* Header */
.sp-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; }
.sp-title  { font-size: 1.6rem; font-weight: 800; margin: 0; color: #111827; }
.sp-subtitle { color: #6b7280; font-size: .9rem; margin: .2rem 0 0; }
.sp-header-actions { display: flex; gap: .65rem; align-items: center; flex-wrap: wrap; }
.sp-new-btn { background: #1d4ed8 !important; border-color: #1d4ed8 !important; font-weight: 700; }

/* KPIs */
.sp-kpis { display: flex; gap: 1rem; flex-wrap: wrap; }
.sp-kpi {
  flex: 1; min-width: 140px;
  display: flex; align-items: center; gap: .85rem;
  background: #fff; border: 1px solid #e5e7eb;
  border-radius: 12px; padding: 1rem 1.25rem;
  cursor: pointer; transition: box-shadow .15s, border-color .15s;
}
.sp-kpi:hover { box-shadow: 0 4px 12px rgba(0,0,0,.08); border-color: #d1d5db; }
.sp-kpi-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; flex-shrink: 0;
}
.sp-kpi--open     .sp-kpi-icon { background: #fef3c7; color: #d97706; }
.sp-kpi--progress .sp-kpi-icon { background: #eff6ff; color: #3b82f6; }
.sp-kpi--resolved .sp-kpi-icon { background: #d1fae5; color: #059669; }
.sp-kpi--pct      .sp-kpi-icon { background: #f3f4f6; color: #374151; cursor:default; }
.sp-kpi-label { display: block; font-size: .72rem; color: #6b7280; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
.sp-kpi-val   { display: block; font-size: 1.5rem; font-weight: 900; color: #111827; line-height: 1.1; margin-top: .1rem; }
.sp-progress-bar { height: 4px; background: #e5e7eb; border-radius: 99px; margin-top: .4rem; overflow: hidden; }
.sp-progress-fill { height: 100%; background: #22c55e; border-radius: 99px; transition: width .3s; }
.sp-kpi-pct { font-size: .68rem; font-weight: 700; color: #22c55e; margin-top: .15rem; display: block; }

/* Toolbar */
.sp-toolbar { display: flex; flex-direction: column; gap: .75rem; }
.sp-tabs { display: flex; gap: 0; border-bottom: 2px solid #e5e7eb; width: 100%; }
.sp-tab {
  background: none; border: none; border-bottom: 2px solid transparent;
  margin-bottom: -2px; padding: .5rem 1rem;
  font-size: .88rem; font-weight: 600; color: #6b7280;
  cursor: pointer; display: flex; align-items: center; gap: .4rem;
  transition: color .15s, border-color .15s;
}
.sp-tab:hover { color: #111827; }
.sp-tab--active { color: #1d4ed8; border-bottom-color: #1d4ed8; font-weight: 700; }
.sp-tab-count {
  background: #f3f4f6; color: #374151;
  font-size: .65rem; font-weight: 800; border-radius: 99px; padding: 1px 7px;
}
.sp-tab--active .sp-tab-count { background: #dbeafe; color: #1d4ed8; }

.sp-search-row { display: flex; gap: .65rem; flex-wrap: wrap; align-items: center; }
.sp-search {
  flex: 1; min-width: 200px;
  display: flex; align-items: center; gap: .5rem;
  border: 1px solid #e5e7eb; border-radius: 9px;
  padding: .45rem .85rem; background: #fff;
}
.sp-search-icon { color: #9ca3af; font-size: .85rem; }
.sp-search-input { border: none; outline: none; background: transparent; font-size: .88rem; color: #374151; width: 100%; }
.sp-filter { width: 170px; }

/* Loading */
.sp-loading { display: flex; justify-content: center; padding: 3rem; }

/* Body */
.sp-body { display: flex; gap: 1.25rem; }
.sp-body--split .sp-list { flex: 1; }
.sp-list { flex: 1; display: flex; flex-direction: column; gap: .5rem; }

/* Empty */
.sp-empty { display: flex; flex-direction: column; align-items: center; gap: .75rem; padding: 3rem; color: #9ca3af; background: #f9fafb; border-radius: 12px; }

/* Ticket card */
.sp-ticket {
  display: flex; align-items: center; gap: 1rem;
  background: #fff; border: 1px solid #e5e7eb;
  border-radius: 12px; padding: .9rem 1rem;
  cursor: pointer; transition: all .15s;
}
.sp-ticket:hover { box-shadow: 0 4px 12px rgba(0,0,0,.08); border-color: #d1d5db; }
.sp-ticket--active { border-color: #3b82f6 !important; background: #f0f9ff; }
.sp-ticket-icon { width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: .95rem; }
.sp-ticket-body { flex: 1; min-width: 0; }
.sp-ticket-top { display: flex; align-items: baseline; justify-content: space-between; gap: .5rem; }
.sp-ticket-title { font-size: .9rem; font-weight: 700; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sp-ticket-id { font-size: .72rem; color: #9ca3af; font-weight: 600; flex-shrink: 0; }
.sp-ticket-desc { font-size: .78rem; color: #6b7280; margin: .2rem 0 .4rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sp-ticket-meta { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; }
.sp-badge { font-size: .65rem; font-weight: 800; border-radius: 99px; padding: 2px 9px; white-space: nowrap; }
.sp-badge--lg { font-size: .72rem; padding: 3px 12px; }
.sp-ticket-date { font-size: .72rem; color: #9ca3af; }
.sp-ticket-assignee { font-size: .72rem; color: #6b7280; display: flex; align-items: center; gap: .2rem; }
.sp-ticket-chevron { color: #d1d5db; font-size: .8rem; }

/* Detail panel */
.sp-detail {
  width: 380px; flex-shrink: 0;
  background: #fff; border: 1px solid #e5e7eb;
  border-radius: 16px; padding: 1.5rem;
  display: flex; flex-direction: column; gap: 1.25rem;
  max-height: 82vh; overflow-y: auto;
  animation: slide-in .2s ease;
}
@keyframes slide-in { from { opacity:0; transform:translateX(12px); } to { opacity:1; transform:translateX(0); } }
.sp-detail-head { display: flex; justify-content: space-between; align-items: flex-start; }
.sp-detail-id    { font-size: .72rem; color: #9ca3af; font-weight: 700; display: block; }
.sp-detail-title { font-size: 1rem; font-weight: 800; color: #111827; margin: .25rem 0 0; }
.sp-close-btn { background: #f3f4f6; border: none; border-radius: 8px; padding: .35rem .5rem; cursor: pointer; color: #6b7280; }
.sp-close-btn:hover { background: #e5e7eb; }
.sp-detail-badges { display: flex; gap: .4rem; flex-wrap: wrap; }
.sp-detail-section { display: flex; flex-direction: column; gap: .4rem; }
.sp-detail-label { font-size: .68rem; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; color: #9ca3af; }
.sp-detail-text  { font-size: .85rem; color: #374151; line-height: 1.6; margin: 0; }
.sp-detail-val   { font-size: .85rem; color: #374151; font-weight: 600; }
.sp-detail-row   { display: flex; gap: 1rem; }
.sp-detail-field { flex: 1; display: flex; flex-direction: column; gap: .35rem; }
.sp-assignee { display: flex; align-items: center; gap: .5rem; }
.sp-assignee-avatar { width: 28px; height: 28px; border-radius: 50%; background: #3b82f6; color: #fff; display: flex; align-items:center; justify-content:center; font-size:.7rem; font-weight:700; }

/* Timeline */
.sp-timeline { display: flex; flex-direction: column; gap: .75rem; padding-left: .5rem; }
.sp-tl-item  { display: flex; align-items: flex-start; gap: .75rem; position: relative; }
.sp-tl-item::before { content: ''; position: absolute; left: 7px; top: 18px; width: 2px; height: calc(100% + .75rem); background: #e5e7eb; }
.sp-tl-item:last-child::before { display: none; }
.sp-tl-dot { width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0; margin-top: 2px; border: 2px solid #fff; box-shadow: 0 0 0 2px currentColor; }
.sp-tl-dot--open     { background: #f59e0b; color: #f59e0b; }
.sp-tl-dot--progress { background: #3b82f6; color: #3b82f6; }
.sp-tl-dot--resolved { background: #22c55e; color: #22c55e; }
.sp-tl-action { display: block; font-size: .82rem; font-weight: 700; color: #111827; }
.sp-tl-date   { display: block; font-size: .72rem; color: #9ca3af; margin-top: .1rem; }

/* Comments */
.sp-no-comments { font-size: .8rem; color: #9ca3af; font-style: italic; }
.sp-comment { display: flex; gap: .65rem; align-items: flex-start; }
.sp-comment-avatar { width:30px; height:30px; border-radius:50%; background:#e5e7eb; color:#374151; display:flex; align-items:center; justify-content:center; font-size:.7rem; font-weight:700; flex-shrink:0; }
.sp-comment-body { flex:1; }
.sp-comment-meta { display:flex; align-items:center; gap:.5rem; margin-bottom:.2rem; }
.sp-comment-author { font-size:.78rem; font-weight:700; color:#111827; }
.sp-comment-time { font-size:.7rem; color:#9ca3af; }
.sp-comment-text { font-size:.8rem; color:#374151; line-height:1.5; margin:0; }
.sp-comment-input { display:flex; gap:.5rem; align-items:center; margin-top:.25rem; }
.sp-comment-field { flex:1; border:1px solid #e5e7eb; border-radius:8px; padding:.45rem .75rem; font-size:.83rem; color:#374151; outline:none; background:#f9fafb; }
.sp-comment-field:focus { border-color:#93c5fd; background:#fff; }

/* Actions */
.sp-detail-actions { display: flex; flex-direction: column; gap: .5rem; margin-top: auto; }
.sp-resolve-btn { background: #1d4ed8 !important; border-color: #1d4ed8 !important; justify-content: center; }

/* Form */
.sp-form { display: flex; flex-direction: column; gap: 1rem; padding: .25rem 0; }
.sp-form-field { display: flex; flex-direction: column; gap: .35rem; }
.sp-form-field label { font-size: .8rem; font-weight: 700; color: #374151; }
.sp-form-row { display: flex; gap: 1rem; }
.sp-form-row .sp-form-field { flex: 1; }

/* FAQ dialog */
.sp-faq-subtitle { font-size: .85rem; color: #6b7280; margin: 0 0 1rem; }
.sp-faq-list { display: flex; flex-direction: column; gap: .5rem; }
.sp-faq-item { border: 1px solid #f3f4f6; border-radius: 10px; overflow: hidden; }
.sp-faq-q {
  width: 100%; background: #f9fafb; border: none; cursor: pointer;
  display: flex; align-items: center; gap: .65rem;
  font-size: .88rem; font-weight: 700; color: #111827;
  padding: .85rem 1rem; text-align: left; transition: background .1s;
}
.sp-faq-q:hover { background: #f3f4f6; }
.sp-faq-q-icon { color: #3b82f6; font-size: .95rem; flex-shrink: 0; }
.sp-faq-q span { flex: 1; }
.sp-faq-chevron { font-size: .72rem; color: #9ca3af; }
.sp-faq-a { padding: .75rem 1rem 1rem 2.4rem; font-size: .83rem; color: #374151; line-height: 1.6; background: #fff; border-top: 1px solid #f3f4f6; }

@media (max-width: 768px) {
  .sp-detail { width: 100%; }
  .sp-body--split { flex-direction: column; }
}
</style>
