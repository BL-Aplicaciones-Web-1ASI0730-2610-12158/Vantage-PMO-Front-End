/**
 * Risk Entity — Risk & Compliance bounded context.
 * Represents a single identified risk item with its classification,
 * audit trail and action-plan linkage.
 */
export class Risk {
    constructor({
        id, riskId, description, severity,
        likelihood, impact, status,
        auditTrail, auditDate, flaggedBy,
        daysOpen, hasActionPlan, segment, controlLog
    }) {
        this.id           = id;
        this.riskId       = riskId;
        this.description  = description;
        this.severity     = severity;    // CRITICAL | HIGH | MEDIUM | LOW
        this.likelihood   = likelihood;  // REMOTE | UNLIKELY | POSSIBLE | PROBABLE | CERTAIN
        this.impact       = impact;      // HIGH | MEDIUM | LOW
        this.status       = status;      // open | monitoring | resolved
        this.auditTrail   = auditTrail;
        this.auditDate    = auditDate;
        this.flaggedBy    = flaggedBy;
        this.daysOpen     = daysOpen;
        this.hasActionPlan = hasActionPlan;
        this.segment      = segment;
        this.controlLog   = controlLog;
    }

    get isCritical() { return this.severity === 'CRITICAL'; }
    get isHigh()     { return this.severity === 'HIGH'; }
    get isOpen()     { return this.status === 'open'; }
}

