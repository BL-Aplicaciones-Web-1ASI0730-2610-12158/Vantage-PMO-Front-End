export class PlanningSummary {
    constructor({ totalResources = 0, avgUtilization = 0, overAllocated = 0, benchAvailable = 0 } = {}) {
        this.totalResources  = totalResources;
        this.avgUtilization  = avgUtilization;
        this.overAllocated   = overAllocated;
        this.benchAvailable  = benchAvailable;
    }
}
