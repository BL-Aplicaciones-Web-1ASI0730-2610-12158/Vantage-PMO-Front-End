/**
 * IAM user aggregate root representation used by the client domain model.
 *
 * @class User
 */
export class User {
    /**
     * @param {Object} params - Entity attributes.
     * @param {string|number} params.id - Unique user identifier.
     * @param {string} params.username - Public username.
     * @param {string} params.viewType - The view configuration for the user.
     */
    constructor({id, username, viewType}) {
        this.id = id;
        this.username = username;
        this.viewType = viewType;
    }
}