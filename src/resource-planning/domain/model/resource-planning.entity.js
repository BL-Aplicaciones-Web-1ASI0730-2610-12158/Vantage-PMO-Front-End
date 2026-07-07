import { PlanningSummary } from './planning-summary.vo.js';
import { DepartmentUtilization } from './department-utilization.vo.js';
import { ResourceAllocation } from './resource-allocation.entity.js';
import { CapacityGap } from './capacity-gap.vo.js';

/**
 * Aggregate root — Resource Planning dashboard.
 */
export class ResourcePlanningDashboard {
    constructor({
        id,
        period = '',
        summaryKpis,
        departmentCapacity = [],
        allocations = [],
        capacityGaps = [],
    }) {
        this.id = id;
        this.period = period;
        this.summaryKpis = summaryKpis instanceof PlanningSummary
            ? summaryKpis
            : new PlanningSummary(summaryKpis ?? {});
        this.departmentCapacity = departmentCapacity.map(d =>
            d instanceof DepartmentUtilization ? d : new DepartmentUtilization(d)
        );
        this.allocations = allocations.map(a =>
            a instanceof ResourceAllocation ? a : new ResourceAllocation(a)
        );
        this.capacityGaps = capacityGaps.map(g =>
            g instanceof CapacityGap ? g : new CapacityGap(g)
        );
    }
}
