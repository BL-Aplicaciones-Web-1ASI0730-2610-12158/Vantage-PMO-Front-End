<script setup>
import { onMounted, computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useScheduleStore } from '../../application/schedule.store.js';
import { useMeetingsStore } from '../../../meetings/application/meetings.store.js';

const { t } = useI18n();
const scheduleStore = useScheduleStore();
const meetingsStore = useMeetingsStore();

onMounted(() => {
    scheduleStore.fetchItems();
    meetingsStore.fetchMeetings();
});

// ─── View mode ─────────────────────────────────────────────────────────────────
const viewMode = ref('week'); // 'week' | 'month'
const today = new Date();
const currentDate = ref(new Date(today));

// ─── Navigation ────────────────────────────────────────────────────────────────
function goToToday()  { currentDate.value = new Date(); }
function goBack()     {
    const d = new Date(currentDate.value);
    if (viewMode.value === 'week') d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    currentDate.value = d;
}
function goForward()  {
    const d = new Date(currentDate.value);
    if (viewMode.value === 'week') d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    currentDate.value = d;
}

// ─── Formatting ────────────────────────────────────────────────────────────────
const MONTHS_EN = ['January','February','March','April','May','June',
    'July','August','September','October','November','December'];
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function fmt(date) { return `${MONTHS_EN[date.getMonth()]} ${date.getFullYear()}`; }
function isoDate(date) { return date.toISOString().split('T')[0]; }
function isToday(date) { return isoDate(date) === isoDate(today); }

// ─── Week grid ─────────────────────────────────────────────────────────────────
const weekDays = computed(() => {
    const start = new Date(currentDate.value);
    const day   = start.getDay();
    start.setDate(start.getDate() - day + (day === 0 ? -6 : 1)); // Monday
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
    });
});

const weekLabel = computed(() => {
    const [first, last] = [weekDays.value[0], weekDays.value[6]];
    if (first.getMonth() === last.getMonth())
        return `${MONTHS_EN[first.getMonth()]} ${first.getFullYear()}`;
    return `${MONTHS_EN[first.getMonth()]} – ${MONTHS_EN[last.getMonth()]} ${last.getFullYear()}`;
});

// ─── Month grid ─────────────────────────────────────────────────────────────────
const monthDays = computed(() => {
    const year  = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const first = new Date(year, month, 1);
    const offset = first.getDay() === 0 ? 6 : first.getDay() - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
});

// ─── All events (schedule + meetings) ─────────────────────────────────────────
const allEvents = computed(() => {
    const events = [];
    scheduleStore.items.forEach(item => {
        if (!item.date) return;
        events.push({
            id: `s-${item.id}`, date: item.date, time: item.time,
            duration: item.duration, title: item.title, subtitle: item.detail,
            kind: item.type ?? 'work', source: 'schedule'
        });
    });
    meetingsStore.meetings.forEach(m => {
        events.push({
            id: `m-${m.id}`, date: m.date, time: m.time,
            duration: m.duration, title: m.title, subtitle: m.location,
            kind: 'meeting', source: 'meeting'
        });
    });
    return events;
});

function eventsForDate(date) {
    if (!date) return [];
    const key = isoDate(date);
    return allEvents.value.filter(e => e.date === key).sort((a,b) => a.time.localeCompare(b.time));
}

// ─── Week view: hourly slots 08:00 – 20:00 ────────────────────────────────────
const HOUR_START  = 8;
const HOUR_END    = 20;
const SLOT_HEIGHT = 64;
const hours = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);

function eventStyle(event) {
    const [h, m] = event.time.split(':').map(Number);
    const top    = ((h - HOUR_START) + m / 60) * SLOT_HEIGHT;
    const height = Math.max((event.duration / 60) * SLOT_HEIGHT - 4, 22);
    return { top: `${top}px`, height: `${height}px` };
}

function eventsForDayWeek(date) {
    return eventsForDate(date).filter(e => {
        const [h] = e.time.split(':').map(Number);
        return h >= HOUR_START && h < HOUR_END;
    });
}

// ─── Color map ─────────────────────────────────────────────────────────────────
const kindColor = {
    meeting:  '#3b82f6',
    review:   '#8b5cf6',
    work:     '#10b981',
    focus:    '#f59e0b',
    planning: '#06b6d4',
    workshop: '#ef4444',
};
function eventColor(kind) { return kindColor[kind] ?? '#6b7280'; }

// ─── Selected day panel ─────────────────────────────────────────────────────────
const selectedDay = ref(null);
const selectedDayEvents = computed(() => selectedDay.value ? eventsForDate(selectedDay.value) : []);
function selectDay(date) { if (date) selectedDay.value = date; }

const viewOptions = computed(() => [
    { label: t('schedule.week'), value: 'week' },
    { label: t('schedule.month'), value: 'month' }
]);
</script>

<template>
  <div class="cal-page">

    <!-- ── Header ── -->
    <div class="cal-header">
      <div>
        <h1 class="cal-title">{{ t('schedule.title') }}</h1>
        <p class="cal-subtitle">{{ t('schedule.subtitle') }}</p>
      </div>
      <div class="cal-controls">
        <pv-button text :label="t('schedule.today')" @click="goToToday" />
        <pv-button text icon="pi pi-chevron-left" @click="goBack" />
        <span class="cal-period">{{ viewMode === 'week' ? weekLabel : fmt(currentDate) }}</span>
        <pv-button text icon="pi pi-chevron-right" @click="goForward" />
        <pv-select-button
            v-model="viewMode"
            :options="viewOptions"
            option-label="label"
            option-value="value"
        />
      </div>
    </div>

    <div v-if="scheduleStore.loading || meetingsStore.loading" class="loading-state">
      <i class="pi pi-spin pi-spinner" style="font-size:2rem" />
    </div>

    <!-- ══════════ MONTH VIEW ══════════ -->
    <div v-else-if="viewMode === 'month'" class="month-grid">
      <div class="month-header-row">
        <div v-for="d in ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']" :key="d" class="month-day-header">{{ d }}</div>
      </div>
      <div class="month-cells">
        <div
            v-for="(cell, idx) in monthDays"
            :key="idx"
            :class="['month-cell', {
              outside: !cell,
              today: cell && isToday(cell),
              selected: cell && selectedDay && isoDate(cell) === isoDate(selectedDay),
            }]"
            @click="selectDay(cell)"
        >
          <div v-if="cell" class="cell-number">{{ cell.getDate() }}</div>
          <div v-if="cell" class="cell-events">
            <div
                v-for="ev in eventsForDate(cell).slice(0, 3)"
                :key="ev.id"
                class="cell-chip"
                :style="{ background: eventColor(ev.kind) }"
            >{{ ev.time }} {{ ev.title }}</div>
            <div v-if="eventsForDate(cell).length > 3" class="cell-more">
              +{{ eventsForDate(cell).length - 3 }} {{ t('schedule.more') }}
            </div>
          </div>
        </div>
      </div>

      <transition name="slide">
        <div v-if="selectedDay && selectedDayEvents.length" class="day-detail-panel">
          <div class="panel-header">
            <span class="panel-date">
              {{ DAYS_SHORT[selectedDay.getDay()] }},
              {{ MONTHS_EN[selectedDay.getMonth()] }} {{ selectedDay.getDate() }}
            </span>
            <pv-button text icon="pi pi-times" @click="selectedDay = null" />
          </div>
          <div class="panel-events">
            <div v-for="ev in selectedDayEvents" :key="ev.id" class="panel-event">
              <div class="panel-dot" :style="{ background: eventColor(ev.kind) }" />
              <div class="panel-event-body">
                <div class="panel-event-time">{{ ev.time }} · {{ ev.duration }}min</div>
                <div class="panel-event-title">{{ ev.title }}</div>
                <div class="panel-event-sub">{{ ev.subtitle }}</div>
              </div>
              <pv-tag
                  :value="ev.source === 'meeting' ? t('schedule.meeting') : t('schedule.event')"
                  :severity="ev.source === 'meeting' ? 'info' : 'success'"
                  style="height:fit-content"
              />
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- ══════════ WEEK VIEW ══════════ -->
    <div v-else class="week-view">
      <div class="week-header">
        <div class="week-gutter" />
        <div
            v-for="day in weekDays"
            :key="isoDate(day)"
            :class="['week-day-header', { 'week-today': isToday(day) }]"
        >
          <span class="wdh-name">{{ DAYS_SHORT[day.getDay()] }}</span>
          <span :class="['wdh-num', { 'wdh-today-badge': isToday(day) }]">{{ day.getDate() }}</span>
          <span v-if="eventsForDate(day).length" class="wdh-count">
            {{ eventsForDate(day).length }}
          </span>
        </div>
      </div>

      <div class="week-scroll">
        <div class="week-grid" :style="{ height: `${(HOUR_END - HOUR_START) * SLOT_HEIGHT}px` }">
          <div class="week-gutter-col">
            <div
                v-for="h in hours"
                :key="h"
                class="hour-label"
                :style="{ height: `${SLOT_HEIGHT}px` }"
            >{{ String(h).padStart(2,'0') }}:00</div>
          </div>

          <div
              v-for="day in weekDays"
              :key="isoDate(day)"
              :class="['week-col', { 'week-col-today': isToday(day) }]"
          >
            <div
                v-for="h in hours"
                :key="h"
                class="grid-line"
                :style="{ top: `${(h - HOUR_START) * SLOT_HEIGHT}px` }"
            />
            <div
                v-if="isToday(day)"
                class="now-line"
                :style="{ top: `${((new Date().getHours() - HOUR_START) + new Date().getMinutes()/60) * SLOT_HEIGHT}px` }"
            />
            <div
                v-for="ev in eventsForDayWeek(day)"
                :key="ev.id"
                class="week-event"
                :style="{ ...eventStyle(ev), background: eventColor(ev.kind) }"
                :title="`${ev.time} - ${ev.title}\n${ev.subtitle}`"
            >
              <div class="we-time">{{ ev.time }}</div>
              <div class="we-title">{{ ev.title }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="legend">
        <div v-for="(color, kind) in kindColor" :key="kind" class="legend-item">
          <span class="legend-dot" :style="{ background: color }" />
          <span>{{ t(`schedule.kinds.${kind}`) }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.cal-page { padding: 1.5rem 2rem; display: flex; flex-direction: column; gap: 1.5rem; }

.cal-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; }
.cal-title { font-size: 1.6rem; font-weight: 700; color: var(--p-primary-color, #3b82f6); margin: 0 0 .25rem; }
.cal-subtitle { color: #6b7280; margin: 0; font-size: .9rem; }
.cal-controls { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; }
.cal-period { font-weight: 700; font-size: 1rem; min-width: 200px; text-align: center; }

.loading-state { display: flex; justify-content: center; padding: 4rem; }

/* ── Month ─────────────────────────────────────────────────────────────────── */
.month-grid { display: flex; flex-direction: column; gap: .25rem; }
.month-header-row { display: grid; grid-template-columns: repeat(7,1fr); }
.month-day-header { text-align: center; padding: .5rem; font-size: .78rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; }
.month-cells { display: grid; grid-template-columns: repeat(7,1fr); gap: 3px; }
.month-cell { min-height: 108px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: .5rem; cursor: pointer; transition: border-color .15s, box-shadow .15s; overflow: hidden; }
.month-cell:hover { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,.15); }
.month-cell.outside { background: #f9fafb; cursor: default; pointer-events: none; }
.month-cell.today { border-color: #3b82f6; background: #eff6ff; }
.month-cell.selected { box-shadow: 0 0 0 3px rgba(59,130,246,.3); }
.cell-number { font-weight: 700; font-size: .88rem; color: #374151; margin-bottom: .3rem; }
.month-cell.today .cell-number { color: #3b82f6; }
.cell-events { display: flex; flex-direction: column; gap: 2px; }
.cell-chip { font-size: .68rem; color: #fff; border-radius: 4px; padding: 2px 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cell-more { font-size: .7rem; color: #6b7280; padding: 2px 4px; }

.day-detail-panel { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.25rem; box-shadow: 0 4px 16px rgba(0,0,0,.08); }
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.panel-date { font-weight: 700; font-size: 1rem; color: #111827; }
.panel-events { display: flex; flex-direction: column; gap: .75rem; }
.panel-event { display: flex; align-items: flex-start; gap: 1rem; padding: .75rem; background: #f9fafb; border-radius: 8px; }
.panel-dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
.panel-event-body { flex: 1; }
.panel-event-time { font-size: .75rem; color: #6b7280; }
.panel-event-title { font-weight: 600; color: #111827; }
.panel-event-sub { font-size: .8rem; color: #9ca3af; }

.slide-enter-active, .slide-leave-active { transition: all .22s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-6px); }

/* ── Week ─────────────────────────────────────────────────────────────────── */
.week-view { display: flex; flex-direction: column; gap: .75rem; }
.week-header { display: flex; }
.week-gutter { width: 56px; flex-shrink: 0; }
.week-day-header { flex: 1; text-align: center; padding: .4rem .25rem; display: flex; flex-direction: column; align-items: center; gap: .15rem; border-bottom: 2px solid #e5e7eb; }
.week-day-header.week-today { border-bottom-color: #3b82f6; }
.wdh-name { font-size: .7rem; font-weight: 700; color: #6b7280; text-transform: uppercase; }
.wdh-num { font-size: 1.1rem; font-weight: 700; color: #374151; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.wdh-today-badge { background: #3b82f6; color: #fff; }
.wdh-count { font-size: .65rem; background: #e0e7ff; color: #4f46e5; border-radius: 99px; padding: 1px 6px; font-weight: 700; }

.week-scroll { overflow-y: auto; max-height: 580px; border: 1px solid #e5e7eb; border-radius: 10px; }
.week-grid { display: flex; position: relative; }
.week-gutter-col { width: 56px; flex-shrink: 0; background: #fff; position: sticky; left: 0; z-index: 3; }
.hour-label { display: flex; align-items: flex-start; justify-content: flex-end; padding-right: .75rem; padding-top: .25rem; font-size: .7rem; color: #9ca3af; font-weight: 600; box-sizing: border-box; border-bottom: 1px solid #f3f4f6; }
.week-col { flex: 1; position: relative; border-left: 1px solid #f3f4f6; }
.week-col-today { background: rgba(239,246,255,.45); }
.grid-line { position: absolute; left: 0; right: 0; border-top: 1px solid #f3f4f6; height: 0; pointer-events: none; }
.now-line { position: absolute; left: 0; right: 0; height: 2px; background: #ef4444; z-index: 5; pointer-events: none; }
.now-line::before { content: ''; position: absolute; left: -4px; top: -4px; width: 10px; height: 10px; background: #ef4444; border-radius: 50%; }

.week-event { position: absolute; left: 2px; right: 2px; border-radius: 5px; padding: 3px 6px; overflow: hidden; cursor: pointer; z-index: 2; color: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.2); transition: filter .15s; }
.week-event:hover { filter: brightness(1.12); }
.we-time { font-size: .62rem; opacity: .9; }
.we-title { font-size: .73rem; font-weight: 600; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.legend { display: flex; gap: 1.25rem; flex-wrap: wrap; }
.legend-item { display: flex; align-items: center; gap: .4rem; font-size: .8rem; color: #6b7280; }
.legend-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
</style>
