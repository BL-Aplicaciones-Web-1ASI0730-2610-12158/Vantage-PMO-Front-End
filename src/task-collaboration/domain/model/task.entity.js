/**
 * Task Entity — Team Board task.
 */
export class Task {
    constructor({ id, boardId, project, title, description, assignee,
                  assigneeAvatar, assigneeColor, status, priority, priorityColor,
                  completed, comments, attachments, dueDate, progress, department }) {
        this.id             = id;
        this.boardId        = boardId        ?? 1;
        this.project        = project        ?? '';
        this.title          = title          ?? '';
        this.description    = description    ?? '';
        this.assignee       = assignee       ?? '';
        this.assigneeAvatar = assigneeAvatar ?? (assignee ? assignee.charAt(0) : '?');
        this.assigneeColor  = assigneeColor  ?? '#6b7280';
        this.status         = status         ?? 'To Do';
        this.priority       = priority       ?? 'NORMAL';
        this.priorityColor  = priorityColor  ?? '#6b7280';
        this.completed      = completed      ?? false;
        this.comments       = comments       ?? 0;
        this.attachments    = attachments    ?? 0;
        this.dueDate        = dueDate        ?? '';
        this.progress       = progress       ?? 0;
        this.department     = department     ?? '';
    }
}