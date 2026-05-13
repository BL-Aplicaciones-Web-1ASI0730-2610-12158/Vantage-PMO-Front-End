import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { TaskAssembler } from './task.assembler.js';

class TaskCollaborationApi extends BaseEndpoint {

    constructor() {
        super(
            import.meta.env
                .VITE_TASK_COLLABORATION_ENDPOINT_PATH
        );
    }

    async getAllTasks() {
        const data = await super.getAll();
        return TaskAssembler.toEntities(data);
    }

    async updateTask(id, task) {
        const data = await super.update(id, task);
        return TaskAssembler.toEntity(data);
    }
}

export const taskCollaborationApi = new TaskCollaborationApi();