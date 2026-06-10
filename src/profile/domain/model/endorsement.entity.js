/**
 * Endorsement Entity - Domain Model
 * Represents a colleague endorsement for a user profile.
 */
export class Endorsement {
    /**
     * @param {number} id
     * @param {number} userId
     * @param {string} quote
     * @param {string} authorName
     * @param {string} authorRole
     * @param {string} authorAvatarSeed
     */
    constructor({ id, userId, quote, authorName, authorRole, authorAvatarSeed }) {
        this.id               = id;
        this.userId           = userId;
        this.quote            = quote;
        this.authorName       = authorName;
        this.authorRole       = authorRole;
        this.authorAvatarSeed = authorAvatarSeed;
    }

    get authorAvatarUrl() {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.authorAvatarSeed}`;
    }
}
