/**
 * RiskMatrix Entity — Risk & Compliance bounded context.
 * Encapsulates the 5×3 compliance heatmap for a given infrastructure segment.
 */
export class RiskMatrix {
    constructor({ id, segment, environment, heatmapCells }) {
        this.id           = id;
        this.segment      = segment;
        this.environment  = environment;
        this.heatmapCells = heatmapCells; // Array<{ impact, likelihood, value, level }>
    }

    /** Returns all cells for a given impact row */
    cellsByImpact(impact) {
        return this.heatmapCells.filter(c => c.impact === impact);
    }
}

