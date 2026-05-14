/**
 * SupportTicket Entity
 * Represents a support request raised by a user.
 */
export class SupportTicket {
    constructor({ id, title, description, category, priority, status, createdAt, assignee }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.status = status;
        this.createdAt = createdAt;
        this.assignee = assignee;
    }
}
