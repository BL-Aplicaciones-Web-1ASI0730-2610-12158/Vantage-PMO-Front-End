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
        <template #content>
            <div class="branding-content">
            <div class="branding-grid">
                <div class="branding-panel">
                    <div class="panel-section">
                        <div class="section-label">{{ $t('systemAdministration.companyName') }}</div>
                        <InputText v-model="formData.companyName" :placeholder="$t('systemAdministration.enterCompanyName')" />
                    </div>

                    <div class="panel-section">
                        <div class="section-label">{{ $t('systemAdministration.companyDescription') }}</div>
                        <Textarea
                            v-model="formData.companyDescription"
                            :placeholder="$t('systemAdministration.enterCompanyDescription')"
                            rows="4"
                            autoResize
                            class="textarea"
                        />
                    </div>

                    <div class="panel-section logo-upload">
                        <div class="section-label">{{ $t('systemAdministration.logo') }}</div>
                        <div class="logo-upload-card">
                            <div class="logo-placeholder-card">
                                <div v-if="formData.logoUrl" class="logo-preview">
                                    <img :src="formData.logoUrl" alt="Company Logo" />
                                </div>
                                <div v-else class="logo-placeholder-inner">
                                    <i class="pi pi-image"></i>
                                    <span>{{ $t('systemAdministration.uploadLogo') }}</span>
                                </div>
                            </div>
                            <Button
                                label="$t('systemAdministration.chooseFile')"
                                icon="pi pi-upload"
                                class="p-button-outlined"
                                @click="triggerUpload"
                            />
                            <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" hidden />
                        </div>
                    </div>
                </div>

                <div class="branding-panel branding-settings-panel">
                    <div class="panel-section">
                        <div class="section-label">{{ $t('systemAdministration.primaryColor') }}</div>
                        <div class="color-input-row">
                            <input type="color" v-model="formData.primaryColor" />
                            <span>{{ formData.primaryColor }}</span>
                        </div>
                    </div>

                    <div class="panel-section">
                        <div class="section-label">{{ $t('systemAdministration.secondaryColor') }}</div>
                        <div class="color-input-row">
                            <input type="color" v-model="formData.secondaryColor" />
                            <span>{{ formData.secondaryColor }}</span>
                        </div>
                    </div>

                    <div class="panel-section">
                        <div class="section-label">{{ $t('systemAdministration.typographyStyle') }}</div>
                        <Dropdown v-model="formData.typographyStyle" :options="typographyOptions" optionLabel="label" optionValue="value" placeholder="Select style" class="w-full" />
                    </div>

                    <div class="preview-card">
                        <div class="preview-header" :style="{ backgroundColor: formData.primaryColor }">
                            <div class="preview-logo-mini">
                                <span>{{ logoInitials }}</span>
                            </div>
                            <span class="preview-badge">{{ formData.companyName || 'Vantage PMO' }}</span>
                        </div>
                        <div class="preview-body">
                            <h3>{{ formData.companyName || 'Company Name' }}</h3>
                            <p>{{ formData.companyDescription || $t('systemAdministration.previewText') }}</p>
                            <div class="preview-tags">
                                <span class="tag">{{ formData.typographyStyle }}</span>
                                <span class="tag">{{ formData.primaryColor }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="branding-actions">
                <Button label="$t('systemAdministration.save')" icon="pi pi-check" class="p-button-primary" @click="handleSave" />
                <Button label="$t('systemAdministration.reset')" icon="pi pi-refresh" class="p-button-secondary" @click="handleReset" />
            </div>
        </div>
        </template>
    </Card>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';

const props = defineProps({
    branding: {
        type: Object,
        default: () => ({
            companyName: 'Vantage Labs',
            companyDescription: 'Enterprise project management software for global teams.',
            logoUrl: '',
            primaryColor: '#3b82f6',
            secondaryColor: '#10b981',
            typographyStyle: 'Source Sans Pro'
        })
    },
    loading: Boolean
});

const emit = defineEmits(['save', 'reset']);
const fileInput = ref(null);

const typographyOptions = [
    { label: 'Source Sans Pro', value: 'Source Sans Pro' },
    { label: 'Inter', value: 'Inter' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'System Sans', value: 'System Sans' }
];

const formData = ref({
    ...props.branding
});

watch(
    () => props.branding,
    (newBranding) => {
        formData.value = { ...newBranding };
    },
    { deep: true, immediate: true }
);

const logoInitials = computed(() => {
    if (!formData.value.companyName) return 'VP';
    return formData.value.companyName
        .split(' ')
        .map((word) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
});

const triggerUpload = () => {
    fileInput.value?.click();
};

const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    formData.value.logoUrl = URL.createObjectURL(file);
};

const handleSave = () => {
    emit('save', { ...formData.value });
};

const handleReset = () => {
    emit('reset');
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
    padding: 2rem;
}

.branding-grid {
    display: grid;
    grid-template-columns: minmax(320px, 1.4fr) minmax(280px, 1fr);
    gap: 1.5rem;
}

.branding-panel {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.panel-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.section-label {
    font-size: 0.85rem;
    font-weight: 700;
    color: #374151;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.inputtext,
.textarea,
.p-inputtextarea {
    width: 100%;
}

.logo-upload-card {
    display: grid;
    gap: 1rem;
}

.logo-placeholder-card {
    min-height: 150px;
    border: 1px dashed #cbd5e1;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    position: relative;
}

.logo-preview {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.logo-preview img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.logo-placeholder-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: #64748b;
    text-align: center;
}

.logo-placeholder-inner i {
    font-size: 1.5rem;
}

.branding-settings-panel {
    gap: 1.5rem;
}

.color-input-row {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.color-input-row input[type='color'] {
    width: 48px;
    height: 48px;
    border: none;
    padding: 0;
    background: transparent;
    cursor: pointer;
}

.preview-card {
    background: #f8fafc;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    overflow: hidden;
    box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
}

.preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.5rem;
    color: white;
}

.preview-logo-mini {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #111827;
    font-weight: 700;
}

.preview-badge {
    background: rgba(255, 255, 255, 0.18);
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
    border-radius: 999px;
    color: white;
}

.preview-body {
    padding: 1.5rem;
}

.preview-body h3 {
    margin: 0 0 0.5rem;
    font-size: 1.2rem;
    color: #111827;
}

.preview-body p {
    margin: 0 0 1rem;
    color: #475569;
    line-height: 1.6;
    font-size: 0.95rem;
}

.preview-tags {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.tag {
    background: #eef2ff;
    color: #4338ca;
    padding: 0.4rem 0.75rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
}

.branding-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
}

@media (max-width: 960px) {
    .branding-grid {
        grid-template-columns: 1fr;
    }
}
</style>
