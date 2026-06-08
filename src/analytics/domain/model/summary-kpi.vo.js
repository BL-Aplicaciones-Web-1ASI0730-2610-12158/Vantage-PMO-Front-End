/**
 * Value Object — Global dashboard KPI summary metrics.
 */
export class SummaryKpi {
    constructor({
                    unallocatedFunds,
                    unallocatedSubtext,
                    velocityIndex,
                    velocityChange,
                    riskExposure,
                    mitigationPlans,
                }) {
        this.unallocatedFunds    = unallocatedFunds;
        this.unallocatedSubtext  = unallocatedSubtext;
        this.velocityIndex       = velocityIndex;
        this.velocityChange      = velocityChange;
        this.riskExposure        = riskExposure;
        this.mitigationPlans     = mitigationPlans;
    }
}
