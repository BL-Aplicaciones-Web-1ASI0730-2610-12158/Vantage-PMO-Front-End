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
        timeFormat,
        firstDayOfWeek,
        currency,
        accentColor,
        density,
        emailNotifications,
        pushNotifications,
        weeklyDigest,
        mentionAlerts,
        twoFactorEnabled,
        profileVisibility,
        displayName,
        jobTitle,
        bio,
        phone,
        department,
        updatedAt
    }) {
        this.id                  = id;
        this.theme               = theme               ?? 'light';
        this.language            = language            ?? 'en';
        this.timezone            = timezone            ?? 'America/New_York';
        this.dateFormat          = dateFormat          ?? 'MM/DD/YYYY';
        this.timeFormat          = timeFormat          ?? '12h';
        this.firstDayOfWeek      = firstDayOfWeek      ?? 'Sunday';
        this.currency            = currency            ?? 'USD';
        this.accentColor         = accentColor         ?? '#3b82f6';
        this.density             = density             ?? 'comfortable';
        this.emailNotifications  = emailNotifications  ?? true;
        this.pushNotifications   = pushNotifications   ?? true;
        this.weeklyDigest        = weeklyDigest        ?? false;
        this.mentionAlerts       = mentionAlerts       ?? true;
        this.twoFactorEnabled    = twoFactorEnabled    ?? false;
        this.profileVisibility   = profileVisibility   ?? 'team';
        this.displayName         = displayName         ?? 'Alex Sterling';
        this.jobTitle            = jobTitle            ?? 'Lead Architect';
        this.bio                 = bio                 ?? '';
        this.phone               = phone               ?? '';
        this.department          = department          ?? 'Executive';
        this.updatedAt           = updatedAt;
    }
}
