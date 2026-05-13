<template>
    <Card class="notification-card">
        <template #header>
            <div class="card-header">
                <h2 class="card-title">
                    <i class="pi pi-bell"></i>
                    {{ $t('systemAdministration.notifications') }}
                </h2>
            </div>
        </template>

        <div class="notification-content">
            <div class="notification-settings-group">
                <div class="setting-item">
                    <div class="setting-info">
                        <h3>{{ $t('systemAdministration.emailNotifications') }}</h3>
                        <p>{{ $t('systemAdministration.emailNotificationsDesc') }}</p>
                    </div>
                    <InputSwitch v-model="formData.emailNotifications" />
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <h3>{{ $t('systemAdministration.pushNotifications') }}</h3>
                        <p>{{ $t('systemAdministration.pushNotificationsDesc') }}</p>
                    </div>
                    <InputSwitch v-model="formData.pushNotifications" />
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <h3>{{ $t('systemAdministration.reportAlerts') }}</h3>
                        <p>{{ $t('systemAdministration.reportAlertsDesc') }}</p>
                    </div>
                    <InputSwitch v-model="formData.reportAlerts" />
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <h3>{{ $t('systemAdministration.adminAlerts') }}</h3>
                        <p>{{ $t('systemAdministration.adminAlertsDesc') }}</p>
                    </div>
                    <InputSwitch v-model="formData.adminAlerts" />
                </div>
            </div>

            <Divider />

            <div class="notification-actions">
                <Button
                    :label="$t('systemAdministration.save')"
                    icon="pi pi-check"
                    @click="handleSave"
                    :loading="isSaving"
                    class="p-button-primary"
                />
                <Button
                    :label="$t('systemAdministration.testNotification')"
                    icon="pi pi-send"
                    @click="handleTest"
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
import InputSwitch from 'primevue/inputswitch';

const props = defineProps({
    systemSettings: Object,
    loading: Boolean
});

const emit = defineEmits(['save', 'test']);

const formData = ref({
    emailNotifications: true,
    pushNotifications: true,
    reportAlerts: true,
    adminAlerts: true,
    ...props.systemSettings
});

const isSaving = ref(false);

watch(() => props.systemSettings, (newVal) => {
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

const handleTest = async () => {
    emit('test', formData.value);
};
</script>

<style scoped>
.notification-card {
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
    color: #8b5cf6;
}

.notification-content {
    padding: 2rem;
}

.notification-settings-group {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.setting-item {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e9ecef;
}

.setting-item:last-child {
    border-bottom: none;
}

.setting-info h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: #1a1a1a;
}

.setting-info p {
    margin: 0;
    font-size: 0.85rem;
    color: #999;
}

.notification-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
}

@media (max-width: 768px) {
    .setting-item {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .notification-actions {
        flex-direction: column;
    }
}
</style>
