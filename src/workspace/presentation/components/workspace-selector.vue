<script setup>
import { WORKSPACE_OPTIONS } from '../../domain/model/workspace-type.js';

const selected = defineModel({ type: String, default: null });

function selectWorkspace(workspaceId) {
  selected.value = workspaceId;
}
</script>

<template>
  <div class="workspace-selector">
    <div class="workspace-grid">
      <button
        v-for="option in WORKSPACE_OPTIONS"
        :key="option.id"
        type="button"
        class="workspace-option"
        :class="{ selected: selected === option.id }"
        @click="selectWorkspace(option.id)"
      >
        <div class="option-header" :style="{ background: option.color }">
          <i :class="option.icon"></i>
        </div>
        <div class="option-content">
          <h3 class="option-name">{{ option.name }}</h3>
          <p class="option-description">{{ option.description }}</p>
          <div class="option-features">
            <div
              v-for="(feature, idx) in option.features"
              :key="idx"
              class="feature-tag"
            >
              <i class="pi pi-check-circle"></i>
              {{ feature }}
            </div>
          </div>
        </div>
        <div class="option-checkbox">
          <div class="checkbox" :class="{ checked: selected === option.id }">
            <i v-if="selected === option.id" class="pi pi-check"></i>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.workspace-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.workspace-option {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  background: white;
  padding: 0;
  text-align: left;
  width: 100%;
  font: inherit;
}

.workspace-option:hover {
  border-color: #2563eb;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.1);
}

.workspace-option.selected {
  border-color: #2563eb;
  background: #f0f9ff;
  box-shadow: 0 12px 32px rgba(37, 99, 235, 0.15);
}

.option-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.option-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-name {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.option-description {
  font-size: 12px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.option-features {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}

.feature-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #475569;
  font-weight: 500;
}

.feature-tag i {
  font-size: 10px;
  color: #22c55e;
}

.option-checkbox {
  padding: 10px 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.checkbox {
  width: 22px;
  height: 22px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox.checked {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
  font-size: 11px;
}

@media (max-width: 480px) {
  .workspace-grid {
    grid-template-columns: 1fr;
  }
}
</style>
