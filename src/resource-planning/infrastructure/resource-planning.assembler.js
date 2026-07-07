import { ResourcePlanningDashboard } from '../domain/model/resource-planning.entity.js';

export class ResourcePlanningAssembler {
    static toEntity(resource) {
        return new ResourcePlanningDashboard(resource);
    }

    static toEntities(resources) {
        return resources.map(ResourcePlanningAssembler.toEntity);
    }
}
