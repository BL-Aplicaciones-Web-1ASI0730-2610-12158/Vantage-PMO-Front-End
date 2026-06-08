/**
 * Command to select a user's workspace or role.
 */
export class SelectWorkspaceCommand {
    /**
     * @param {number} userId - The ID of the user making the selection.
     * @param {string} selectedRole - The role/workspace type selected (e.g., 'PROJECT_LEADER', 'ENTERPRISE_OWNER').
     */
    constructor(userId, selectedRole) {
        this.userId = userId;
        this.selectedRole = selectedRole;
    }
}