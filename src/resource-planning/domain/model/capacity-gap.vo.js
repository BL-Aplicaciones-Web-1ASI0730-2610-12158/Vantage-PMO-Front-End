export class CapacityGap {
    constructor({
        id,
        project = '',
        role = '',
        gapDate = '',
        headcount = 0,
        severity = 'medium',
    } = {}) {
        this.id        = id;
        this.project   = project;
        this.role      = role;
        this.gapDate   = gapDate;
        this.headcount = headcount;
        this.severity  = severity;
    }
}
