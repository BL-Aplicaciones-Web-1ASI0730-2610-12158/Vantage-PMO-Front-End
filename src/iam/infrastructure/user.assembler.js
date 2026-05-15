import {User} from "../domain/user.entity.js";

/**
 * Maps IAM infrastructure resources into domain entities.
 *
 * @class UserAssembler
 */
export class UserAssembler {
    /**
     * @param {Object} resource - User resource payload.
     * @returns {User} User entity.
     */
    static toEntityFromResource(resource) {
        return new User({...resource});
    }

    /**
     * @param {Array<Object>|Object} data - Raw data returned by the users endpoint.
     * @returns {User[]} Collection of user entities.
     */
    static toEntitiesFromResponse(data) {
        if (!data) {
            console.error('No user data received');
            return [];
        }
        const resources = Array.isArray(data) ? data : (data['users'] ?? []);
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}