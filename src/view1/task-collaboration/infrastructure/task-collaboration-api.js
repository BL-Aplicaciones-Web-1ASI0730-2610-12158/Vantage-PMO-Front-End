import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { TaskAssembler } from './task.assembler.js';

class TaskCollaborationApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_TASK_COLLABORATION_ENDPOINT_PATH);
    }

    async getAllTasks() {
        const data = await super.getAll();
        return TaskAssembler.toEntities(data);
    }

    async getTasksByBoard(boardId) {
        const data = await super.getByQuery({ boardId });
        return TaskAssembler.toEntities(data);
    }

    async createTask(task) {
        const data = await super.create(task);
        return TaskAssembler.toEntity(data);
    }

    async updateTask(id, task) {
        const data = await super.update(id, task);
        return TaskAssembler.toEntity(data);
    }

    async deleteTask(id) {
        return super.delete(id);
    }
}

class BoardsApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_BOARDS_ENDPOINT_PATH);
    }
    getAll() { return super.getAll(); }
}

class BoardMembersApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_BOARD_MEMBERS_ENDPOINT_PATH);
    }
    getByBoard(boardId) { return super.getByQuery({ boardId }); }
}

export const taskCollaborationApi = new TaskCollaborationApi();
export const boardsApi            = new BoardsApi();
export const boardMembersApi      = new BoardMembersApi();
