/**
 * Task Entity
 * Represents a collaborative task in the system.
 */
export class Task {

    constructor({
                    id,
                    title,
                    description,
                    assignee,
                    status,
                    priority,
                    completed
                }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.assignee = assignee;
        this.status = status;
        this.priority = priority;
        this.completed = completed;
    }
}