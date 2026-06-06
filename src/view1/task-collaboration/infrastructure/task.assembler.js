import { Task } from '../domain/model/task.entity.js';

export class TaskAssembler {

    static toEntity(resource) {
        return new Task(resource);
    }

    static toEntities(resources) {
        return resources.map(TaskAssembler.toEntity);
    }
}