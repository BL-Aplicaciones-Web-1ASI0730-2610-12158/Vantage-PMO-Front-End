/**
 * ProfileSkill Entity - Domain Model
 * Represents a technical skill with proficiency percentage.
 */
export class ProfileSkill {
    /**
     * @param {number} id
     * @param {number} userId
     * @param {string} name
     * @param {number} percentage
     */
    constructor({ id, userId, name, percentage }) {
        this.id         = id;
        this.userId     = userId;
        this.name       = name;
        this.percentage = percentage;
    }
}
