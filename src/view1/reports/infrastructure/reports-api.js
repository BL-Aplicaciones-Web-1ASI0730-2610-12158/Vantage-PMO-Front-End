import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { ReportAssembler } from './report.assembler.js';

class ReportsApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_REPORTS_ENDPOINT_PATH);
    }

    async getAllReports() {
        const data = await super.getAll();
        return ReportAssembler.toEntities(data);
    }
}

export const reportsApi = new ReportsApi();