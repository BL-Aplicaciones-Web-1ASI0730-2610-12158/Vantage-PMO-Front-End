<template>
    <Card class="policy-card">
        <template #header>
            <div class="card-header">
                <h2 class="card-title">
                    <i class="pi pi-shield"></i>
                    {{ $t('systemAdministration.globalPolicies') }}
                </h2>
            </div>
        </template>
        <template #content>
            <div class="policy-content">
            <div class="policy-layout">
                <div class="policy-panel">
                    <div class="policy-section">
                        <h3>{{ $t('systemAdministration.authenticationPolicies') }}</h3>
                        <div class="policy-row">
                            <div>
                                <h4>{{ $t('systemAdministration.mfaRequired') }}</h4>
                                <p>{{ $t('systemAdministration.mfaRequiredMsg') }}</p>
                            </div>
                            <InputSwitch v-model="formData.mfaRequired" />
                        </div>
                        <div class="policy-row">
                            <div>
                                <h4>{{ $t('systemAdministration.sessionTimeout') }}</h4>
                                <p>{{ $t('systemAdministration.sessionTimeoutDesc') }}</p>
                            </div>
                            <Dropdown v-model="formData.sessionTimeout" :options="sessionTimeoutOptions" optionLabel="label" optionValue="value" class="w-full" />
                        </div>
                        <div class="policy-row">
                            <div>
                                <h4>{{ $t('systemAdministration.passwordExpiration') }}</h4>
                                <p>Rotate passwords automatically based on policy.</p>
                            </div>
                            <Dropdown v-model="formData.passwordExpiration" :options="passwordExpirationOptions" optionLabel="label" optionValue="value" class="w-full" />
                        </div>
                    </div>

                    <div class="policy-section">
                        <h3>{{ $t('systemAdministration.apiAccess') }}</h3>
                        <div class="policy-row">
                            <div>
                                <h4>{{ $t('systemAdministration.apiRequestLimits') }}</h4>
                                <p>{{ $t('systemAdministration.apiRequestLimitsDesc') }}</p>
                            </div>
                            <InputNumber v-model="formData.apiRequestLimits" :min="100" suffix=" req/hr" class="w-full" />
                        </div>
                        <div class="policy-row compact-row">
                            <span>{{ $t('systemAdministration.allowedDevices') }}</span>
                            <InputSwitch v-model="formData.allowedDevices" />
                        </div>
                        <div class="policy-row compact-row">
                            <span>{{ $t('systemAdministration.ipRestriction') }}</span>
                            <InputSwitch v-model="formData.ipRestriction" />
                        </div>
                    </div>

                    <div class="policy-section">
                        <h3>{{ $t('systemAdministration.passwordRules') }}</h3>
                        <div class="policy-row">
                            <div>
                                <h4>{{ $t('systemAdministration.minimumPasswordLength') }}</h4>
                                <p>Minimum number of characters required for new passwords.</p>
                            </div>
                            <InputNumber v-model="formData.minimumPasswordLength" :min="8" :max="32" class="w-full" />
                        </div>
                        <div class="policy-row compact-row">
                            <span>{{ $t('systemAdministration.requireSymbols') }}</span>
                            <InputSwitch v-model="formData.requireSymbols" />
                        </div>
                        <div class="policy-row compact-row">
                            <span>{{ $t('systemAdministration.requireUppercase') }}</span>
                            <InputSwitch v-model="formData.requireUppercase" />
                        </div>
                    </div>
                </div>

                <div class="summary-card">
                    <div class="summary-card-header">
                        <span>{{ $t('systemAdministration.policyStatusSummary') }}</span>
                        <Tag :value="policyStatus" severity="success" />
                    </div>
                    <div class="summary-list">
                        <div class="summary-item">
                            <span>{{ $t('systemAdministration.complianceBadge') }}</span>
                            <strong>{{ complianceLevel }}</strong>
                        </div>
                        <div class="summary-item">
                            <span>{{ $t('systemAdministration.lastPolicyUpdate') }}</span>
                            <strong>{{ lastPolicyUpdate }}</strong>
                        </div>
                        <div class="summary-item">
                            <span>Enforced MFA</span>
                            <strong>{{ formData.mfaRequired ? 'Enabled' : 'Disabled' }}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div class="policy-actions">
                <Button :label="$t('systemAdministration.save')" icon="pi pi-check" class="p-button-primary" @click="handleSave" :loading="isSaving" />
                <Button :label="$t('systemAdministration.reset')" icon="pi pi-refresh" class="p-button-secondary" @click="handleReset" />
            </div>
        </div>
        </template>
    </Card>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import InputNumber from 'primevue/inputnumber';
import Tag from 'primevue/tag';

const props = defineProps({
    adminPolicy: Object,
    loading: Boolean
});

const emit = defineEmits(['save']);

const formData = ref({
    mfaRequired: true,
    sessionTimeout: 30,
    passwordExpiration: '90 days',
    apiRequestLimits: 1200,
    allowedDevices: true,
    ipRestriction: false,
    minimumPasswordLength: 12,
    requireSymbols: true,
    requireUppercase: true,
    ...props.adminPolicy
});

const isSaving = ref(false);

const sessionTimeoutOptions = [
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '60 min', value: 60 },
    { label: '120 min', value: 120 }
];

const passwordExpirationOptions = [
    { label: '30 days', value: '30 days' },
    { label: '60 days', value: '60 days' },
    { label: '90 days', value: '90 days' },
    { label: '120 days', value: '120 days' }
];

const policyStatus = computed(() => (formData.value.mfaRequired && formData.value.ipRestriction ? 'Secure' : 'Review'));
const complianceLevel = computed(() => (formData.value.minimumPasswordLength >= 12 && formData.value.requireSymbols ? 'High' : 'Moderate'));
const lastPolicyUpdate = computed(() => props.adminPolicy?.lastUpdated || new Date().toLocaleDateString());

watch(
    () => props.adminPolicy,
    (newVal) => {
        formData.value = { ...formData.value, ...newVal };
    },
    { deep: true }
);

const handleSave = async () => {
    isSaving.value = true;
    try {
        emit('save', formData.value);
    } finally {
        isSaving.value = false;
    }
};

const handleReset = () => {
    formData.value = {
        mfaRequired: true,
        sessionTimeout: 30,
        passwordExpiration: '90 days',
        apiRequestLimits: 1200,
        allowedDevices: true,
        ipRestriction: false,
        minimumPasswordLength: 12,
        requireSymbols: true,
        requireUppercase: true,
        ...props.adminPolicy
    };
};
</script>

<style scoped>
.policy-card {
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
    color: #f59e0b;
}

.policy-content {
    padding: 2rem;
}

.policy-layout {
    display: grid;
    grid-template-columns: minmax(300px, 1.6fr) minmax(240px, 1fr);
    gap: 1.5rem;
}

.policy-panel,
.summary-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.policy-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.policy-section h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: #111827;
}

.policy-row {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 1rem;
    padding: 0.9rem 0;
    border-bottom: 1px solid #f0f4f8;
}

.policy-row:last-child {
    border-bottom: none;
}

.compact-row {
    grid-template-columns: 1fr auto;
}

.policy-row h4,
.policy-row span {
    margin: 0;
    color: #111827;
    font-weight: 600;
}

.policy-row p {
    margin: 0.35rem 0 0;
    color: #64748b;
    font-size: 0.88rem;
    line-height: 1.5;
}

.summary-card-header {
    display: grid;
    gap: 0.5rem;
}

.summary-card-header span {
    font-size: 0.95rem;
    font-weight: 700;
    color: #111827;
}

.summary-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 12px;
}

.summary-item span {
    color: #64748b;
    font-size: 0.9rem;
}

.summary-item strong {
    color: #111827;
}

.policy-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-top: 1rem;
}

@media (max-width: 960px) {
    .policy-layout {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .policy-actions {
        flex-direction: column;
    }
}
</style>
