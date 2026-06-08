/**
 * Assembler for converting Workspace domain commands to API resources and vice-versa.
 */
export class WorkspaceAssembler {
    /**
     * Converts a SelectWorkspaceCommand to an API resource.
     * @param {import('../domain/model/select-workspace.command.js').SelectWorkspaceCommand} command - The command to convert.
     * @returns {Object} The API resource.
     */
    static toResourceFromSelectCommand(command) {
        return {
            userId: command.userId,
            selectedRole: command.selectedRole,
        };
    }

    /**
     * Converts an API response resource to a domain value (e.g., the selected role string).
     * @param {Object} resource - The API resource.
     * @returns {string|null} The selected role, or null if not found in the resource.
     */
    static toSelectedRoleFromResource(resource) {
        if (!resource) return null;

        const entry = Array.isArray(resource) ? resource[0] : resource;
        if (!entry) return null;

        return entry.selectedRole || null;
    }
}
