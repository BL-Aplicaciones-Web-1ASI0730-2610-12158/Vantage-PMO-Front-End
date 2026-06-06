<template>
  <div class="quick-options-dialog">
    <ul class="options-list">
      <li class="option-item" @click="selectOption('attach-file')">
        <i class="pi pi-file"></i>
        <span>Attach File</span>
      </li>
      <li class="option-item" @click="selectOption('emoji')">
        <i class="pi pi-face-smile"></i>
        <span>Add Emoji</span>
      </li>
      <li class="option-item" @click="selectOption('mention')">
        <i class="pi pi-at"></i>
        <span>Mention Someone</span>
      </li>
      <li class="option-item" @click="selectOption('poll')">
        <i class="pi pi-list"></i>
        <span>Create Poll</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useDialog } from 'primevue/usedialog';

const dialog = useDialog();

const selectOption = (option) => {
  dialog.close({ data: option });
};
</script>

<style scoped>
.quick-options-dialog {
  padding: 0.5rem 0;
}

.options-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #374151;
  font-size: 0.9rem;
}

.option-item:hover {
  background-color: #f3f4f6;
}

.option-item i {
  font-size: 1.1rem;
  color: #2563eb;
}
</style>
