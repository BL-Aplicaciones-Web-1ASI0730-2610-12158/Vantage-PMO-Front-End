<template>
    <Card class="security-card">
        <template #header>
            <div class="card-header">
                <h2 class="card-title">
                    <i class="pi pi-lock"></i>
                    {{ $t('systemAdministration.security') }}
                </h2>
            </div>
        </template>

        <div class="security-content">
            <div class="security-status">
                <div class="status-item">
                    <div class="status-badge" :class="{ active: adminPolicy?.jwtEnabled }">
                        <i class="pi pi-check"></i>
                    </div>
                    <div class="status-info">
                        <h3>{{ $t('systemAdministration.jwtEnabled') }}</h3>
                        <p>{{ adminPolicy?.jwtEnabled ? $t('systemAdministration.active') : $t('systemAdministration.inactive') }}</p>
                    </div>
                </div>

                <div class="status-item">
                    <div class="status-badge" :class="{ active: adminPolicy?.encryptedPasswords }">
                        <i class="pi pi-check"></i>
                    </div>
                    <div class="status-info">
                        <h3>{{ $t('systemAdministration.encryptedPasswords') }}</h3>
                        <p>{{ adminPolicy?.encryptedPasswords ? $t('systemAdministration.active') : $t('systemAdministration.inactive') }}</p>
                    </div>
                </div>

                <div class="status-item">
                    <div class="status-badge" :class="{ active: adminPolicy?.apiProtection }">
                        <i class="pi pi-check"></i>
                    </div>
                    <div class="status-info">
                        <h3>{{ $t('systemAdministration.apiProtection') }}</h3>
                        <p>{{ adminPolicy?.apiProtection ? $t('systemAdministration.active') : $t('systemAdministration.inactive') }}</p>
                    </div>
                </div>
            </div>

            <Divider />

            <div class="login-attempts">
                <h3>{{ $t('systemAdministration.recentLoginAttempts') }}</h3>
                <DataTable
                    :value="recentLoginAttempts"
                    :paginator="true"
                    :rows="5"
                    responsiveLayout="scroll"
                    class="login-table"
                >
                    <Column field="user" :header="$t('systemAdministration.user')" />
                    <Column field="timestamp" :header="$t('systemAdministration.time')" :body="formatTime" />
                    <Column field="status" :header="$t('systemAdministration.status')">
                        <template #body="{ data }">
                            <Tag
                                :value="data.status"
                                :severity="data.status === 'success' ? 'success' : 'danger'"
                            />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </Card>
</template>

<script setup>
import { ref } from 'vue';
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

const props = defineProps({
    adminPolicy: Object,
    recentLoginAttempts: {
        type: Array,
        default: () => []
    }
});

const formatTime = (data) => {
    if (!data.timestamp) return 'N/A';
    return new Date(data.timestamp).toLocaleString();
};
</script>

<style scoped>
.security-card {
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
    color: #ef4444;
}

.security-content {
    padding: 2rem;
}

.security-status {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.status-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1rem;
    border: 1px solid #e9ecef;
    border-radius: 4px;
}

.status-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f3f4f6;
    color: #999;
    flex-shrink: 0;
}

.status-badge.active {
    background-color: #dcfce7;
    color: #10b981;
}

.status-info h3 {
    margin: 0 0 0.25rem 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: #1a1a1a;
}

.status-info p {
    margin: 0;
    font-size: 0.85rem;
    color: #999;
}

.login-attempts h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #1a1a1a;
}

.login-table {
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .security-status {
        grid-template-columns: 1fr;
    }
}
</style>
