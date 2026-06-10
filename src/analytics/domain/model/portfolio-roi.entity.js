/**
 * Entity — Portfolio ROI aggregate performance metrics.
 */
export class PortfolioRoi {
    constructor({ percentage, efficiencyLabel, target, projected }) {
        this.percentage       = percentage;
        this.efficiencyLabel  = efficiencyLabel;
        this.target           = target;
        this.projected        = projected;
    }
}
