import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";
import { WorkspaceAssembler } from "./workspace.assembler.js";
import { SelectWorkspaceCommand } from "../domain/model/select-workspace.command.js";

class WorkspaceApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_WORKSPACE_SELECTION_ENDPOINT_PATH);
    }

    /**
     * Saves the user's selected workspace/role to the backend.
     * @param {SelectWorkspaceCommand} command - The command containing selection data.
     * @returns {Promise<string|null>} The selected role/workspace type (e.g., 'PROJECT_LEADER'), or null if not set.
     */
    async saveWorkspaceSelection(command) {
        const resource = WorkspaceAssembler.toResourceFromSelectCommand(command);
        const responseData = await super.create(resource); // Usa super.create y pasa el recurso
        return WorkspaceAssembler.toSelectedRoleFromResource(responseData);
    }

    /**
     * Fetches the user's current workspace/role selection from the backend.
     * @param {number} userId - The ID of the user.
     * @returns {Promise<string|null>} The selected role/workspace type (e.g., 'PROJECT_LEADER'), or null if not set.
     */
    async getWorkspaceSelection(userId) {
        try {
            const responseData = await super.getByQuery({ userId });
            return WorkspaceAssembler.toSelectedRoleFromResource(responseData);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    }
}

export const workspaceApi = new WorkspaceApi();
