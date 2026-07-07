import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { ResourcePlanningAssembler } from './resource-planning.assembler.js';

class ResourcePlanningApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_RESOURCE_PLANNING_ENDPOINT_PATH);
    }

    async getDashboard() {
        const data = await super.getAll();
        const entities = ResourcePlanningAssembler.toEntities(data);
        return entities[0] ?? null;
    }
}

export const resourcePlanningApi = new ResourcePlanningApi();
