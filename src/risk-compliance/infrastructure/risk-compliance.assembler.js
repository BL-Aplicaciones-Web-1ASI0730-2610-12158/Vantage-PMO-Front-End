import { Risk }               from '../domain/model/risk.entity.js';
import { RiskMatrix }         from '../domain/model/risk-matrix.entity.js';
import { ComplianceMetrics }  from '../domain/model/compliance-metrics.entity.js';

export class RiskComplianceAssembler {

    static toRisk(resource) {
        return new Risk({
            id:            resource.id,
            riskId:        resource.riskId,
            description:   resource.description,
            severity:      resource.severity,
            likelihood:    resource.likelihood,
            impact:        resource.impact,
            status:        resource.status,
            auditTrail:    resource.auditTrail,
            auditDate:     resource.auditDate,
            flaggedBy:     resource.flaggedBy,
            daysOpen:      resource.daysOpen,
            hasActionPlan: resource.hasActionPlan,
            segment:       resource.segment,
            controlLog:    resource.controlLog,
        });
    }

    static toRiskMatrix(resource) {
        return new RiskMatrix({
            id:           resource.id,
            segment:      resource.segment,
            environment:  resource.environment,
            heatmapCells: resource.heatmapCells ?? [],
        });
    }

    static toComplianceMetrics(resource) {
        return new ComplianceMetrics({
            id:                    resource.id,
            integrityPulse:        resource.integrityPulse,
            integrityDelta:        resource.integrityDelta,
            docCompliance:         resource.docCompliance,
            slaCompliance:         resource.slaCompliance,
            systemIntegrityAlerts: resource.systemIntegrityAlerts ?? [],
        });
    }
}