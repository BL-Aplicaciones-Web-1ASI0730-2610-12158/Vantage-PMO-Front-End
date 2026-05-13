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

        <div class="policy-content">
            <div class="policy-group">
                <div class="policy-item">
                    <div class="policy-info">
                        <h3>{{ $t('systemAdministration.passwordPolicy') }}</h3>
                        <p>{{ $t('systemAdministration.passwordPolicyDesc') }}</p>
                    </div>
                    <Dropdown
                        v-model="formData.passwordPolicy"
                        :options="passwordPolicyOptions"
                        :placeholder="$t('systemAdministration.selectPolicy')"
                        class="w-full"
                    />
                </div>

                <div class="policy-item">
                    <div class="policy-info">
                        <h3>{{ $t('systemAdministration.mfaRequired') }}</h3>
                        <p>{{ $t('systemAdministration.mfaRequiredDesc') }}</p>
                    </div>
                    <InputSwitch v-model="formData.mfaRequired" />
                </div>

                <div class="policy-item">
                    <div class="policy-info">
                        <h3>{{ $t('systemAdministration.sessionTimeout') }}</h3>
                        <p>{{ $t('systemAdministration.sessionTimeoutDesc') }}</p>
                    </div>
                    <InputNumber
                        v-model="formData.sessionTimeout"
                        :min="5"
                        :max="1440"
                        suffix=" min"
                        class="w-full"
                    />
                </div>

                <div class="policy-item">
                    <div class="policy-info">
                        <h3>{{ $t('systemAdministration.apiRequestLimits') }}</h3>
                        <p>{{ $t('systemAdministration.apiRequestLimitsDesc') }}</p>
                    </div>
                    <InputNumber
                        v-model="formData.apiRequestLimits"
                        :min="10"
                        suffix=" req/hr"
                        class="w-full"
                    />
                </div>

                <div class="policy-item">
                    <div class="policy-info">
                        <h3>{{ $t('systemAdministration.notificationPermissions') }}</h3>
                        <p>{{ $t('systemAdministration.notificationPermissionsDesc') }}</p>
                    </div>
                    <InputSwitch v-model="formData.notificationPermissions" />
                </div>
            </div>

            <Divider />

            <div class="policy-actions">
                <Button
                    :label="$t('systemAdministration.save')"
                    icon="pi pi-check"
                    @click="handleSave"
                    :loading="isSaving"
                    class="p-button-primary"
                />
                <Button
                    :label="$t('systemAdministration.reset')"
                    icon="pi pi-refresh"
                    @click="handleReset"
                    class="p-button-secondary"
                />
            </div>
        </div>
    </Card>
</template>

<script setup>
import { ref, watch } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import InputNumber from 'primevue/inputnumber';

const props = defineProps({
    adminPolicy: Object,
    loading: Boolean
});

const emit = defineEmits(['save']);

const formData = ref({
    passwordPolicy: 'moderate',
    mfaRequired: true,
    sessionTimeout: 30,
    apiRequestLimits: 1000,
    notificationPermissions: true,
    ...props.adminPolicy
});

const isSaving = ref(false);

const passwordPolicyOptions = [
    { label: 'Basic', value: 'basic' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'Strict', value: 'strict' }
];

watch(() => props.adminPolicy, (newVal) => {
    formData.value = { ...formData.value, ...newVal };
}, { deep: true });

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
        passwordPolicy: 'moderate',
        mfaRequired: true,
        sessionTimeout: 30,
        apiRequestLimits: 1000,
        notificationPermissions: true,
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

.policy-group {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.policy-item {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e9ecef;
}

.policy-item:last-child {
    border-bottom: none;
}

.policy-info h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: #1a1a1a;
}

.policy-info p {
    margin: 0;
    font-size: 0.85rem;
    color: #999;
}

.policy-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
}

@media (max-width: 768px) {
    .policy-item {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .policy-actions {
        flex-direction: column;
    }
}
</style>
