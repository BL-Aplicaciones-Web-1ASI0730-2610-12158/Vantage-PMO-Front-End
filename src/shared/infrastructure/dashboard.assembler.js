import { Task } from '../domain/model/task.entity.js';
import { ScheduleItem } from '../domain/model/schedule-item.entity.js';
import { Department } from '../domain/model/department.entity.js';

export class TaskAssembler {
    static toEntity(r)    { return new Task(r); }
    static toEntities(rs) { return rs.map(TaskAssembler.toEntity); }
}

export class ScheduleAssembler {
    static toEntity(r)    { return new ScheduleItem(r); }
    static toEntities(rs) { return rs.map(ScheduleAssembler.toEntity); }
}

export class DepartmentAssembler {
    static toEntity(r)    { return new Department(r); }
    static toEntities(rs) { return rs.map(DepartmentAssembler.toEntity); }
}
