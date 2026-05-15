/**
 * Project Entity
 * Represents all relevant information about a project, including its status and progress.
 */
export class Project{
    constructor({
        id,
        name,
        category,
        description,
        progress,
        status,
        startDate,
        endDate,
        milestones,
        teamMembers,
        manager
    }) {
        this.id = id;
        this.name = name;
        this.category = category || 'General';
        this.description = description;
        this.progress = progress;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.milestones = milestones || [];
        this.teamMembers = teamMembers || [];
        this.manager = manager;
    }
}