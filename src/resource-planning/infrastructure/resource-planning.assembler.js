import { ResourcePlan } from '../domain/model/resource-plan.entity';

export const ResourcePlanningAssembler = {
    toDomain(data) {
        return new ResourcePlan(data.id, data.name, data.allocation, data.status);
    }
};