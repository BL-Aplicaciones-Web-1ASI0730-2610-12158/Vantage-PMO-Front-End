/**
 * Stats Entity - Domain Model
 * Represents portfolio statistics for a user.
 */
export class Stats {
    /**
     * @param {number} id
     * @param {number} userId
     * @param {number} totalProjects
     * @param {number} onTrack
     * @param {number} atRisk
     * @param {number} trend
     * @param {string} portfolioHealth
     * @param {number} attentionItems
     */
    constructor({ id, userId, totalProjects, onTrack, atRisk, trend, portfolioHealth, attentionItems }) {
        this.id               = id;
        this.userId           = userId;
        this.totalProjects    = totalProjects;
        this.onTrack          = onTrack;
        this.atRisk           = atRisk;
        this.trend            = trend;
        this.portfolioHealth  = portfolioHealth;
        this.attentionItems   = attentionItems;
    }
}
