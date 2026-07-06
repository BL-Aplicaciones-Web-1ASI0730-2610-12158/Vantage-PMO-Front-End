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
        dueDate,
        milestones,
        teamMembers,
        manager,
        userId,
    }) {
        this.id = id;
        this.name = name;
        this.category = category || 'General';
        this.description = description;
        this.progress = progress;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.dueDate = dueDate;
        this.milestones = milestones || [];
        this.teamMembers = teamMembers || [];
        this.manager = manager;
        this.userId = userId;
    }
}