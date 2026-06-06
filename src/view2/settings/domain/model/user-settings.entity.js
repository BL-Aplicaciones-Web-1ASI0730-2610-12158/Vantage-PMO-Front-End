export class UserSettings {
    constructor({
                    id,
                    orgId,
                    role,
                    theme,
                    language,
                    timezone,
                    currency,
                    density,
                    emailNotifications,
                    twoFactorEnabled,
                    profileVisibility,
                    department,
                    orgPolicyLocked = false,
                    allowedIntegrations = [],
                    updatedAt
                }) {
        this.id = id;
        this.orgId = orgId;
        this.role = role;

        this.theme = theme ?? 'light';
        this.language = language ?? 'en';
        this.timezone = timezone ?? 'UTC';
        this.currency = currency ?? 'USD';
        this.density = density ?? 'comfortable';

        this.emailNotifications = emailNotifications ?? true;
        this.twoFactorEnabled = twoFactorEnabled ?? true;

        this.profileVisibility = profileVisibility ?? 'organization';
        this.department = department;

        // 🏢 Enterprise
        this.orgPolicyLocked = orgPolicyLocked;
        this.allowedIntegrations = allowedIntegrations;

        this.updatedAt = updatedAt;
    }
}