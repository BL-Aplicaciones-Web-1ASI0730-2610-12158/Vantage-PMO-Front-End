/**
 * ComplianceMetrics Entity — Risk & Compliance bounded context.
 * Holds the integrity pulse score, compliance posture KPIs
 * and system integrity alert log.
 */
export class ComplianceMetrics {
    constructor({
        id, integrityPulse, integrityDelta,
        docCompliance, slaCompliance,
        systemIntegrityAlerts
    }) {
        this.id                    = id;
        this.integrityPulse        = integrityPulse;        // e.g. 98.4
        this.integrityDelta        = integrityDelta;        // e.g. 0.2
        this.docCompliance         = docCompliance;         // e.g. 94
        this.slaCompliance         = slaCompliance;         // e.g. 100
        this.systemIntegrityAlerts = systemIntegrityAlerts; // Array<IntegrityAlert>
    }

    get formattedDelta() {
        return this.integrityDelta >= 0
            ? `+${this.integrityDelta}`
            : `${this.integrityDelta}`;
    }
}

