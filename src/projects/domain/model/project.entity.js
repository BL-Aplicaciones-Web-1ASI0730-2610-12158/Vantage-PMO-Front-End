/**
 * Project Entity
 * Represents all relevant information about a project, including its status and progress.
 */
export class Project{
    constructor({
        id,
        name,
        description,
        progress,
        status,
        startDate,
        endDate,
        milestones
    }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.progress = progress;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.milestones = milestones || [];
    }
}