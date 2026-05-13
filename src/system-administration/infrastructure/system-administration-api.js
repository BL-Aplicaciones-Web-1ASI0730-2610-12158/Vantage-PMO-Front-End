import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { BrandingAssembler } from './branding.assembler.js';
import { SubscriptionAssembler } from './subscription.assembler.js';
import { AdminPolicyAssembler } from './admin-policy.assembler.js';
import { SystemSettingAssembler } from './system-setting.assembler.js';

/**
 * System Administration API
 * Handles all system-wide administration operations
 */
class SystemAdministrationApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_SYSTEM_ADMINISTRATION_ENDPOINT_PATH);
    }

    // Branding endpoints
    async getBranding() {
        const data = await super.getById('branding');
        return BrandingAssembler.toEntity(data);
    }

    async updateBranding(brandingData) {
        const data = await super.update('branding', brandingData);
        return BrandingAssembler.toEntity(data);
    }

    // Subscription endpoints
    async getSubscription() {
        const data = await super.getById('subscription');
        return SubscriptionAssembler.toEntity(data);
    }

    async updateSubscription(subscriptionData) {
        const data = await super.update('subscription', subscriptionData);
        return SubscriptionAssembler.toEntity(data);
    }

    async renewSubscription(subscriptionId) {
        const data = await super.getById(`subscription/${subscriptionId}/renew`);
        return SubscriptionAssembler.toEntity(data);
    }

    // Admin Policy endpoints
    async getAdminPolicy() {
        const data = await super.getById('admin-policy');
        return AdminPolicyAssembler.toEntity(data);
    }

    async updateAdminPolicy(policyData) {
        const data = await super.update('admin-policy', policyData);
        return AdminPolicyAssembler.toEntity(data);
    }

    // System Settings endpoints
    async getSystemSettings() {
        const data = await super.getById('system-settings');
        return SystemSettingAssembler.toEntity(data);
    }

    async updateSystemSettings(settingsData) {
        const data = await super.update('system-settings', settingsData);
        return SystemSettingAssembler.toEntity(data);
    }

    async getRecentLoginAttempts() {
        const data = await super.getByQuery('login-attempts', { limit: 10 });
        return Array.isArray(data) ? data : [];
    }
}

export const systemAdministrationApi = new SystemAdministrationApi();
