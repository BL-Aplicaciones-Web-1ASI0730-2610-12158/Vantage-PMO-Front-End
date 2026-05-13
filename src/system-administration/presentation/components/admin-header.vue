<template>
    <Card class="admin-header-card">
        <template #header>
            <div class="admin-header-content">
                <h1 class="admin-title">{{ $t('systemAdministration.title') }}</h1>
                <p class="admin-subtitle">{{ $t('systemAdministration.subtitle') }}</p>
            </div>
        </template>
        <div class="admin-stats">
            <div class="stat-item">
                <span class="stat-label">{{ $t('systemAdministration.activeUsers') }}</span>
                <span class="stat-value">{{ activeUsers }}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">{{ $t('systemAdministration.systemStatus') }}</span>
                <Tag :value="systemStatus" :severity="statusSeverity" />
            </div>
            <div class="stat-item">
                <span class="stat-label">{{ $t('systemAdministration.lastUpdate') }}</span>
                <span class="stat-value">{{ lastUpdate }}</span>
            </div>
        </div>
    </Card>
</template>

<script setup>
import { computed } from 'vue';
import Card from 'primevue/card';
import Tag from 'primevue/tag';

const props = defineProps({
    activeUsers: {
        type: Number,
        default: 0
    },
    systemStatus: {
        type: String,
        default: 'operational'
    },
    lastUpdate: {
        type: String,
        default: ''
    }
});

const statusSeverity = computed(() => {
    const statusMap = {
        'operational': 'success',
        'warning': 'warning',
        'maintenance': 'info',
        'critical': 'danger'
    };
    return statusMap[props.systemStatus] || 'info';
});
</script>

<style scoped>
.admin-header-card {
    margin-bottom: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.admin-header-content {
    padding: 1rem;
}

.admin-title {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    color: #1a1a1a;
}

.admin-subtitle {
    font-size: 0.95rem;
    color: #666;
    margin: 0;
}

.admin-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    padding: 2rem 1rem;
    border-top: 1px solid #e9ecef;
}

.stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.stat-label {
    font-size: 0.85rem;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
}

.stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1a1a1a;
}

@media (max-width: 768px) {
    .admin-title {
        font-size: 1.5rem;
    }

    .admin-stats {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        padding: 1.5rem 1rem;
    }
}
</style>
