import { SignUpCommand } from './sign-up.command.js';
import { resolveViewTypeFromWorkspace } from '../../workspace/domain/model/workspace-type.js';

/**
 * Command used by the IAM application layer to register a new user
 * and persist their workspace selection in a single use case.
 *
 * @class RegisterAccountCommand
 */
export class RegisterAccountCommand {
    /**
     * @param {Object} params - Command attributes.
     * @param {string} params.username - Desired username.
     * @param {string} params.email - User email address.
     * @param {string} params.password - Desired password.
     * @param {string} params.name - Full name.
     * @param {string} params.role - Job role / position.
     * @param {string} params.birthDate - Date of birth (YYYY-MM-DD).
     * @param {string} params.workspaceType - Selected workspace type (e.g. 'PROJECT_LEADER').
     */
    constructor({ username, email, password, name, role, birthDate, workspaceType }) {
        this.workspaceType = workspaceType;
        this.viewType = resolveViewTypeFromWorkspace(workspaceType);
        this.signUp = new SignUpCommand({
            username,
            email,
            password,
            name,
            role,
            birthDate,
            viewType: this.viewType,
        });
    }
}
