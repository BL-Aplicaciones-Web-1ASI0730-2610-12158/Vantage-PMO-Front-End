/**
 * Infrastructure resource returned by the authentication endpoint.
 *
 * @class SignInResource
 */
export class SignInResource {
    /**
     * @param {Object} params - Resource payload.
     * @param {string|number} params.id - Authenticated user identifier.
     * @param {string} params.username - Authenticated username.
     * @param {string} params.token - Bearer token.
     * @param {string} params.viewType - The view configuration for the user.
     */
    constructor({id, username, email, token, viewType}) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.token = token;
        this.viewType = viewType;
    }
}