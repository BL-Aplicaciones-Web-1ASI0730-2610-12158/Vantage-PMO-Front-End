<template>
    <Card class="branding-card">
        <template #header>
            <div class="card-header">
                <h2 class="card-title">
                    <i class="pi pi-palette"></i>
                    {{ $t('systemAdministration.branding') }}
                </h2>
            </div>
        </template>

        <div class="branding-content">
            <div class="branding-form">
                <div class="form-group">
                    <label>{{ $t('systemAdministration.companyName') }}</label>
                    <InputText
                        v-model="formData.companyName"
                        :placeholder="$t('systemAdministration.enterCompanyName')"
                        class="w-full"
                    />
                </div>

                <div class="form-group">
                    <label>{{ $t('systemAdministration.primaryColor') }}</label>
                    <div class="color-picker">
                        <input
                            v-model="formData.primaryColor"
                            type="color"
                            class="color-input"
                        />
                        <span class="color-value">{{ formData.primaryColor }}</span>
                    </div>
                </div>

                <div class="form-group">
                    <label>{{ $t('systemAdministration.secondaryColor') }}</label>
                    <div class="color-picker">
                        <input
                            v-model="formData.secondaryColor"
                            type="color"
                            class="color-input"
                        />
                        <span class="color-value">{{ formData.secondaryColor }}</span>
                    </div>
                </div>

                <div class="form-actions">
                    <Button
                        :label="$t('systemAdministration.save')"
                        icon="pi pi-check"
                        @click="handleSave"
                        :loading="isSaving"
                        class="p-button-primary"
                    />
                    <Button
                        :label="$t('systemAdministration.cancel')"
                        icon="pi pi-times"
                        @click="handleCancel"
                        class="p-button-secondary"
                    />
                </div>
            </div>

            <Divider layout="vertical" />

            <div class="branding-preview">
                <h3>{{ $t('systemAdministration.preview') }}</h3>
                <div class="preview-card">
                    <div class="preview-header" :style="{ backgroundColor: formData.primaryColor }">
                        <span>{{ formData.companyName || 'Your Company' }}</span>
                    </div>
                    <div class="preview-body">
                        <div class="preview-badge" :style="{ backgroundColor: formData.secondaryColor }">
                            {{ $t('systemAdministration.sample') }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Card>
</template>

<script setup>
import { ref, watch } from 'vue';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Divider from 'primevue/divider';

const props = defineProps({
    branding: {
        type: Object,
        default: () => ({ companyName: '', primaryColor: '#3b82f6', secondaryColor: '#10b981' })
    },
    loading: Boolean
});

const emit = defineEmits(['save']);

const formData = ref({ ...props.branding });
const isSaving = ref(false);

watch(() => props.branding, (newVal) => {
    formData.value = { ...newVal };
}, { deep: true });

const handleSave = async () => {
    isSaving.value = true;
    try {
        emit('save', formData.value);
    } finally {
        isSaving.value = false;
    }
};

const handleCancel = () => {
    formData.value = { ...props.branding };
};
</script>

<style scoped>
.branding-card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.card-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e9ecef;
}

.card-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a1a;
}

.card-title i {
    color: #3b82f6;
}

.branding-content {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
    padding: 2rem;
}

.branding-form,
.branding-preview {
    flex: 1;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #333;
    font-size: 0.9rem;
}

.color-picker {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.color-input {
    width: 60px;
    height: 60px;
    border: 2px solid #e9ecef;
    border-radius: 4px;
    cursor: pointer;
}

.color-value {
    font-family: monospace;
    font-size: 0.9rem;
    color: #666;
    font-weight: 600;
}

.form-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 2rem;
}

.branding-preview h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    color: #333;
}

.preview-card {
    border: 1px solid #e9ecef;
    border-radius: 4px;
    overflow: hidden;
}

.preview-header {
    padding: 1.5rem;
    color: white;
    font-weight: 700;
    font-size: 1.1rem;
}

.preview-body {
    padding: 1.5rem;
}

.preview-badge {
    display: inline-block;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
}

@media (max-width: 1024px) {
    .branding-content {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .branding-content {
        gap: 1.5rem;
        padding: 1.5rem;
    }

    .form-actions {
        flex-direction: column;
    }
}
</style>
