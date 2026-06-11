import { RiskReport } from '../domain/model/risk-report.entity.js';

export class RiskComplianceAssembler {
    static toEntity(resource) {
        return new RiskReport({
            id: resource.id,
            title: resource.title,
            riskLevel: resource.riskLevel,
            status: resource.status
        });
    }
}