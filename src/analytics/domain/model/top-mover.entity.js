/**
 * Entity — Project with the biggest performance delta in the current cycle.
 */
export class TopMover {
    constructor({ projectId, name, category, delta, health }) {
        this.projectId = projectId;
        this.name      = name;
        this.category  = category;
        this.delta     = delta;
        this.health    = health;
    }

    get isPositive() {
        return this.delta >= 0;
    }

    get formattedDelta() {
        const sign = this.delta >= 0 ? '+' : '';
        return `${sign}${this.delta}%`;
    }
}
