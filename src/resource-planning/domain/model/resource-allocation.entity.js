import { ProjectAllocation } from './project-allocation.vo.js';

export class ResourceAllocation {
    constructor({
        id,
        resourceName = '',
        role = '',
        department = '',
        avatar = '',
        avatarColor = '#6b7280',
        projects = [],
        totalAllocation = 0,
        status = 'optimal',
    } = {}) {
        this.id              = id;
        this.resourceName    = resourceName;
        this.role            = role;
        this.department      = department;
        this.avatar          = avatar;
        this.avatarColor     = avatarColor;
        this.projects        = projects.map(p =>
            p instanceof ProjectAllocation ? p : new ProjectAllocation(p)
        );
        this.totalAllocation = totalAllocation;
        this.status          = status;
    }
}
