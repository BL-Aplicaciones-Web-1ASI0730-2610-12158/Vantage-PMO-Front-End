import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { AnalyticsAssembler } from './analytics.assembler.js';

class AnalyticsApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_ANALYTICS_ENDPOINT_PATH);
    }

    async getDashboard() {
        const data = await super.getAll();
        const entities = AnalyticsAssembler.toEntities(data);
        return entities[0] ?? null;
    }
}

export const analyticsApi = new AnalyticsApi();
