import baseApi from '../../shared/infrastructure/base-api.js';
import { BrandingAssembler } from './branding.assembler.js';
import { SubscriptionAssembler } from './subscription.assembler.js';
import { AdminPolicyAssembler } from './admin-policy.assembler.js';
import { SystemSettingAssembler } from './system-setting.assembler.js';

/**
 * System Administration API
 * Resources are flat under the API base (e.g. /api/v1/branding), not under /system-administration.
 */
class SystemAdministrationApi {
    async getBranding() {
        const { data } = await baseApi.get('branding');
        return BrandingAssembler.toEntity(data);
    }

    async updateBranding(brandingData) {
        const { data } = await baseApi.put('branding', brandingData);
        return BrandingAssembler.toEntity(data);
    }

    async getSubscription() {
        const { data } = await baseApi.get('subscription');
        return SubscriptionAssembler.toEntity(data);
    }

    async updateSubscription(subscriptionData) {
        const { data } = await baseApi.put('subscription', subscriptionData);
        return SubscriptionAssembler.toEntity(data);
    }

    async renewSubscription(subscriptionId) {
        const { data } = await baseApi.get(`subscription/${subscriptionId}/renew`);
        return SubscriptionAssembler.toEntity(data);
    }

    async getAdminPolicy() {
        const { data } = await baseApi.get('admin-policy');
        return AdminPolicyAssembler.toEntity(data);
    }

    async updateAdminPolicy(policyData) {
        const { data } = await baseApi.put('admin-policy', policyData);
        return AdminPolicyAssembler.toEntity(data);
    }

    async getSystemSettings() {
        const { data } = await baseApi.get('system-settings');
        return SystemSettingAssembler.toEntity(data);
    }

    async updateSystemSettings(settingsData) {
        const { data } = await baseApi.put('system-settings', settingsData);
        return SystemSettingAssembler.toEntity(data);
    }

    async getRecentLoginAttempts() {
        const { data } = await baseApi.get('login-attempts');
        return Array.isArray(data) ? data : [];
    }
}

export const systemAdministrationApi = new SystemAdministrationApi();
