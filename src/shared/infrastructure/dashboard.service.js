import { BaseEndpoint } from './base-endpoint.js';

class TasksService extends BaseEndpoint {
    constructor() { super(import.meta.env.VITE_TASKS_ENDPOINT_PATH); }
}

class ScheduleService extends BaseEndpoint {
    constructor() { super(import.meta.env.VITE_SCHEDULE_ENDPOINT_PATH); }
}

class DepartmentsService extends BaseEndpoint {
    constructor() { super(import.meta.env.VITE_DEPARTMENTS_ENDPOINT_PATH); }
}

class StatsService extends BaseEndpoint {
    constructor() { super(import.meta.env.VITE_STATS_ENDPOINT_PATH); }
}

export const tasksService       = new TasksService();
export const scheduleService    = new ScheduleService();
export const departmentsService = new DepartmentsService();
export const statsService       = new StatsService();
