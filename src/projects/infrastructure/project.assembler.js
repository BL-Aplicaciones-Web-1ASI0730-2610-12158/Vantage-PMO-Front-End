import {Project} from "../domain/model/project.entity.js";
import { normalizeCalendarDate } from "../../shared/infrastructure/calendar-date.js";

export class ProjectAssembler {
    static toEntity(resource) {
        const startDate = ProjectAssembler.normalizeDate(resource.startDate);
        const endDate = ProjectAssembler.normalizeDate(resource.endDate);
        const dueDate = ProjectAssembler.normalizeDate(resource.dueDate) || endDate;

        return new Project({
            id: resource.id,
            name: resource.name,
            category: resource.category || 'Infrastructure',
            description: resource.description || 'No description provided.',
            progress: resource.progress ?? Math.floor(Math.random() * 100),
            status: ProjectAssembler.normalizeStatus(resource.status),
            startDate,
            endDate,
            dueDate,
            milestones: (resource.milestones || []).map(milestone => ({
                ...milestone,
                date: ProjectAssembler.normalizeDate(milestone.date) ?? milestone.date,
            })),
            teamMembers: resource.teamMembers || [],
            manager: resource.manager,
            userId: resource.userId,
        });
    }

    static normalizeDate(value) {
        return normalizeCalendarDate(value) ?? (value || null);
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
