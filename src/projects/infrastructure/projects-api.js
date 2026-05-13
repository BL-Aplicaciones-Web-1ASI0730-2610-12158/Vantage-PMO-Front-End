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
    async createProject(project) {
        const data = await super.create(project);
        return ProjectAssembler.toEntity(data);
    }
    async updateProject(id, project) {
        const data = await super.update(id, project);
        return ProjectAssembler.toEntity(data);
    }
}

export const projectsApi = new ProjectsApi();