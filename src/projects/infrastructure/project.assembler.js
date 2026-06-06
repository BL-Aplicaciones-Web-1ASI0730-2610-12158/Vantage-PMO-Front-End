import {Project} from "../domain/model/project.entity.js";

export class ProjectAssembler {
    static toEntity(resource) {
        return new Project({
            id: resource.id,
            name: resource.name,
            category: resource.category || 'Infrastructure',
            description: resource.description || 'No description provided.',
            progress: resource.progress ?? Math.floor(Math.random() * 100),
            status: ProjectAssembler.normalizeStatus(resource.status),
            startDate: resource.startDate,
            endDate: resource.endDate,
            milestones: resource.milestones || [],
            teamMembers: resource.teamMembers || [],
            manager: resource.manager
        });
    }

    static normalizeStatus(status) {
        if (!status) return 'healthy';
        const s = status.toLowerCase();
        if (s === 'critical') return 'critical';
        if (s === 'healthy') return 'healthy';
        if (s === 'warning' || s === 'at risk' || s === 'at-risk') return 'at-risk';
        return 'healthy';
    }

    static toEntities(resources) {
        return resources.map(ProjectAssembler.toEntity);
    }
}