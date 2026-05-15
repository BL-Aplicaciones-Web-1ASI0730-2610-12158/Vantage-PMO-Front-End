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
}

export const projectsApi = new ProjectsApi();