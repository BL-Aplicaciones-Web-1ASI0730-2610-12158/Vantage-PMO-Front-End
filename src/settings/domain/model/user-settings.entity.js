/**
 * UserSettings Entity
 * Represents the user's personal preferences and platform settings.
 */
export class UserSettings {
    constructor({
        id,
        theme,
        language,
        timezone,
        dateFormat,
        emailNotifications,
        pushNotifications,
        weeklyDigest,
        twoFactorEnabled,
        profileVisibility,
        updatedAt
    }) {
        this.id = id;
        this.theme = theme;
        this.language = language;
        this.timezone = timezone;
        this.dateFormat = dateFormat;
        this.emailNotifications = emailNotifications;
        this.pushNotifications = pushNotifications;
        this.weeklyDigest = weeklyDigest;
        this.twoFactorEnabled = twoFactorEnabled;
        this.profileVisibility = profileVisibility;
        this.updatedAt = updatedAt;
    }
}
