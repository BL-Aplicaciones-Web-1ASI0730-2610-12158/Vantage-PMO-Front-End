/**
 * System Setting Entity
 * Represents global system configuration settings
 */
export class SystemSettingEntity {
    constructor({
        id,
        // System Alerts
        securityAlerts,
        securityAlertsChannels,
        systemHealthAlerts,
        systemHealthAlertsChannels,
        // Project Alerts
        projectStatusAlerts,
        projectStatusAlertsChannels,
        milestoneAlerts,
        milestoneAlertsChannels,
        // User Activity
        userRegistrationAlerts,
        userRegistrationAlertsChannels,
        taskAssignmentAlerts,
        taskAssignmentAlertsChannels,
        // Legacy fields (for backward compatibility)
        emailNotifications,
        pushNotifications,
        reportAlerts,
        adminAlerts,
        recentLoginAttempts,
        createdAt,
        updatedAt
    }) {
        this.id = id;

        // System Alerts
        this.securityAlerts = securityAlerts ?? adminAlerts ?? true;
        this.securityAlertsChannels = securityAlertsChannels ?? ['email', 'push'];
        this.systemHealthAlerts = systemHealthAlerts ?? adminAlerts ?? true;
        this.systemHealthAlertsChannels = systemHealthAlertsChannels ?? ['email'];

        // Project Alerts
        this.projectStatusAlerts = projectStatusAlerts ?? reportAlerts ?? true;
        this.projectStatusAlertsChannels = projectStatusAlertsChannels ?? ['email', 'inApp'];
        this.milestoneAlerts = milestoneAlerts ?? reportAlerts ?? true;
        this.milestoneAlertsChannels = milestoneAlertsChannels ?? ['email', 'push', 'inApp'];

        // User Activity
        this.userRegistrationAlerts = userRegistrationAlerts ?? false;
        this.userRegistrationAlertsChannels = userRegistrationAlertsChannels ?? ['email'];
        this.taskAssignmentAlerts = taskAssignmentAlerts ?? true;
        this.taskAssignmentAlertsChannels = taskAssignmentAlertsChannels ?? ['inApp'];

        // Legacy fields
        this.emailNotifications = emailNotifications ?? true;
        this.pushNotifications = pushNotifications ?? true;
        this.reportAlerts = reportAlerts ?? true;
        this.adminAlerts = adminAlerts ?? true;

        this.recentLoginAttempts = recentLoginAttempts || [];
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
