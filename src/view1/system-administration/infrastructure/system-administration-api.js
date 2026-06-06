import { BaseEndpoint } from '../../../shared/infrastructure/base-endpoint.js';
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
        const data = await this.api.get('/branding');
        return BrandingAssembler.toEntity(data);
    }

    async updateBranding(brandingData) {
        const data = await this.api.put('/branding', brandingData);
        return BrandingAssembler.toEntity(data);
    }

    // Subscription endpoints
    async getSubscription() {
        const data = await this.api.get('/subscription');
        return SubscriptionAssembler.toEntity(data);
    }

    async updateSubscription(subscriptionData) {
        const data = await this.api.put('/subscription', subscriptionData);
        return SubscriptionAssembler.toEntity(data);
    }

    async renewSubscription(subscriptionId) {
        const data = await this.api.get(`/subscription/${subscriptionId}/renew`);
        return SubscriptionAssembler.toEntity(data);
    }

    // Admin Policy endpoints
    async getAdminPolicy() {
        const data = await this.api.get('/admin-policy');
        return AdminPolicyAssembler.toEntity(data);
    }

    async updateAdminPolicy(policyData) {
        const data = await this.api.put('/admin-policy', policyData);
        return AdminPolicyAssembler.toEntity(data);
    }

    // System Settings endpoints
    async getSystemSettings() {
        const data = await this.api.get('/system-settings');
        return SystemSettingAssembler.toEntity(data);
    }

    async updateSystemSettings(settingsData) {
        const data = await this.api.put('/system-settings', settingsData);
        return SystemSettingAssembler.toEntity(data);
    }

    async getRecentLoginAttempts() {
        const data = await this.api.get('/login-attempts');
        return Array.isArray(data) ? data : [];
    }
}

export const systemAdministrationApi = new SystemAdministrationApi();
