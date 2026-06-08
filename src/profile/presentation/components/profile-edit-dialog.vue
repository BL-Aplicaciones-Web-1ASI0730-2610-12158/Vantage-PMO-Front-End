<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  visible: { type: Boolean, default: false },
  user:    { type: Object, default: null },
});

const emit = defineEmits(['update:visible', 'save']);

const form = ref({
  name: '',
  role: '',
  location: '',
  department: '',
  availabilityLabel: '',
  bioText: '',
});

watch(() => props.visible, (open) => {
  if (open && props.user) {
    form.value = {
      name:                props.user.name ?? '',
      role:                props.user.role ?? '',
      location:            props.user.location ?? '',
      department:          props.user.department ?? '',
      availabilityLabel:   props.user.availabilityLabel ?? '',
      bioText:             (props.user.bio ?? []).join('\n\n'),
    };
  }
});

function close() {
  emit('update:visible', false);
}

function submit() {
  emit('save', {
    name:              form.value.name,
    role:              form.value.role,
    location:          form.value.location,
    department:        form.value.department,
    availabilityLabel: form.value.availabilityLabel,
    bio:               form.value.bioText.split('\n\n').map(p => p.trim()).filter(Boolean),
  });
  close();
}
</script>

<template>
  <pv-dialog
    :visible="visible"
    :header="$t('profile.editProfile')"
    modal
    :style="{ width: '520px' }"
    :breakpoints="{ '640px': '95vw' }"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="edit-form">
      <div class="field">
        <label>{{ $t('profile.form.name') }}</label>
        <pv-input-text v-model="form.name" class="w-full" />
      </div>
      <div class="field">
        <label>{{ $t('profile.form.role') }}</label>
        <pv-input-text v-model="form.role" class="w-full" />
      </div>
      <div class="field">
        <label>{{ $t('profile.form.location') }}</label>
        <pv-input-text v-model="form.location" class="w-full" />
      </div>
      <div class="field">
        <label>{{ $t('profile.form.department') }}</label>
        <pv-input-text v-model="form.department" class="w-full" />
      </div>
      <div class="field">
        <label>{{ $t('profile.form.availability') }}</label>
        <pv-input-text v-model="form.availabilityLabel" class="w-full" />
      </div>
      <div class="field">
        <label>{{ $t('profile.form.bio') }}</label>
        <pv-textarea v-model="form.bioText" rows="5" class="w-full" />
      </div>
    </div>
    <template #footer>
      <pv-button :label="$t('profile.form.cancel')" severity="secondary" text @click="close" />
      <pv-button :label="$t('profile.form.save')" @click="submit" />
    </template>
  </pv-dialog>
</template>

<style scoped>
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.w-full { width: 100%; }
</style>
