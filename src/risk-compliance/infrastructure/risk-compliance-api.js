import { BaseApi } from '../../shared/infrastructure/base-api.js';

export class RiskComplianceApi extends BaseApi {
    async getReports() {
        return this.get('/risk-reports');
    }
}
export const riskComplianceApi = new RiskComplianceApi();