import type { ProjectManagement } from '../domain/model/project-management.types';

export class ProjectManagementAssembler {
    static toEntity(resource: any): ProjectManagement {
        return {
            id: resource.id,
            name: resource.name ?? '',
            client: resource.client ?? '',
            description: resource.description ?? '',
            category: resource.category ?? 'General',
            startDate: resource.startDate ?? '',
            endDate: resource.endDate ?? '',
            status: resource.status ?? 'planned',
            progress: resource.progress ?? 0,
            budget: resource.budget ?? 0,
            milestones: Array.isArray(resource.milestones) ? resource.milestones.map((milestone: any) => ({
                id: milestone.id,
                title: milestone.title ?? '',
                dueDate: milestone.dueDate ?? '',
                status: milestone.status ?? 'pending',
                budgetImpact: milestone.budgetImpact ?? 0,
                dependencies: milestone.dependencies ?? [],
                responsible: milestone.responsible ?? '',
            })) : [],
            dependencies: Array.isArray(resource.dependencies) ? resource.dependencies : [],
            createdAt: resource.createdAt ?? new Date().toISOString(),
            updatedAt: resource.updatedAt ?? new Date().toISOString(),
        };
    }

    static toEntities(resources: any[]): ProjectManagement[] {
        return resources.map(ProjectManagementAssembler.toEntity);
    }
}
