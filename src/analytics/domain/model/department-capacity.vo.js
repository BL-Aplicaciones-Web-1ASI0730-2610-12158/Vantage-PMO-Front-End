import { resolveCapacityStatus } from './capacity-status.js';

/**
 * Value Object — Human capital allocation for a department.
 */
export class DepartmentCapacity {
    constructor({ department, capacity, status }) {
        this.department = department;
        this.capacity   = capacity;
        this.status     = status ?? resolveCapacityStatus(capacity);
    }
}
