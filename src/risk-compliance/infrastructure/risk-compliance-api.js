import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { RiskComplianceAssembler } from './risk-compliance.assembler.js';

class RiskComplianceApi {
    constructor() {
        this._risksEndpoint   = new BaseEndpoint(import.meta.env.VITE_RISKS_ENDPOINT_PATH);
        this._matrixEndpoint  = new BaseEndpoint(import.meta.env.VITE_RISK_MATRIX_ENDPOINT_PATH);
        this._metricsEndpoint = new BaseEndpoint(import.meta.env.VITE_COMPLIANCE_METRICS_ENDPOINT_PATH);
    }

    async getRisks() {
        const data = await this._risksEndpoint.getAll();
        return data.map(RiskComplianceAssembler.toRisk);
    }

    async getRiskMatrix() {
        const data = await this._matrixEndpoint.getAll();
        return RiskComplianceAssembler.toRiskMatrix(data[0]);
    }

    async getComplianceMetrics() {
        const data = await this._metricsEndpoint.getAll();
        return RiskComplianceAssembler.toComplianceMetrics(data[0]);
    }
}

export const riskComplianceApi = new RiskComplianceApi();