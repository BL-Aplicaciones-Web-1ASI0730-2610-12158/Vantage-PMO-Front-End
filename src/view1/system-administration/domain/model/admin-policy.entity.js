/**
 * Admin Policy Entity
 * Represents global platform policies
 */
export class AdminPolicyEntity {
    constructor({
        id,
        passwordPolicy,
        mfaRequired,
        sessionTimeout,
        apiRequestLimits,
        notificationPermissions,
        jwtEnabled,
        encryptedPasswords,
        apiProtection,
        createdAt,
        updatedAt
    }) {
        this.id = id;
        this.passwordPolicy = passwordPolicy; // e.g., 'strict', 'moderate', 'basic'
        this.mfaRequired = mfaRequired; // boolean
        this.sessionTimeout = sessionTimeout; // minutes
        this.apiRequestLimits = apiRequestLimits; // requests per hour
        this.notificationPermissions = notificationPermissions; // boolean
        this.jwtEnabled = jwtEnabled; // boolean
        this.encryptedPasswords = encryptedPasswords; // boolean
        this.apiProtection = apiProtection; // boolean
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
