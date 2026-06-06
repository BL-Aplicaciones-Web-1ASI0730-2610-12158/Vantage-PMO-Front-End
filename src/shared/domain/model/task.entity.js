/**
 * Task Entity - Domain Model
 */
export class Task {
    constructor({ id, title, assignee, department, priority, icon, iconBg, avatarSeeds }) {
        this.id          = id;
        this.title       = title;
        this.assignee    = assignee;
        this.department  = department;
        this.priority    = priority;
        this.icon        = icon;
        this.iconBg      = iconBg;
        this.avatarSeeds = avatarSeeds ?? [];
    }

    get isCritical() {
        return this.priority === 'CRITICAL';
    }
}
