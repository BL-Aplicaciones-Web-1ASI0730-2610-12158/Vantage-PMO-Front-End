<template>
    <Card class="subscription-card">
        <template #header>
            <div class="card-header">
                <h2 class="card-title">
                    <i class="pi pi-credit"></i>
                    {{ $t('systemAdministration.subscription') }}
                </h2>
            </div>
        </template>
        <template #content>
            <div class="subscription-content">
            <div class="subscription-topcards">
                <div class="metric-card plan-card">
                    <span class="metric-label">{{ $t('systemAdministration.currentPlan') }}</span>
                    <Tag :value="subscription.plan || 'Starter'" :severity="getPlanSeverity(subscription.plan)" />
                </div>
                <div class="metric-card">
                    <span class="metric-label">{{ $t('systemAdministration.activeUsers') }}</span>
                    <span class="metric-value">{{ subscription.activeUsers || 12 }}</span>
                </div>
                <div class="metric-card">
                    <span class="metric-label">{{ $t('systemAdministration.storageUsage') }}</span>
                    <span class="metric-value">{{ subscription.storageUsage || '85 / 100 GB' }}</span>
                </div>
                <div class="metric-card">
                    <span class="metric-label">{{ $t('systemAdministration.workspaceStatus') }}</span>
                    <Tag :value="subscription.workspaceStatus || 'Operational'" severity="success" />
                </div>
            </div>

            <div class="subscription-grid">
                <div class="billing-panel">
                    <div class="billing-row">
                        <span>{{ $t('systemAdministration.billingCycle') }}</span>
                        <strong>{{ formatBillingCycle(subscription.billingCycle) || 'Monthly' }}</strong>
                    </div>
                    <div class="billing-row">
                        <span>{{ $t('systemAdministration.renewalDate') }}</span>
                        <strong>{{ formatDate(subscription.expirationDate) }}</strong>
                    </div>
                    <div class="billing-row">
                        <span>{{ $t('systemAdministration.paymentMethod') }}</span>
                        <strong>{{ subscription.paymentMethod || 'Visa •••• 2371' }}</strong>
                    </div>
                    <div class="billing-row status-row">
                        <span>{{ $t('systemAdministration.status') }}</span>
                        <Tag :value="subscription.status || 'active'" :severity="getStatusSeverity(subscription.status)" />
                    </div>
                </div>

                <div class="summary-card">
                    <div class="summary-card-header">
                        <span>{{ $t('systemAdministration.upgrade') }}</span>
                        <p>{{ $t('systemAdministration.upgradeCTA') }}</p>
                    </div>
                    <div class="analytics-list">
                        <div class="analytics-item">
                            <span>{{ $t('systemAdministration.usageAnalytics') }}</span>
                            <strong>{{ subscription.activeUsers || 12 }} active seats</strong>
                        </div>
                        <div class="analytics-item">
                            <span>Invoice history</span>
                            <strong>{{ subscription.invoices || '4 invoices' }}</strong>
                        </div>
                        <div class="analytics-item">
                            <span>Renewal readiness</span>
                            <strong>{{ subscription.renewalStatus || 'On track' }}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div class="subscription-actions">
                <Button :label="$t('systemAdministration.renewAction')" icon="pi pi-refresh" class="p-button-primary" @click="handleRenew" :loading="isRenewing" />
                <Button :label="$t('systemAdministration.manageBilling')" icon="pi pi-wallet" class="p-button-secondary" />
            </div>
        </div>
        </template>
    </Card>
</template>

<script setup>
import { ref, computed } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const props = defineProps({
    subscription: {
        type: Object,
        default: () => ({
            plan: 'Professional',
            activeUsers: 18,
            billingCycle: 'yearly',
            expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
            status: 'active',
            storageUsage: '75 / 100 GB',
            workspaceStatus: 'Operational',
            paymentMethod: 'Visa •••• 2371',
            invoices: '4 invoices',
            renewalStatus: 'On track'
        })
    },
    loading: Boolean
});

const emit = defineEmits(['renew']);
const isRenewing = ref(false);

const subscription = computed(() => ({
    plan: props.subscription?.plan || 'Professional',
    activeUsers: props.subscription?.activeUsers || 18,
    billingCycle: props.subscription?.billingCycle || 'yearly',
    expirationDate: props.subscription?.expirationDate,
    status: props.subscription?.status || 'active',
    storageUsage: props.subscription?.storageUsage || '75 / 100 GB',
    workspaceStatus: props.subscription?.workspaceStatus || 'Operational',
    paymentMethod: props.subscription?.paymentMethod || 'Visa •••• 2371',
    invoices: props.subscription?.invoices || '4 invoices',
    renewalStatus: props.subscription?.renewalStatus || 'On track'
}));

const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
};

const formatBillingCycle = (cycle) => {
    const cycleMap = {
        monthly: 'Monthly',
        yearly: 'Yearly'
    };
    return cycleMap[cycle] || cycle;
};

const getPlanSeverity = (plan) => {
    const severityMap = {
        Starter: 'info',
        Professional: 'warning',
        Enterprise: 'success',
        starter: 'info',
        professional: 'warning',
        enterprise: 'success'
    };
    return severityMap[plan] || 'info';
};

const getStatusSeverity = (status) => {
    const severityMap = {
        active: 'success',
        expired: 'danger',
        pending: 'warning'
    };
    return severityMap[status] || 'info';
};

const handleRenew = async () => {
    isRenewing.value = true;
    try {
        emit('renew', props.subscription?.id);
    } finally {
        isRenewing.value = false;
    }
};
</script>

<style scoped>
.subscription-card {
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
    color: #10b981;
}

.subscription-content {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.subscription-topcards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.metric-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-height: 120px;
}

.plan-card {
    border-left: 4px solid #10b981;
}

.metric-label {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #6b7280;
    font-weight: 700;
}

.metric-value {
    font-size: 1.85rem;
    font-weight: 700;
    color: #111827;
}

.subscription-grid {
    display: grid;
    grid-template-columns: minmax(320px, 1.4fr) minmax(260px, 1fr);
    gap: 1.5rem;
}

.billing-panel,
.summary-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.billing-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f0f4f8;
}

.billing-row:last-child {
    border-bottom: none;
}

.billing-row span {
    color: #64748b;
    font-size: 0.9rem;
}

.billing-row strong {
    color: #111827;
    font-size: 1rem;
}

.status-row {
    padding-top: 1rem;
}

.summary-card-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.summary-card-header span {
    font-size: 0.95rem;
    font-weight: 700;
    color: #111827;
}

.summary-card-header p {
    margin: 0;
    color: #64748b;
    font-size: 0.9rem;
    line-height: 1.5;
}

.analytics-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.analytics-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 12px;
}

.analytics-item span {
    color: #64748b;
    font-size: 0.9rem;
}

.analytics-item strong {
    color: #111827;
}

.subscription-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-top: 1rem;
}

@media (max-width: 960px) {
    .subscription-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .subscription-actions {
        flex-direction: column;
    }
}
</style>
