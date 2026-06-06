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

                <div v-else class="settings-workspace">
                    <!-- Settings Layout -->
                    <div class="settings-container">
                        <!-- Internal Sidebar -->
                        <SettingsSidebar
                            :activeSection="activeSection"
                            @section-change="handleSectionChange"
                        />

                        <!-- Content Panel -->
                        <div class="content-panel">
                            <!-- Branding Section -->
                            <div v-if="activeSection === 'branding'" class="section-content">
                                <div class="section-header">
                                    <h2>{{ $t('systemAdministration.branding') }}</h2>
                                    <p class="section-description">{{ $t('systemAdministration.brandingDesc') }}</p>
                                </div>
                                <BrandingCard
                                    :branding="store.branding"
                                    :loading="store.loading"
                                    @save="handleBrandingSave"
                                    @reset="handleBrandingReset"
                                />
                            </div>

                            <!-- Subscription Section -->
                            <div v-if="activeSection === 'subscription'" class="section-content">
                                <div class="section-header">
                                    <h2>{{ $t('systemAdministration.subscription') }}</h2>
                                    <p class="section-description">{{ $t('systemAdministration.subscriptionDesc') }}</p>
                                </div>
                                <SubscriptionCard
                                    :subscription="store.subscription"
                                    :loading="store.loading"
                                    @renew="handleSubscriptionRenew"
                                />
                            </div>

                            <!-- Policies Section -->
                            <div v-if="activeSection === 'policies'" class="section-content">
                                <div class="section-header">
                                    <h2>{{ $t('systemAdministration.globalPolicies') }}</h2>
                                    <p class="section-description">{{ $t('systemAdministration.policiesDesc') }}</p>
                                </div>
                                <GlobalPolicyCard
                                    :adminPolicy="store.adminPolicy"
                                    :loading="store.loading"
                                    @save="handlePolicySave"
                                />
                            </div>

                            <!-- Security Section -->
                            <div v-if="activeSection === 'security'" class="section-content">
                                <div class="section-header">
                                    <h2>{{ $t('systemAdministration.security') }}</h2>
                                    <p class="section-description">{{ $t('systemAdministration.securityDesc') }}</p>
                                </div>
                                <SecurityCard
                                    :adminPolicy="store.adminPolicy"
                                    :recentLoginAttempts="store.recentLoginAttempts"
                                />
                            </div>

                            <!-- Notifications Section -->
                            <div v-if="activeSection === 'notifications'" class="section-content">
                                <div class="section-header">
                                    <h2>{{ $t('systemAdministration.notifications') }}</h2>
                                    <p class="section-description">{{ $t('systemAdministration.notificationsDesc') }}</p>
                                </div>
                                <NotificationSettings
                                    :systemSettings="store.systemSettings"
                                    :loading="store.loading"
                                    @save="handleSettingsSave"
                                    @test="handleTestNotification"
                                />
                            </div>

                            <!-- Integrations Section -->
                            <div v-if="activeSection === 'integrations'" class="section-content">
                                <Integrations @connect="handleIntegrationConnect" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toast for notifications -->
        <Toast />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Toast from 'primevue/toast';
import { useSystemAdministrationStore } from '../../application/system-administration.store.js';
import AdminSidebar from '../components/admin-sidebar.vue';
import SettingsSidebar from '../components/settings-sidebar.vue';
import BrandingCard from '../components/branding-card.vue';
import SubscriptionCard from '../components/subscription-card.vue';
import SecurityCard from '../components/security-card.vue';
import GlobalPolicyCard from '../components/global-policy-card.vue';
import NotificationSettings from '../components/notification-settings.vue';
import Integrations from '../components/integrations.vue';

const store = useSystemAdministrationStore();
const toast = useToast();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const isSidebarOpen = ref(false);
const adminName = ref('John Administrator');
const adminRole = ref('System Administrator');

const validSections = ['branding', 'subscription', 'policies', 'security', 'notifications', 'integrations'];

const activeSection = ref(validSections.includes(route.params.section) ? route.params.section : 'branding');

watch(
    () => route.params.section,
    (section) => {
        activeSection.value = validSections.includes(section) ? section : 'branding';
    }
);

const systemStatus = computed(() => {
    return 'operational';
});

const lastUpdateTime = computed(() => {
    return new Date().toLocaleString();
});

onMounted(async () => {
    await store.fetchAllAdminData();
});

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

const handleBrandingReset = async () => {
    await store.fetchBranding();
    toast.add({
        severity: 'info',
        summary: t('systemAdministration.success'),
        detail: t('systemAdministration.brandingUpdated'),
        life: 2500
    });
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

const handleSectionChange = (section) => {
    activeSection.value = section;
    router.replace({ name: 'system-administration', params: { section } });
};

const handleIntegrationConnect = (integration) => {
    toast.add({
        severity: 'info',
        summary: t('systemAdministration.integrations'),
        detail: `Connecting to ${integration}...`,
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
    padding: 0;
}

.settings-workspace {
    height: 100%;
}

.settings-container {
    display: flex;
    height: 100%;
    background: white;
}

.content-panel {
    flex: 1;
    overflow-y: auto;
    background: #f8fafc;
}

.section-content {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.section-header {
    margin-bottom: 2rem;
}

.section-header h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.75rem;
    font-weight: 700;
    color: #1a1a1a;
}

.section-description {
    margin: 0;
    color: #64748b;
    font-size: 1rem;
    line-height: 1.5;
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

@media (max-width: 768px) {
    .toggle-sidebar {
        display: block !important;
    }

    .page-container {
        flex-direction: column;
    }

    .settings-container {
        flex-direction: column;
    }

    .section-content {
        padding: 1.5rem;
    }
}
</style>
