<script setup>
import { ref, watch } from 'vue';
import { ProjectStore } from '../../application/project.store.js';

const props = defineProps({
  visible: { type: Boolean, default: false }
});
const emit = defineEmits(['update:visible', 'created']);

const store = ProjectStore();

const categories = [
  'Infrastructure Modernization', 'Commercial Real Estate', 'Logistics Optimization',
  'Software Development', 'Digital Transformation', 'Security & Compliance',
  'Data Analytics', 'Cloud Migration', 'Product Launch', 'Research & Development'
];

const statuses = [
  { label: 'Healthy',  value: 'Healthy',  color: '#16a34a' },
  { label: 'Warning',  value: 'Warning',  color: '#f59e0b' },
  { label: 'Critical', value: 'Critical', color: '#dc2626' },
];

const teamSuggestions = [
  { name: 'Alex Sterling',   avatar: 'AS', color: '#3b82f6' },
  { name: 'Sarah Johnson',   avatar: 'SJ', color: '#8b5cf6' },
  { name: 'Michael Chen',    avatar: 'MC', color: '#f59e0b' },
  { name: 'Elena Rodriguez', avatar: 'ER', color: '#10b981' },
  { name: 'Marcus Lee',      avatar: 'ML', color: '#ef4444' },
  { name: 'Daniel Brooks',   avatar: 'DB', color: '#06b6d4' },
];

const defaultForm = () => ({
  name: '',
  category: '',
  description: '',
  status: 'Healthy',
  progress: 0,
  manager: '',
  startDate: '',
  endDate: '',
  teamMembers: [],
});

const form = ref(defaultForm());
const step = ref(1);
const saving = ref(false);
const errorMsg = ref('');
const memberSearch = ref('');

watch(() => props.visible, (val) => {
  if (val) {
    form.value = defaultForm();
    step.value = 1;
    errorMsg.value = '';
    memberSearch.value = '';
  }
});

function close() { emit('update:visible', false); }

function filteredSuggestions() {
  const q = memberSearch.value.toLowerCase();
  return teamSuggestions.filter(m =>
    m.name.toLowerCase().includes(q) &&
    !form.value.teamMembers.find(t => t.name === m.name)
  );
}

function addMember(member) {
  form.value.teamMembers.push({ ...member, id: Date.now() });
  memberSearch.value = '';
}

function removeMember(name) {
  form.value.teamMembers = form.value.teamMembers.filter(m => m.name !== name);
}

function nextStep() {
  errorMsg.value = '';
  if (step.value === 1) {
    if (!form.value.name.trim()) { errorMsg.value = 'Project name is required.'; return; }
    if (!form.value.category)    { errorMsg.value = 'Please select a category.'; return; }
  }
  step.value++;
}

function prevStep() { step.value--; }

async function submit() {
  errorMsg.value = '';
  if (!form.value.manager.trim()) { errorMsg.value = 'Project manager is required.'; return; }
  saving.value = true;
  try {
    const payload = {
      name: form.value.name,
      category: form.value.category,
      description: form.value.description,
      status: form.value.status,
      progress: Number(form.value.progress),
      manager: form.value.manager,
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      teamMembers: form.value.teamMembers.map((m, i) => ({
        id: i + 1, name: m.name, avatar: m.avatar[0]
      })),
      milestones: []
    };
    const created = await store.createProject(payload);
    emit('created', created);
    close();
  } catch (e) {
    errorMsg.value = 'Something went wrong. Please try again.';
  } finally {
    saving.value = false;
  }
}

const statusColor = (val) => statuses.find(s => s.value === val)?.color || '#16a34a';
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="visible" class="dialog-backdrop" @click.self="close">
        <div class="dialog">

          <!-- Header -->
          <div class="dialog-header">
            <div class="dialog-title-row">
              <div class="dialog-icon"><i class="pi pi-folder-open"></i></div>
              <div>
                <h2 class="dialog-title">New Project</h2>
                <p class="dialog-subtitle">Fill in the details below to create your project</p>
              </div>
            </div>
            <button class="close-btn" @click="close"><i class="pi pi-times"></i></button>
          </div>

          <!-- Step indicator -->
          <div class="steps-bar">
            <div
              v-for="n in 3" :key="n"
              class="step-item"
              :class="{ active: step === n, done: step > n }"
            >
              <div class="step-circle">
                <i v-if="step > n" class="pi pi-check"></i>
                <span v-else>{{ n }}</span>
              </div>
              <span class="step-label">{{ ['Details', 'Team', 'Review'][n-1] }}</span>
            </div>
            <div class="step-connector" :style="{ width: ((step - 1) / 2 * 100) + '%' }"></div>
          </div>

          <!-- Body -->
          <div class="dialog-body">

            <!-- Step 1: Project Details -->
            <div v-if="step === 1" class="step-content">
              <div class="field-grid">
                <div class="field full">
                  <label>Project Name <span class="req">*</span></label>
                  <div class="input-wrap">
                    <i class="pi pi-briefcase field-icon"></i>
                    <input v-model="form.name" placeholder="e.g. Aurora Infrastructure Phase 3" class="field-input" />
                  </div>
                </div>

                <div class="field">
                  <label>Category <span class="req">*</span></label>
                  <div class="input-wrap select-wrap">
                    <i class="pi pi-tag field-icon"></i>
                    <select v-model="form.category" class="field-input field-select">
                      <option value="" disabled>Select category…</option>
                      <option v-for="cat in categories" :key="cat">{{ cat }}</option>
                    </select>
                  </div>
                </div>

                <div class="field">
                  <label>Status</label>
                  <div class="status-pills">
                    <button
                      v-for="s in statuses" :key="s.value"
                      type="button"
                      class="status-pill"
                      :class="{ selected: form.status === s.value }"
                      :style="form.status === s.value ? { background: s.color, borderColor: s.color, color: '#fff' } : { borderColor: s.color, color: s.color }"
                      @click="form.status = s.value"
                    >
                      <span class="status-dot" :style="{ background: s.color }"></span>
                      {{ s.label }}
                    </button>
                  </div>
                </div>

                <div class="field full">
                  <label>Description</label>
                  <textarea
                    v-model="form.description"
                    placeholder="Brief description of the project goals and scope…"
                    class="field-textarea"
                    rows="3"
                  ></textarea>
                </div>

                <div class="field">
                  <label>Start Date</label>
                  <div class="input-wrap">
                    <i class="pi pi-calendar field-icon"></i>
                    <input v-model="form.startDate" type="date" class="field-input date-input" />
                  </div>
                </div>

                <div class="field">
                  <label>End Date</label>
                  <div class="input-wrap">
                    <i class="pi pi-calendar field-icon"></i>
                    <input v-model="form.endDate" type="date" class="field-input date-input" />
                  </div>
                </div>

                <div class="field full">
                  <label>Initial Progress — {{ form.progress }}%</label>
                  <div class="progress-slider-wrap">
                    <input
                      v-model="form.progress" type="range"
                      min="0" max="100" step="1"
                      class="progress-slider"
                    />
                    <div class="progress-preview">
                      <div class="progress-track">
                        <div class="progress-fill" :style="{ width: form.progress + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Team -->
            <div v-if="step === 2" class="step-content">
              <div class="field full">
                <label>Project Manager <span class="req">*</span></label>
                <div class="input-wrap">
                  <i class="pi pi-user field-icon"></i>
                  <input v-model="form.manager" placeholder="e.g. Sarah Johnson" class="field-input" />
                </div>
              </div>

              <div class="field full" style="margin-top: 20px;">
                <label>Team Members</label>
                <div class="input-wrap">
                  <i class="pi pi-search field-icon"></i>
                  <input
                    v-model="memberSearch"
                    placeholder="Search team members…"
                    class="field-input"
                  />
                </div>

                <!-- Search results -->
                <div v-if="memberSearch && filteredSuggestions().length" class="member-suggestions">
                  <button
                    v-for="m in filteredSuggestions()" :key="m.name"
                    type="button" class="member-suggestion"
                    @click="addMember(m)"
                  >
                    <span class="member-avatar" :style="{ background: m.color }">{{ m.avatar[0] }}</span>
                    <span class="member-name">{{ m.name }}</span>
                    <i class="pi pi-plus-circle member-add-icon"></i>
                  </button>
                </div>
              </div>

              <!-- Selected members -->
              <div v-if="form.teamMembers.length" class="selected-members">
                <div v-for="m in form.teamMembers" :key="m.name" class="selected-member">
                  <span class="member-avatar sm" :style="{ background: m.color }">{{ m.avatar[0] }}</span>
                  <span class="member-name">{{ m.name }}</span>
                  <button type="button" class="remove-member" @click="removeMember(m.name)">
                    <i class="pi pi-times"></i>
                  </button>
                </div>
              </div>
              <div v-else class="empty-team">
                <i class="pi pi-users"></i>
                <span>No members added yet. Search above to add team members.</span>
              </div>
            </div>

            <!-- Step 3: Review -->
            <div v-if="step === 3" class="step-content review">
              <div class="review-header">
                <div class="review-status-dot" :style="{ background: statusColor(form.status) }"></div>
                <div>
                  <h3 class="review-name">{{ form.name || '—' }}</h3>
                  <p class="review-cat">{{ form.category || '—' }}</p>
                </div>
                <span class="review-badge" :style="{ background: statusColor(form.status) + '20', color: statusColor(form.status) }">
                  {{ form.status }}
                </span>
              </div>

              <div class="review-grid">
                <div class="review-item">
                  <span class="review-label"><i class="pi pi-align-left"></i> Description</span>
                  <span class="review-value">{{ form.description || 'Not provided' }}</span>
                </div>
                <div class="review-item">
                  <span class="review-label"><i class="pi pi-user"></i> Manager</span>
                  <span class="review-value">{{ form.manager || '—' }}</span>
                </div>
                <div class="review-item">
                  <span class="review-label"><i class="pi pi-calendar"></i> Timeline</span>
                  <span class="review-value">{{ form.startDate || '—' }} → {{ form.endDate || '—' }}</span>
                </div>
                <div class="review-item">
                  <span class="review-label"><i class="pi pi-chart-bar"></i> Initial Progress</span>
                  <div class="review-progress">
                    <div class="review-track">
                      <div class="review-fill" :style="{ width: form.progress + '%' }"></div>
                    </div>
                    <span>{{ form.progress }}%</span>
                  </div>
                </div>
                <div class="review-item full">
                  <span class="review-label"><i class="pi pi-users"></i> Team ({{ form.teamMembers.length }})</span>
                  <div class="review-team">
                    <span
                      v-for="m in form.teamMembers" :key="m.name"
                      class="review-avatar" :style="{ background: m.color }"
                      :title="m.name"
                    >{{ m.avatar[0] }}</span>
                    <span v-if="!form.teamMembers.length" class="review-value">No members</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Error -->
          <div v-if="errorMsg" class="dialog-error">
            <i class="pi pi-exclamation-triangle"></i> {{ errorMsg }}
          </div>

          <!-- Footer -->
          <div class="dialog-footer">
            <button class="btn-ghost" @click="step > 1 ? prevStep() : close()">
              <i :class="step > 1 ? 'pi pi-arrow-left' : 'pi pi-times'"></i>
              {{ step > 1 ? 'Back' : 'Cancel' }}
            </button>
            <div class="footer-right">
              <span class="step-count">Step {{ step }} of 3</span>
              <button v-if="step < 3" class="btn-primary" @click="nextStep()">
                Next <i class="pi pi-arrow-right"></i>
              </button>
              <button v-else class="btn-primary" :disabled="saving" @click="submit()">
                <i v-if="saving" class="pi pi-spin pi-spinner"></i>
                <i v-else class="pi pi-check"></i>
                {{ saving ? 'Creating…' : 'Create Project' }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Backdrop */
.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Dialog card */
.dialog {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 32px 80px rgba(0,0,0,0.25);
  overflow: hidden;
}

/* Header */
.dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 28px 20px;
  border-bottom: 1px solid #f1f5f9;
}
.dialog-title-row {
  display: flex;
  align-items: center;
  gap: 14px;
}
.dialog-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  flex-shrink: 0;
}
.dialog-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px;
}
.dialog-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}
.close-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
}
.close-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }

/* Steps bar */
.steps-bar {
  display: flex;
  align-items: center;
  padding: 16px 28px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
  gap: 0;
}
.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  z-index: 1;
  position: relative;
}
.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  background: white;
  transition: all 0.2s;
  flex-shrink: 0;
}
.step-item.active .step-circle {
  border-color: #2563eb;
  background: #2563eb;
  color: white;
}
.step-item.done .step-circle {
  border-color: #16a34a;
  background: #16a34a;
  color: white;
}
.step-label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
}
.step-item.active .step-label { color: #2563eb; }
.step-item.done .step-label { color: #16a34a; }
.step-connector {
  position: absolute;
  top: 50%;
  left: 28px;
  height: 2px;
  background: linear-gradient(90deg, #16a34a, #2563eb);
  transform: translateY(-50%);
  z-index: 0;
  transition: width 0.3s ease;
}

/* Body */
.dialog-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
}
.dialog-body::-webkit-scrollbar { width: 4px; }
.dialog-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }

.step-content { display: flex; flex-direction: column; gap: 6px; }

/* Fields */
.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.field { display: flex; flex-direction: column; gap: 6px; }
.field.full { grid-column: 1 / -1; }
.field label {
  font-size: 12px;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.req { color: #dc2626; }

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.field-icon {
  position: absolute;
  left: 12px;
  color: #94a3b8;
  font-size: 14px;
  pointer-events: none;
}
.field-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: #1e293b;
  background: #f8fafc;
  outline: none;
  transition: all 0.15s;
  font-family: inherit;
}
.field-input:focus {
  border-color: #2563eb;
  background: white;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
.select-wrap .field-icon { z-index: 1; }
.field-select { appearance: none; cursor: pointer; padding-right: 32px; }
.field-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: #1e293b;
  background: #f8fafc;
  outline: none;
  resize: vertical;
  font-family: inherit;
  transition: all 0.15s;
}
.field-textarea:focus { border-color: #2563eb; background: white; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
.date-input { color: #1e293b; cursor: pointer; }

/* Status pills */
.status-pills { display: flex; gap: 8px; flex-wrap: wrap; }
.status-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1.5px solid;
  background: white;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

/* Progress slider */
.progress-slider-wrap { display: flex; flex-direction: column; gap: 8px; }
.progress-slider {
  width: 100%;
  accent-color: #2563eb;
  height: 4px;
  cursor: pointer;
}
.progress-preview { display: flex; align-items: center; gap: 10px; }
.progress-track { flex: 1; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
.progress-fill  { height: 100%; background: linear-gradient(90deg, #2563eb, #6366f1); border-radius: 3px; transition: width 0.2s; }

/* Team / member search */
.member-suggestions {
  margin-top: 6px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
.member-suggestion {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
}
.member-suggestion:hover { background: #f1f5f9; }
.member-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: white; flex-shrink: 0;
}
.member-avatar.sm { width: 28px; height: 28px; font-size: 11px; }
.member-name { flex: 1; font-size: 13px; font-weight: 600; color: #1e293b; }
.member-add-icon { color: #2563eb; font-size: 16px; }

.selected-members { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
.selected-member {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px;
  background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;
}
.remove-member {
  margin-left: auto; background: none; border: none; cursor: pointer;
  color: #94a3b8; font-size: 13px; padding: 4px;
  border-radius: 4px; transition: all 0.15s;
}
.remove-member:hover { color: #dc2626; background: #fee2e2; }

.empty-team {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; padding: 32px; color: #94a3b8; font-size: 13px;
  background: #f8fafc; border-radius: 10px; border: 1px dashed #e2e8f0;
  margin-top: 16px; text-align: center;
}
.empty-team i { font-size: 28px; }

/* Review step */
.review {  gap: 20px; }
.review-header {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 20px; background: #f8fafc; border-radius: 12px;
  border: 1px solid #e2e8f0;
}
.review-status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.review-name { font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 2px; }
.review-cat  { font-size: 12px; color: #64748b; margin: 0; }
.review-badge {
  margin-left: auto; padding: 4px 12px; border-radius: 20px;
  font-size: 11px; font-weight: 800; letter-spacing: 0.5px;
}
.review-grid { display: flex; flex-direction: column; gap: 12px; }
.review-item {
  display: flex; flex-direction: column; gap: 4px;
  padding: 12px 16px; background: #f8fafc; border-radius: 10px;
  border: 1px solid #f1f5f9;
}
.review-item.full { grid-column: 1 / -1; }
.review-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px; }
.review-value { font-size: 13px; color: #374151; font-weight: 500; }
.review-progress { display: flex; align-items: center; gap: 10px; }
.review-track { flex: 1; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
.review-fill  { height: 100%; background: linear-gradient(90deg, #2563eb, #6366f1); border-radius: 3px; }
.review-team  { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px; }
.review-avatar {
  width: 32px; height: 32px; border-radius: 50%; color: white;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; border: 2px solid white;
  box-shadow: 0 0 0 1px #e2e8f0;
}

/* Error */
.dialog-error {
  margin: 0 28px 0;
  padding: 10px 14px;
  background: #fef2f2; border: 1px solid #fecaca;
  color: #dc2626; border-radius: 8px;
  font-size: 13px; font-weight: 500;
  display: flex; align-items: center; gap: 8px;
}

/* Footer */
.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 28px;
  border-top: 1px solid #f1f5f9;
  background: #fafbfc;
}
.footer-right { display: flex; align-items: center; gap: 12px; }
.step-count { font-size: 12px; color: #94a3b8; font-weight: 500; }

.btn-ghost {
  display: flex; align-items: center; gap: 6px;
  background: none; border: 1px solid #e2e8f0; border-radius: 8px;
  padding: 9px 16px; font-size: 13px; font-weight: 600;
  color: #64748b; cursor: pointer; transition: all 0.15s;
}
.btn-ghost:hover { background: #f1f5f9; border-color: #cbd5e1; color: #374151; }

.btn-primary {
  display: flex; align-items: center; gap: 6px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border: none; border-radius: 8px;
  padding: 9px 20px; font-size: 13px; font-weight: 700;
  color: white; cursor: pointer; transition: all 0.15s;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}
.btn-primary:hover { background: linear-gradient(135deg, #1d4ed8, #1e40af); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.4); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* Transition */
.dialog-fade-enter-active, .dialog-fade-leave-active { transition: all 0.2s ease; }
.dialog-fade-enter-from, .dialog-fade-leave-to { opacity: 0; transform: scale(0.96) translateY(8px); }

/* Responsive */
@media (max-width: 640px) {
  .dialog { border-radius: 16px; max-height: 95vh; }
  .dialog-header { padding: 18px 18px 14px; }
  .dialog-body { padding: 18px; }
  .dialog-footer { padding: 14px 18px; }
  .field-grid { grid-template-columns: 1fr; }
  .field.full { grid-column: 1; }
  .status-pills { flex-direction: column; }
  .dialog-error { margin: 0 18px 0; }
}
</style>

