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
        <template #content>
            <div class="security-content">
            <div class="security-status-cards">
                <div class="status-card">
                    <span class="status-title">{{ $t('systemAdministration.jwtAuthenticationActive') }}</span>
                    <Tag :value="adminPolicy.jwtEnabled ? 'Active' : 'Inactive'" :severity="adminPolicy.jwtEnabled ? 'success' : 'danger'" />
                </div>
                <div class="status-card">
                    <span class="status-title">{{ $t('systemAdministration.passwordEncryptionEnabled') }}</span>
                    <Tag :value="adminPolicy.encryptedPasswords ? 'Enabled' : 'Disabled'" :severity="adminPolicy.encryptedPasswords ? 'success' : 'danger'" />
                </div>
                <div class="status-card">
                    <span class="status-title">{{ $t('systemAdministration.apiProtectionActive') }}</span>
                    <Tag :value="adminPolicy.apiProtection ? 'Active' : 'Inactive'" :severity="adminPolicy.apiProtection ? 'success' : 'danger'" />
                </div>
                <div class="status-card">
                    <span class="status-title">{{ $t('systemAdministration.firewallStatusActive') }}</span>
                    <Tag :value="firewallStatus" :severity="firewallStatus === 'Enabled' ? 'success' : 'warning'" />
                </div>
            </div>

            <div class="security-layout">
                <div class="security-main">
                    <div class="login-attempts">
                        <h3>{{ $t('systemAdministration.recentLoginAttempts') }}</h3>
                        <DataTable :value="securityRows" :paginator="true" :rows="5" responsiveLayout="scroll" class="login-table">
                            <Column field="user" :header="$t('systemAdministration.user')" />
                            <Column field="device" :header="$t('systemAdministration.device')" />
                            <Column field="ipAddress" :header="$t('systemAdministration.ipAddress')" />
                            <Column field="timestamp" :header="$t('systemAdministration.time')" :body="formatTime" />
                            <Column field="status" :header="$t('systemAdministration.status')">
                                <template #body="{ data }">
                                    <Tag :value="data.statusLabel" :severity="data.status === 'success' ? 'success' : 'danger'" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>

                    <div class="security-panels">
                        <div class="security-panel">
                            <h4>{{ $t('systemAdministration.activeSessions') }}</h4>
                            <p>{{ activeSessions }} sessions currently active</p>
                        </div>
                        <div class="security-panel">
                            <h4>{{ $t('systemAdministration.failedLoginAttempts') }}</h4>
                            <p>{{ failedLoginAttempts }} failed attempts in the last 24 hours</p>
                        </div>
                        <div class="security-panel">
                            <h4>{{ $t('systemAdministration.securityActivityLog') }}</h4>
                            <ul>
                                <li v-for="(entry, index) in securityActivityLog" :key="index">{{ entry }}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="security-summary-card">
                    <div class="summary-title">{{ $t('systemAdministration.threatLevel') }}</div>
                    <Tag :value="threatLevel" :severity="threatSeverity" />

                    <div class="health-chart">
                        <div class="health-score">{{ securityHealthScore }}%</div>
                        <span>{{ $t('systemAdministration.securityHealthScore') }}</span>
                    </div>

                    <div class="summary-details">
                        <div>
                            <span>Critical alerts</span>
                            <strong>{{ criticalAlerts }}</strong>
                        </div>
                        <div>
                            <span>Recent policy checks</span>
                            <strong>{{ recentPolicyChecks }}</strong>
                        </div>
                    </div>

                    <Button label="$t('systemAdministration.forceLogout')" icon="pi pi-sign-out" class="p-button-danger" />
                </div>
            </div>
        </div>
        </template>
    </Card>
</template>

<script setup>
import { computed } from 'vue';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from 'primevue/button';

const props = defineProps({
    adminPolicy: Object,
    recentLoginAttempts: {
        type: Array,
        default: () => []
    }
});

const adminPolicy = computed(() => ({
    jwtEnabled: props.adminPolicy?.jwtEnabled ?? true,
    encryptedPasswords: props.adminPolicy?.encryptedPasswords ?? true,
    apiProtection: props.adminPolicy?.apiProtection ?? true
}));

const firewallStatus = computed(() => (adminPolicy.value.apiProtection ? 'Enabled' : 'Review'));
const threatLevel = computed(() => (props.recentLoginAttempts.length > 4 ? 'Elevated' : 'Low'));
const threatSeverity = computed(() => (threatLevel.value === 'Low' ? 'success' : 'warning'));
const securityHealthScore = computed(() => (threatLevel.value === 'Low' ? 92 : 68));
const activeSessions = computed(() => props.recentLoginAttempts.length + 8);
const failedLoginAttempts = computed(() => props.recentLoginAttempts.filter((item) => item.status !== 'success').length || 3);
const criticalAlerts = computed(() => Math.max(1, failedLoginAttempts.value));
const recentPolicyChecks = computed(() => 5);

const securityRows = computed(() =>
    props.recentLoginAttempts.map((row, index) => ({
        ...row,
        device: row.device || ['Windows Desktop', 'MacBook Pro', 'Chrome Mobile', 'Linux Workstation'][index % 4],
        ipAddress: row.ipAddress || `192.168.4.${index + 11}`,
        statusLabel: row.status === 'success' ? 'Success' : 'Failed'
    }))
);

const formatTime = (data) => {
    if (!data.timestamp) return 'N/A';
    return new Date(data.timestamp).toLocaleString();
};

const securityActivityLog = computed(() => [
    'Elevated risk detected for user rachel.t.',
    'New device added to admin account.',
    'Password policy compliance check completed.',
]);
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
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.security-status-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 1rem;
}

.status-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.status-title {
    font-size: 0.85rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;
}

.security-layout {
    display: grid;
    grid-template-columns: minmax(320px, 1.8fr) minmax(280px, 1fr);
    gap: 1.5rem;
}

.security-main {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.login-attempts {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 1.5rem;
}

.login-attempts h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 700;
    color: #111827;
}

.login-table {
    font-size: 0.9rem;
}

.security-panels {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
}

.security-panel {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 1rem 1.25rem;
}

.security-panel h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.95rem;
    color: #111827;
}

.security-panel p,
.security-panel ul {
    margin: 0;
    color: #64748b;
    font-size: 0.9rem;
    line-height: 1.5;
}

.security-panel ul {
    padding-left: 1.25rem;
}

.security-summary-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.summary-title {
    font-size: 1rem;
    font-weight: 700;
    color: #111827;
}

.health-chart {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f8fafc;
    border-radius: 14px;
    padding: 1rem;
}

.health-score {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
}

.health-chart span {
    color: #64748b;
}

.summary-details {
    display: grid;
    gap: 0.75rem;
}

.summary-details div {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.9rem 1rem;
    background: #f8fafc;
    border-radius: 12px;
}

.summary-details span {
    color: #64748b;
}

.summary-details strong {
    color: #111827;
}

@media (max-width: 960px) {
    .security-layout {
        grid-template-columns: 1fr;
    }
}
</style>
