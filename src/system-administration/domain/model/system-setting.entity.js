/**
 * System Setting Entity
 * Represents global system configuration settings
 */
export class SystemSettingEntity {
    constructor({
        id,
        emailNotifications,
        pushNotifications,
        reportAlerts,
        adminAlerts,
        recentLoginAttempts,
        createdAt,
        updatedAt
    }) {
        this.id = id;
        this.emailNotifications = emailNotifications; // boolean
        this.pushNotifications = pushNotifications; // boolean
        this.reportAlerts = reportAlerts; // boolean
        this.adminAlerts = adminAlerts; // boolean
        this.recentLoginAttempts = recentLoginAttempts || []; // array of login events
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
