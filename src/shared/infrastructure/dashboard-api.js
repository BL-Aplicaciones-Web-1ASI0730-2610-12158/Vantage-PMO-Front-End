import { BaseEndpoint } from './base-endpoint.js';
import { TaskAssembler, ScheduleAssembler, DepartmentAssembler } from './dashboard.assembler.js';
import { StatsAssembler } from '../../profile/infrastructure/stats.assembler.js';

/**
 * Dashboard API
 * Infrastructure service for dashboard data.
 * Each inner class extends BaseEndpoint for its own resource.
 */
class TasksApi extends BaseEndpoint {
    constructor() { super(import.meta.env.VITE_TASKS_ENDPOINT_PATH); }
    async getAll(context = 'user') {
        const data = await super.getAll();
        if (context === 'portfolio') {
            return TaskAssembler.toEntities(data);
        }
        return TaskAssembler.toEntities(data);
    }
}

class ScheduleApi extends BaseEndpoint {
    constructor() { super(import.meta.env.VITE_SCHEDULE_ENDPOINT_PATH); }
    async getAll(context = 'user') {
        const data = await super.getAll();
        if (context === 'portfolio') {
            return ScheduleAssembler.toEntities(data);
        }
        return ScheduleAssembler.toEntities(data);
    }
}

class DepartmentsApi extends BaseEndpoint {
    constructor() { super(import.meta.env.VITE_DEPARTMENTS_ENDPOINT_PATH); }
    async getAll(context = 'user') {
        const data = await super.getAll();
        return DepartmentAssembler.toEntities(data);
    }
}

class StatsApi extends BaseEndpoint {
    constructor() { super(import.meta.env.VITE_STATS_ENDPOINT_PATH); }
    async getFirst(context = 'user') {
        const data = await super.getAll();

        if (context === 'portfolio' && data && data.length > 1) {
            return StatsAssembler.toEntity(data[1]);
        }

        return StatsAssembler.toEntity(data[0]);
    }
}

export const tasksApi       = new TasksApi();
export const scheduleApi    = new ScheduleApi();
export const departmentsApi = new DepartmentsApi();
export const statsApi       = new StatsApi();