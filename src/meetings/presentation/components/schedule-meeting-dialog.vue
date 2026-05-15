<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    visible: { type: Boolean, default: false }
});
const emit = defineEmits(['update:visible', 'schedule']);
const { t } = useI18n();

// ── Form state ────────────────────────────────────────────────────────────────
const form = ref({
    title:       '',
    date:        '',
    startTime:   '',
    endTime:     '',
    environment: 'Virtual',
    autoZoom:    true,
    agenda:      '',
    segment:     'General'
});

// Reset form when dialog opens
watch(() => props.visible, (val) => {
    if (val) {
        form.value = {
            title: '', date: '', startTime: '', endTime: '',
            environment: 'Virtual', autoZoom: true, agenda: '', segment: 'General'
        };
        participantSearch.value = '';
        selectedParticipants.value = [...defaultParticipants];
    }
});

// ── Participants ──────────────────────────────────────────────────────────────
const participantSearch = ref('');

const allMembers = [
    { name: 'Sarah Johnson',   status: 'available',   avatar: 'S', color: '#8b5cf6' },
    { name: 'Alex Sterling',   status: 'available',   avatar: 'A', color: '#3b82f6' },
    { name: 'Michael Chen',    status: 'in-meeting',  avatar: 'M', color: '#f59e0b' },
    { name: 'Elena Rodriguez', status: 'available',   avatar: 'E', color: '#10b981' },
    { name: 'Marcus Lee',      status: 'available',   avatar: 'M', color: '#ef4444' },
    { name: 'Daniel Brooks',   status: 'in-meeting',  avatar: 'D', color: '#06b6d4' },
    { name: 'Olivia Carter',   status: 'available',   avatar: 'O', color: '#ec4899' },
    { name: 'Patricia Lee',    status: 'available',   avatar: 'P', color: '#6366f1' },
];

const defaultParticipants = allMembers.slice(0, 3);
const selectedParticipants = ref([...defaultParticipants]);

const searchResults = computed(() => {
    if (!participantSearch.value.trim()) return [];
    const q = participantSearch.value.toLowerCase();
    return allMembers.filter(m =>
        m.name.toLowerCase().includes(q) &&
        !selectedParticipants.value.find(p => p.name === m.name)
    );
});

function addParticipant(member) {
    selectedParticipants.value.push(member);
    participantSearch.value = '';
}
function removeParticipant(member) {
    selectedParticipants.value = selectedParticipants.value.filter(p => p.name !== member.name);
}

// ── Availability insight (simulated) ─────────────────────────────────────────
const busyParticipants = computed(() =>
    selectedParticipants.value.filter(p => p.status === 'in-meeting')
);
const suggestedSlots = ['Tomorrow, 10:30 AM', 'Friday, 2:00 PM'];

// ── Computed duration ─────────────────────────────────────────────────────────
const duration = computed(() => {
    if (!form.value.startTime || !form.value.endTime) return null;
    const [sh, sm] = form.value.startTime.split(':').map(Number);
    const [eh, em] = form.value.endTime.split(':').map(Number);
    const mins = (eh * 60 + em) - (sh * 60 + sm);
    return mins > 0 ? mins : null;
});

// ── Submit ────────────────────────────────────────────────────────────────────
const submitting = ref(false);

async function submit() {
    if (!form.value.title.trim() || !form.value.date) return;
    submitting.value = true;
    try {
        const payload = {
            title:       form.value.title,
            segment:     form.value.segment,
            date:        form.value.date,
            time:        form.value.startTime || '09:00',
            duration:    duration.value ?? 60,
            location:    form.value.environment === 'Virtual' ? 'Virtual' : 'In-Person',
            type:        'Planning',
            status:      'Upcoming',
            organizer:   'Alex Sterling',
            attendees:   selectedParticipants.value.map(p => p.name),
            description: form.value.agenda,
            minutes:     [],
            agreements:  []
        };
        emit('schedule', payload);
        close();
    } finally {
        submitting.value = false;
    }
}

function close() { emit('update:visible', false); }
</script>

<template>
  <pv-dialog
      :visible="visible"
      @update:visible="$emit('update:visible', $event)"
      :modal="true"
      :closable="false"
      :draggable="false"
      :style="{ width: '880px', maxWidth: '95vw', padding: 0 }"
      :pt="{ content: { style: 'padding:0' }, header: { style: 'display:none' } }"
  >
    <div class="smd-root">

      <!-- ══ LEFT: Form ══ -->
      <div class="smd-form">

        <!-- Header -->
        <div class="smd-form-header">
          <div>
            <h2 class="smd-title">{{ t('meetings.dialog.title') }}</h2>
            <p class="smd-subtitle">{{ t('meetings.dialog.subtitle') }}</p>
          </div>
          <button class="smd-close" @click="close">
            <i class="pi pi-times" />
          </button>
        </div>

        <!-- Meeting Title -->
        <div class="smd-field">
          <label class="smd-label">{{ t('meetings.dialog.meetingTitle') }}</label>
          <pv-input-text
              v-model="form.title"
              :placeholder="t('meetings.dialog.titlePlaceholder')"
              class="w-full"
          />
        </div>

        <!-- Date / Start / End -->
        <div class="smd-row-3">
          <div class="smd-field">
            <label class="smd-label">{{ t('meetings.dialog.date') }}</label>
            <input v-model="form.date" type="date" class="smd-input" />
          </div>
          <div class="smd-field">
            <label class="smd-label">{{ t('meetings.dialog.startTime') }}</label>
            <input v-model="form.startTime" type="time" class="smd-input" />
          </div>
          <div class="smd-field">
            <label class="smd-label">{{ t('meetings.dialog.endTime') }}</label>
            <input v-model="form.endTime" type="time" class="smd-input" />
          </div>
        </div>

        <!-- Duration badge -->
        <div v-if="duration" class="smd-duration-badge">
          <i class="pi pi-clock" /> {{ duration }} min
        </div>

        <!-- Environment -->
        <div class="smd-field">
          <label class="smd-label">{{ t('meetings.dialog.environment') }}</label>
          <div class="smd-env-toggle">
            <button
                :class="['smd-env-btn', { active: form.environment === 'Virtual' }]"
                @click="form.environment = 'Virtual'"
            >
              <i class="pi pi-video" /> {{ t('meetings.dialog.virtual') }}
            </button>
            <button
                :class="['smd-env-btn', { active: form.environment === 'In-Person' }]"
                @click="form.environment = 'In-Person'"
            >
              <i class="pi pi-building" /> {{ t('meetings.dialog.inPerson') }}
            </button>
          </div>
        </div>

        <!-- Auto Zoom -->
        <div v-if="form.environment === 'Virtual'" class="smd-zoom-row">
          <div class="smd-zoom-left">
            <i class="pi pi-link" style="color:#6b7280" />
            <span>{{ t('meetings.dialog.autoZoom') }}</span>
          </div>
          <div
              :class="['smd-toggle', { on: form.autoZoom }]"
              @click="form.autoZoom = !form.autoZoom"
          >
            <div class="smd-toggle-knob" />
          </div>
        </div>

        <!-- Agenda -->
        <div class="smd-field smd-field-grow">
          <label class="smd-label">{{ t('meetings.dialog.agenda') }}</label>
          <div class="smd-agenda-box">
            <i class="pi pi-circle-fill" style="color:#d1d5db; font-size:.5rem; margin-top:.35rem; flex-shrink:0" />
            <pv-textarea
                v-model="form.agenda"
                :placeholder="t('meetings.dialog.agendaPlaceholder')"
                rows="4"
                class="w-full smd-textarea"
            />
          </div>
        </div>

        <!-- Footer actions -->
        <div class="smd-footer">
          <pv-button
              :label="t('meetings.dialog.cancel')"
              text
              severity="secondary"
              @click="close"
          />
          <pv-button
              :label="t('meetings.dialog.schedule')"
              :loading="submitting"
              :disabled="!form.title.trim() || !form.date"
              @click="submit"
          />
        </div>
      </div>

      <!-- ══ RIGHT: Participants ══ -->
      <div class="smd-participants">

        <div class="smd-part-header">
          <span class="smd-part-title">
            {{ t('meetings.dialog.participants') }}
            ({{ selectedParticipants.length }})
          </span>
        </div>

        <!-- Search -->
        <div class="smd-search-wrap">
          <i class="pi pi-search smd-search-icon" />
          <input
              v-model="participantSearch"
              class="smd-search"
              :placeholder="t('meetings.dialog.addTeamMembers')"
          />
        </div>

        <!-- Search results dropdown -->
        <div v-if="searchResults.length" class="smd-search-results">
          <div
              v-for="m in searchResults"
              :key="m.name"
              class="smd-search-result"
              @click="addParticipant(m)"
          >
            <div class="smd-av" :style="{ background: m.color }">{{ m.avatar }}</div>
            <span>{{ m.name }}</span>
            <i class="pi pi-plus" style="margin-left:auto; color:#6b7280; font-size:.75rem" />
          </div>
        </div>

        <!-- Participant list -->
        <div class="smd-part-list">
          <div
              v-for="p in selectedParticipants"
              :key="p.name"
              class="smd-part-row"
          >
            <div class="smd-av" :style="{ background: p.color }">{{ p.avatar }}</div>
            <div class="smd-part-info">
              <span class="smd-part-name">{{ p.name }}</span>
              <span :class="['smd-part-status', p.status === 'available' ? 'status-avail' : 'status-busy']">
                {{ p.status === 'available' ? t('meetings.dialog.available') : t('meetings.dialog.inMeeting') }}
              </span>
            </div>
            <button class="smd-remove" @click="removeParticipant(p)">
              <i class="pi pi-minus-circle" />
            </button>
          </div>
        </div>

        <!-- Availability Insights -->
        <div class="smd-insights">
          <span class="smd-insights-label">{{ t('meetings.dialog.availabilityInsights') }}</span>
          <div v-if="busyParticipants.length" class="smd-conflict">
            <div class="smd-conflict-head">
              <i class="pi pi-exclamation-triangle" style="color:#f59e0b" />
              <span>{{ t('meetings.dialog.schedulingConflict') }}</span>
            </div>
            <p class="smd-conflict-body">
              <strong>{{ busyParticipants.map(p => p.name).join(', ') }}</strong>
              {{ t('meetings.dialog.conflictMsg') }}
            </p>
            <div class="smd-slots">
              <div
                  v-for="slot in suggestedSlots"
                  :key="slot"
                  class="smd-slot"
                    @click="form.startTime = slot.includes('10:30') ? '10:30' : '14:00'"
              >{{ slot }}</div>
            </div>
          </div>
          <div v-else class="smd-no-conflict">
            <i class="pi pi-check-circle" style="color:#10b981" />
            <span>{{ t('meetings.dialog.allAvailable') }}</span>
          </div>
        </div>

      </div>
    </div>
  </pv-dialog>
</template>

<style scoped>
/* ─── Root layout ─────────────────────────────────────────────────────────── */
.smd-root {
  display: flex;
  min-height: 580px;
  border-radius: 16px;
  overflow: hidden;
}

/* ─── LEFT: Form ──────────────────────────────────────────────────────────── */
.smd-form {
  flex: 1;
  padding: 2rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  border-right: 1px solid #f3f4f6;
  overflow-y: auto;
}

.smd-form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.smd-title { font-size: 1.4rem; font-weight: 800; color: #111827; margin: 0 0 .2rem; }
.smd-subtitle { font-size: .85rem; color: #6b7280; margin: 0; }
.smd-close {
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: background .15s;
}
.smd-close:hover { background: #e5e7eb; }

.smd-field { display: flex; flex-direction: column; gap: .4rem; }
.smd-field-grow { flex: 1; }
.smd-label {
  font-size: .7rem;
  font-weight: 800;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: .07em;
}

.smd-input {
  width: 100%;
  padding: .65rem .9rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: .9rem;
  color: #374151;
  outline: none;
  transition: border-color .15s;
  background: #fff;
  box-sizing: border-box;
}
.smd-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }

.smd-row-3 {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: .75rem;
}

.smd-duration-badge {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  background: #eff6ff;
  color: #3b82f6;
  font-size: .78rem;
  font-weight: 700;
  border-radius: 99px;
  padding: .25rem .75rem;
  width: fit-content;
  margin-top: -.5rem;
}

/* Environment toggle */
.smd-env-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .5rem;
}
.smd-env-btn {
  display: flex; align-items: center; justify-content: center; gap: .5rem;
  padding: .7rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  font-size: .88rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all .15s;
}
.smd-env-btn:hover { border-color: #93c5fd; color: #3b82f6; }
.smd-env-btn.active { border-color: #3b82f6; color: #3b82f6; background: #eff6ff; }

/* Auto Zoom row */
.smd-zoom-row {
  display: flex; align-items: center; justify-content: space-between;
  background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px;
  padding: .75rem 1rem;
}
.smd-zoom-left { display: flex; align-items: center; gap: .6rem; font-size: .88rem; color: #374151; font-weight: 500; }
.smd-toggle {
  width: 42px; height: 24px; border-radius: 99px; background: #d1d5db;
  cursor: pointer; position: relative; transition: background .2s;
}
.smd-toggle.on { background: #3b82f6; }
.smd-toggle-knob {
  position: absolute; top: 2px; left: 2px;
  width: 20px; height: 20px; border-radius: 50%; background: #fff;
  transition: left .2s; box-shadow: 0 1px 3px rgba(0,0,0,.2);
}
.smd-toggle.on .smd-toggle-knob { left: 20px; }

/* Agenda */
.smd-agenda-box {
  display: flex;
  gap: .6rem;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: .75rem;
  background: #fff;
  min-height: 110px;
}
.smd-textarea { border: none !important; box-shadow: none !important; padding: 0 !important; resize: none; }

/* Footer */
.smd-footer {
  display: flex;
  justify-content: flex-end;
  gap: .75rem;
  padding-top: .5rem;
  border-top: 1px solid #f3f4f6;
  margin-top: auto;
}

/* ─── RIGHT: Participants ─────────────────────────────────────────────────── */
.smd-participants {
  width: 280px;
  flex-shrink: 0;
  background: #fff;
  padding: 1.75rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
}

.smd-part-header { }
.smd-part-title { font-size: .72rem; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: .07em; }

/* Search */
.smd-search-wrap {
  position: relative;
}
.smd-search-icon {
  position: absolute; left: .75rem; top: 50%; transform: translateY(-50%);
  color: #9ca3af; font-size: .8rem;
}
.smd-search {
  width: 100%;
  padding: .6rem .75rem .6rem 2.1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: .85rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color .15s;
}
.smd-search:focus { border-color: #3b82f6; }

.smd-search-results {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,.1);
  margin-top: -.5rem;
}
.smd-search-result {
  display: flex; align-items: center; gap: .6rem;
  padding: .6rem .8rem; cursor: pointer; font-size: .85rem; color: #374151;
  transition: background .12s;
}
.smd-search-result:hover { background: #f9fafb; }

/* Avatar */
.smd-av {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .75rem; font-weight: 700; color: #fff; flex-shrink: 0;
}

/* Participant row */
.smd-part-list { display: flex; flex-direction: column; gap: .5rem; }
.smd-part-row { display: flex; align-items: center; gap: .7rem; }
.smd-part-info { flex: 1; display: flex; flex-direction: column; }
.smd-part-name { font-size: .85rem; font-weight: 600; color: #111827; }
.smd-part-status { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
.status-avail { color: #10b981; }
.status-busy  { color: #ef4444; }
.smd-remove {
  background: none; border: none; cursor: pointer;
  color: #9ca3af; transition: color .15s; padding: .15rem;
}
.smd-remove:hover { color: #ef4444; }

/* Insights */
.smd-insights { display: flex; flex-direction: column; gap: .6rem; margin-top: auto; }
.smd-insights-label { font-size: .68rem; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: .07em; }
.smd-conflict {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: .85rem;
  display: flex; flex-direction: column; gap: .5rem;
}
.smd-conflict-head { display: flex; align-items: center; gap: .4rem; font-size: .82rem; font-weight: 700; color: #92400e; }
.smd-conflict-body { font-size: .78rem; color: #6b7280; margin: 0; line-height: 1.4; }
.smd-conflict-body strong { color: #374151; }
.smd-slots { display: flex; flex-direction: column; gap: .35rem; }
.smd-slot {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: .4rem .7rem;
  font-size: .8rem;
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
  transition: background .12s;
}
.smd-slot:hover { background: #eff6ff; }
.smd-no-conflict {
  display: flex; align-items: center; gap: .5rem;
  font-size: .82rem; color: #374151;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  border-radius: 10px; padding: .75rem;
}
</style>
