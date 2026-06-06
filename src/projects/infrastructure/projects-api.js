import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";
import {ProjectAssembler} from "./project.assembler.js";

class ProjectsApi extends BaseEndpoint{
    constructor(){
        super(import.meta.env.VITE_PROJECTS_ENDPOINT_PATH);
    }
    async getAllProjects() {
        const data = await super.getAll();
        return ProjectAssembler.toEntities(data);
    }

    async createProject(projectData) {
        const data = await super.create(projectData);
        return ProjectAssembler.toEntity(data);
    }

    async updateProject(id, projectData) {
        const data = await super.update(id, projectData);
        return ProjectAssembler.toEntity(data);
    }
}

export const projectsApi = new ProjectsApi();