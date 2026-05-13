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

        <div class="subscription-content">
            <div class="subscription-info">
                <div class="info-group">
                    <span class="info-label">{{ $t('systemAdministration.currentPlan') }}</span>
                    <span class="info-value">
                        <Tag
                            :value="subscription?.plan || 'N/A'"
                            :severity="getPlanSeverity(subscription?.plan)"
                            class="plan-badge"
                        />
                    </span>
                </div>

                <div class="info-group">
                    <span class="info-label">{{ $t('systemAdministration.activeUsers') }}</span>
                    <span class="info-value">{{ subscription?.activeUsers || 0 }}</span>
                </div>

                <div class="info-group">
                    <span class="info-label">{{ $t('systemAdministration.billingCycle') }}</span>
                    <span class="info-value">{{ formatBillingCycle(subscription?.billingCycle) }}</span>
                </div>

                <div class="info-group">
                    <span class="info-label">{{ $t('systemAdministration.expirationDate') }}</span>
                    <span class="info-value" :class="{ 'text-danger': isExpiringSoon }">
                        {{ formatDate(subscription?.expirationDate) }}
                    </span>
                </div>

                <div class="info-group">
                    <span class="info-label">{{ $t('systemAdministration.status') }}</span>
                    <span class="info-value">
                        <Tag
                            :value="subscription?.status || 'unknown'"
                            :severity="getStatusSeverity(subscription?.status)"
                        />
                    </span>
                </div>
            </div>

            <Divider />

            <div class="subscription-actions">
                <Button
                    :label="$t('systemAdministration.renew')"
                    icon="pi pi-refresh"
                    @click="handleRenew"
                    :loading="isRenewing"
                    class="p-button-primary"
                />
                <Button
                    :label="$t('systemAdministration.upgrade')"
                    icon="pi pi-arrow-up"
                    class="p-button-success"
                />
            </div>
        </div>
    </Card>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Tag from 'primevue/tag';

const props = defineProps({
    subscription: Object,
    loading: Boolean
});

const emit = defineEmits(['renew']);

const isRenewing = ref(false);

const isExpiringSoon = computed(() => {
    if (!props.subscription?.expirationDate) return false;
    const expirationDate = new Date(props.subscription.expirationDate);
    const today = new Date();
    const daysUntilExpiration = Math.floor((expirationDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 30 && daysUntilExpiration > 0;
});

const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
};

const formatBillingCycle = (cycle) => {
    const cycleMap = {
        'monthly': 'Monthly',
        'yearly': 'Yearly'
    };
    return cycleMap[cycle] || cycle;
};

const getPlanSeverity = (plan) => {
    const severityMap = {
        'starter': 'info',
        'professional': 'warning',
        'enterprise': 'success'
    };
    return severityMap[plan] || 'info';
};

const getStatusSeverity = (status) => {
    const severityMap = {
        'active': 'success',
        'expired': 'danger',
        'pending': 'warning'
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
}

.subscription-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-bottom: 1.5rem;
}

.info-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.info-label {
    font-size: 0.85rem;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
}

.info-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a1a1a;
}

.info-value.text-danger {
    color: #ef4444;
}

.plan-badge {
    display: inline-block;
}

.subscription-actions {
    display: flex;
    gap: 0.75rem;
}

@media (max-width: 768px) {
    .subscription-info {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .subscription-actions {
        flex-direction: column;
    }
}
</style>
