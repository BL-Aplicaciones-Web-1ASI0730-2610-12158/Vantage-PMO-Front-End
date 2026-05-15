import { defineStore } from 'pinia';
import { ref } from 'vue';
import { systemAdministrationApi } from '../infrastructure/system-administration-api.js';

export const useSystemAdministrationStore = defineStore('system-administration', () => {
    const branding = ref(null);
    const subscription = ref(null);
    const adminPolicy = ref(null);
    const systemSettings = ref(null);
    const recentLoginAttempts = ref([]);
    const loading = ref(false);
    const error = ref(null);

    // Branding actions
    async function fetchBranding() {
        loading.value = true;
        error.value = null;
        try {
            branding.value = await systemAdministrationApi.getBranding();
        } catch (err) {
            error.value = err.message;
            console.error('Failed to fetch branding:', err);
        } finally {
            loading.value = false;
        }
    }

    async function updateBranding(brandingData) {
        loading.value = true;
        error.value = null;
        try {
            branding.value = await systemAdministrationApi.updateBranding(brandingData);
        } catch (err) {
            error.value = err.message;
            console.error('Failed to update branding:', err);
        } finally {
            loading.value = false;
        }
    }

    // Subscription actions
    async function fetchSubscription() {
        loading.value = true;
        error.value = null;
        try {
            subscription.value = await systemAdministrationApi.getSubscription();
        } catch (err) {
            error.value = err.message;
            console.error('Failed to fetch subscription:', err);
        } finally {
            loading.value = false;
        }
    }

    async function updateSubscription(subscriptionData) {
        loading.value = true;
        error.value = null;
        try {
            subscription.value = await systemAdministrationApi.updateSubscription(subscriptionData);
        } catch (err) {
            error.value = err.message;
            console.error('Failed to update subscription:', err);
        } finally {
            loading.value = false;
        }
    }

    async function renewSubscription(subscriptionId) {
        loading.value = true;
        error.value = null;
        try {
            subscription.value = await systemAdministrationApi.renewSubscription(subscriptionId);
        } catch (err) {
            error.value = err.message;
            console.error('Failed to renew subscription:', err);
        } finally {
            loading.value = false;
        }
    }

    // Admin Policy actions
    async function fetchAdminPolicy() {
        loading.value = true;
        error.value = null;
        try {
            adminPolicy.value = await systemAdministrationApi.getAdminPolicy();
        } catch (err) {
            error.value = err.message;
            console.error('Failed to fetch admin policy:', err);
        } finally {
            loading.value = false;
        }
    }

    async function updateAdminPolicy(policyData) {
        loading.value = true;
        error.value = null;
        try {
            adminPolicy.value = await systemAdministrationApi.updateAdminPolicy(policyData);
        } catch (err) {
            error.value = err.message;
            console.error('Failed to update admin policy:', err);
        } finally {
            loading.value = false;
        }
    }

    // System Settings actions
    async function fetchSystemSettings() {
        loading.value = true;
        error.value = null;
        try {
            systemSettings.value = await systemAdministrationApi.getSystemSettings();
        } catch (err) {
            error.value = err.message;
            console.error('Failed to fetch system settings:', err);
        } finally {
            loading.value = false;
        }
    }

    async function updateSystemSettings(settingsData) {
        loading.value = true;
        error.value = null;
        try {
            systemSettings.value = await systemAdministrationApi.updateSystemSettings(settingsData);
        } catch (err) {
            error.value = err.message;
            console.error('Failed to update system settings:', err);
        } finally {
            loading.value = false;
        }
    }

    // Login attempts
    async function fetchRecentLoginAttempts() {
        loading.value = true;
        error.value = null;
        try {
            recentLoginAttempts.value = await systemAdministrationApi.getRecentLoginAttempts();
        } catch (err) {
            error.value = err.message;
            console.error('Failed to fetch login attempts:', err);
        } finally {
            loading.value = false;
        }
    }

    // Fetch all data
    async function fetchAllAdminData() {
        await Promise.all([
            fetchBranding(),
            fetchSubscription(),
            fetchAdminPolicy(),
            fetchSystemSettings(),
            fetchRecentLoginAttempts()
        ]);
    }

    return {
        // State
        branding,
        subscription,
        adminPolicy,
        systemSettings,
        recentLoginAttempts,
        loading,
        error,

        // Branding
        fetchBranding,
        updateBranding,

        // Subscription
        fetchSubscription,
        updateSubscription,
        renewSubscription,

        // Admin Policy
        fetchAdminPolicy,
        updateAdminPolicy,

        // System Settings
        fetchSystemSettings,
        updateSystemSettings,
        fetchRecentLoginAttempts,

        // All
        fetchAllAdminData
    };
});
