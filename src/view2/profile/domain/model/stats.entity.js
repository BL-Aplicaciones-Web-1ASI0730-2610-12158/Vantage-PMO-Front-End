/**
 * Stats Entity - Domain Model (View 2)
 * Represents portfolio-level statistics for a user in a multi-portfolio context.
 */
export class Stats {
    constructor({
                    id,
                    userId,
                    totalProjects,
                    onTrack,
                    atRisk,
                    trend,
                    portfolioHealth,
                    attentionItems
                }) {
        this.id              = id;
        this.userId          = userId;
        this.totalProjects   = totalProjects;
        this.onTrack         = onTrack;
        this.atRisk          = atRisk;
        this.trend           = trend;
        this.portfolioHealth = portfolioHealth;
        this.attentionItems  = attentionItems;
    }
}