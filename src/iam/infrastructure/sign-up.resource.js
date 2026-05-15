/**
 * Infrastructure resource returned after user registration.
 *
 * @class SignUpResource
 */
export class SignUpResource {
    /**
     * @param {Object} params - Resource payload (created user object).
     * @param {number} params.id - Newly created user identifier.
     * @param {string} params.username - Registered username.
     * @param {string} [params.email] - Registered email address.
     */
    constructor({id, username, email}) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
}