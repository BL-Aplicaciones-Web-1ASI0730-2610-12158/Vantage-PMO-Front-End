import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { ProjectManagementAssembler } from './project-management.assembler.js';

class ProjectManagementApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_PROJECTS_ENDPOINT_PATH);
    }

    async getAll() {
        const data = await super.getAll();
        return ProjectManagementAssembler.toEntities(data);
    }

    async create(project) {
        const data = await super.create(project);
        return ProjectManagementAssembler.toEntity(data);
    }

    async update(id, project) {
        const data = await super.update(id, project);
        return ProjectManagementAssembler.toEntity(data);
    }

    async deleteProject(id) {
        return super.delete(id);
    }
}

export const projectManagementApi = new ProjectManagementApi();
