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
        <template #content>
            <div class="notification-content">
            <div class="notification-layout">
                <div class="notification-panel">
                    <div class="notification-section">
                        <h3>{{ $t('systemAdministration.emailNotifications') }}</h3>
                        <div class="notification-row">
                            <div>
                                <h4>{{ $t('systemAdministration.projectAlerts') }}</h4>
                                <p>{{ $t('systemAdministration.projectStatusAlertsDesc') }}</p>
                            </div>
                            <InputSwitch v-model="formData.projectAlerts" />
                        </div>
                        <div class="notification-row">
                            <div>
                                <h4>{{ $t('systemAdministration.weeklyDigest') }}</h4>
                                <p>Receive a consolidated project summary every week.</p>
                            </div>
                            <InputSwitch v-model="formData.weeklyDigest" />
                        </div>
                        <div class="notification-row">
                            <div>
                                <h4>{{ $t('systemAdministration.mentionNotifications') }}</h4>
                                <p>Get notified when your name is mentioned in tasks or comments.</p>
                            </div>
                            <InputSwitch v-model="formData.mentionNotifications" />
                        </div>
                        <div class="notification-row">
                            <div>
                                <h4>{{ $t('systemAdministration.deadlineReminders') }}</h4>
                                <p>Stay ahead of due dates with reminder alerts.</p>
                            </div>
                            <InputSwitch v-model="formData.deadlineReminders" />
                        </div>
                    </div>

                    <div class="notification-section">
                        <h3>{{ $t('systemAdministration.pushNotifications') }}</h3>
                        <div class="notification-row">
                            <div>
                                <h4>{{ $t('systemAdministration.browserPush') }}</h4>
                                <p>Enable desktop push alerts for key updates.</p>
                            </div>
                            <InputSwitch v-model="formData.browserPush" />
                        </div>
                        <div class="notification-row">
                            <div>
                                <h4>{{ $t('systemAdministration.mobilePush') }}</h4>
                                <p>Receive instant alerts on your mobile device.</p>
                            </div>
                            <InputSwitch v-model="formData.mobilePush" />
                        </div>
                        <div class="notification-row">
                            <div>
                                <h4>{{ $t('systemAdministration.soundAlerts') }}</h4>
                                <p>Play a sound when a new notification arrives.</p>
                            </div>
                            <InputSwitch v-model="formData.soundAlerts" />
                        </div>
                    </div>

                    <div class="notification-section">
                        <h3>{{ $t('systemAdministration.alertCategories') }}</h3>
                        <div class="notification-row compact-row">
                            <span>{{ $t('systemAdministration.securityAlerts') }}</span>
                            <InputSwitch v-model="formData.securityAlerts" />
                        </div>
                        <div class="notification-row compact-row">
                            <span>{{ $t('systemAdministration.workspaceUpdates') }}</span>
                            <InputSwitch v-model="formData.workspaceUpdates" />
                        </div>
                        <div class="notification-row compact-row">
                            <span>{{ $t('systemAdministration.subscriptionAlerts') }}</span>
                            <InputSwitch v-model="formData.subscriptionAlerts" />
                        </div>
                        <div class="notification-row compact-row">
                            <span>{{ $t('systemAdministration.teamActivity') }}</span>
                            <InputSwitch v-model="formData.teamActivity" />
                        </div>
                    </div>
                </div>

                <div class="notification-summary-card">
                    <div class="summary-title">{{ $t('systemAdministration.notificationDeliveryStatus') }}</div>
                    <div class="summary-value">
                        <Tag value="All systems green" severity="success" />
                    </div>
                    <div class="summary-meta">
                        <span>{{ $t('systemAdministration.lastSynchronization') }}</span>
                        <strong>{{ lastSync }}</strong>
                    </div>
                    <div class="notification-status-list">
                        <div class="status-item">
                            <span>Inbound email latency</span>
                            <Tag value="Normal" severity="success" />
                        </div>
                        <div class="status-item">
                            <span>Push delivery</span>
                            <Tag value="On time" severity="success" />
                        </div>
                        <div class="status-item">
                            <span>Alert queue</span>
                            <Tag value="Stable" severity="warning" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="notification-actions">
                <Button label="$t('systemAdministration.save')" icon="pi pi-check" class="p-button-primary" @click="handleSave" :loading="isSaving" />
            </div>
        </div>
        </template>
    </Card>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
import Tag from 'primevue/tag';

const props = defineProps({
    systemSettings: Object,
    loading: Boolean
});

const emit = defineEmits(['save', 'test']);

const formData = ref({
    projectAlerts: true,
    weeklyDigest: true,
    mentionNotifications: true,
    deadlineReminders: true,
    browserPush: false,
    mobilePush: true,
    soundAlerts: false,
    securityAlerts: true,
    workspaceUpdates: true,
    subscriptionAlerts: true,
    teamActivity: true,
    ...props.systemSettings
});

const isSaving = ref(false);

const lastSync = computed(() => {
    const date = props.systemSettings?.lastSync || new Date().toLocaleString();
    return date;
});

watch(
    () => props.systemSettings,
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

.notification-layout {
    display: grid;
    grid-template-columns: minmax(320px, 1.55fr) minmax(260px, 1fr);
    gap: 1.5rem;
}

.notification-panel {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.notification-section {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.notification-section h3 {
    margin: 0;
    color: #111827;
    font-size: 1.05rem;
    font-weight: 700;
}

.notification-row {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid #f0f4f8;
}

.notification-row:last-child {
    border-bottom: none;
}

.compact-row {
    grid-template-columns: 1fr auto;
}

.notification-row h4 {
    margin: 0 0 0.35rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: #111827;
}

.notification-row p,
.notification-row span {
    margin: 0;
    color: #64748b;
    font-size: 0.88rem;
    line-height: 1.5;
}

.notification-summary-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.summary-title {
    font-size: 1rem;
    font-weight: 700;
    color: #111827;
}

.summary-value {
    padding: 1rem 0;
}

.summary-meta {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    color: #64748b;
    font-size: 0.9rem;
}

.summary-meta strong {
    color: #111827;
}

.notification-status-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.95rem 1rem;
    background: #f8fafc;
    border-radius: 12px;
}

.status-item span {
    color: #475569;
    font-size: 0.92rem;
}

.notification-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
}

@media (max-width: 960px) {
    .notification-layout {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .notification-actions {
        flex-direction: column;
    }
}
</style>
