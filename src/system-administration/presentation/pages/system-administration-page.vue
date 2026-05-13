<template>
    <div class="system-administration-page">
        <div class="page-header">
            <Button
                icon="pi pi-bars"
                class="p-button-rounded p-button-text toggle-sidebar"
                @click="isSidebarOpen = !isSidebarOpen"
            />
            <h1 class="page-title">{{ $t('systemAdministration.title') }}</h1>
        </div>

        <div class="page-container">
            <AdminSidebar
                v-model:visible="isSidebarOpen"
                :adminName="adminName"
                :adminRole="adminRole"
                @close="isSidebarOpen = false"
            />

            <div class="page-content">
                <div v-if="store.loading" class="loading-state">
                    <ProgressSpinner />
                    <p>{{ $t('systemAdministration.loading') }}</p>
                </div>

                <div v-else-if="store.error" class="error-state">
                    <Message severity="error" :text="store.error" />
                </div>

                <div v-else class="admin-dashboard">
                    <!-- Header -->
                    <AdminHeader
                        :activeUsers="store.subscription?.activeUsers || 0"
                        :systemStatus="systemStatus"
                        :lastUpdate="lastUpdateTime"
                    />

                    <!-- Tabs Section -->
                    <TabView class="admin-tabs">
                        <!-- Overview Tab -->
                        <TabPanel :header="$t('systemAdministration.overview')">
                            <div class="tab-content">
                                <div class="cards-grid">
                                    <BrandingCard
                                        :branding="store.branding"
                                        :loading="store.loading"
                                        @save="handleBrandingSave"
                                    />
                                    <SubscriptionCard
                                        :subscription="store.subscription"
                                        :loading="store.loading"
                                        @renew="handleSubscriptionRenew"
                                    />
                                </div>
                            </div>
                        </TabPanel>

                        <!-- Security Tab -->
                        <TabPanel :header="$t('systemAdministration.security')">
                            <div class="tab-content">
                                <SecurityCard
                                    :adminPolicy="store.adminPolicy"
                                    :recentLoginAttempts="store.recentLoginAttempts"
                                />
                            </div>
                        </TabPanel>

                        <!-- Policies Tab -->
                        <TabPanel :header="$t('systemAdministration.globalPolicies')">
                            <div class="tab-content">
                                <GlobalPolicyCard
                                    :adminPolicy="store.adminPolicy"
                                    :loading="store.loading"
                                    @save="handlePolicySave"
                                />
                            </div>
                        </TabPanel>

                        <!-- Notifications Tab -->
                        <TabPanel :header="$t('systemAdministration.notifications')">
                            <div class="tab-content">
                                <NotificationSettings
                                    :systemSettings="store.systemSettings"
                                    :loading="store.loading"
                                    @save="handleSettingsSave"
                                    @test="handleTestNotification"
                                />
                            </div>
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>

        <!-- Toast for notifications -->
        <Toast />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Toast from 'primevue/toast';
import { useSystemAdministrationStore } from '../../application/system-administration.store.js';
import AdminHeader from '../components/admin-header.vue';
import BrandingCard from '../components/branding-card.vue';
import SubscriptionCard from '../components/subscription-card.vue';
import SecurityCard from '../components/security-card.vue';
import GlobalPolicyCard from '../components/global-policy-card.vue';
import NotificationSettings from '../components/notification-settings.vue';
import AdminSidebar from '../components/admin-sidebar.vue';

const store = useSystemAdministrationStore();
const toast = useToast();
const { t } = useI18n();

const isSidebarOpen = ref(false);
const adminName = ref('John Administrator');
const adminRole = ref('System Administrator');

const systemStatus = computed(() => {
    return 'operational';
});

const lastUpdateTime = computed(() => {
    return new Date().toLocaleString();
});

onMounted(async () => {
    await store.fetchAllAdminData();
});

const handleBrandingSave = async (brandingData) => {
    try {
        await store.updateBranding(brandingData);
        toast.add({
            severity: 'success',
            summary: t('systemAdministration.success'),
            detail: t('systemAdministration.brandingUpdated'),
            life: 3000
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: t('systemAdministration.error'),
            detail: error.message,
            life: 3000
        });
    }
};

const handleSubscriptionRenew = async (subscriptionId) => {
    try {
        await store.renewSubscription(subscriptionId);
        toast.add({
            severity: 'success',
            summary: t('systemAdministration.success'),
            detail: t('systemAdministration.subscriptionRenewed'),
            life: 3000
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: t('systemAdministration.error'),
            detail: error.message,
            life: 3000
        });
    }
};

const handlePolicySave = async (policyData) => {
    try {
        await store.updateAdminPolicy(policyData);
        toast.add({
            severity: 'success',
            summary: t('systemAdministration.success'),
            detail: t('systemAdministration.policiesUpdated'),
            life: 3000
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: t('systemAdministration.error'),
            detail: error.message,
            life: 3000
        });
    }
};

const handleSettingsSave = async (settingsData) => {
    try {
        await store.updateSystemSettings(settingsData);
        toast.add({
            severity: 'success',
            summary: t('systemAdministration.success'),
            detail: t('systemAdministration.settingsUpdated'),
            life: 3000
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: t('systemAdministration.error'),
            detail: error.message,
            life: 3000
        });
    }
};

const handleTestNotification = (settingsData) => {
    toast.add({
        severity: 'info',
        summary: t('systemAdministration.testNotification'),
        detail: t('systemAdministration.testNotificationSent'),
        life: 3000
    });
};
</script>

<style scoped>
.system-administration-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #f9fafb;
}

.page-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background-color: white;
    border-bottom: 1px solid #e9ecef;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.toggle-sidebar {
    display: none;
}

.page-title {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    color: #1a1a1a;
}

.page-container {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.page-content {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
}

.loading-state,
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 1rem;
}

.admin-dashboard {
    max-width: 1400px;
    margin: 0 auto;
}

.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.admin-tabs :deep(.p-tabview-nav) {
    background-color: white;
    border-bottom: 2px solid #e9ecef;
}

.admin-tabs :deep(.p-tabview-panels) {
    background-color: transparent;
    padding: 0;
}

.tab-content {
    padding: 2rem 0;
}

@media (max-width: 768px) {
    .page-header {
        padding: 1rem;
    }

    .page-title {
        font-size: 1.25rem;
    }

    .toggle-sidebar {
        display: block !important;
    }

    .page-content {
        padding: 1rem;
    }

    .cards-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .tab-content {
        padding: 1rem 0;
    }
}
</style>
