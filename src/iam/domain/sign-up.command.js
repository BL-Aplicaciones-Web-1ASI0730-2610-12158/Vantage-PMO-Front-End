/**
 * Command used by the IAM application layer to register a new user.
 *
 * @class SignUpCommand
 */
export class SignUpCommand {
    /**
     * @param {Object} params - Command attributes.
     * @param {string} params.username - Desired username.
     * @param {string} params.email - User email address.
     * @param {string} params.password - Desired password.
     * @param {string} params.name - Full name.
     * @param {string} params.role - Job role / position.
     * @param {string} params.birthDate - Date of birth (YYYY-MM-DD).
     */
    constructor({username, email, password, name, role, birthDate}) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
        this.birthDate = birthDate;
    }
}