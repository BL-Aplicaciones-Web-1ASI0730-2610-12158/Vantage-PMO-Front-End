import {SignUpResource} from "./sign-up.resource.js";

/**
 * Maps registration endpoint responses into IAM infrastructure resources.
 *
 * @class SignUpAssembler
 */
export class SignUpAssembler {
    /**
     * @param {Object} data - Created user object returned by the registration endpoint.
     * @returns {SignUpResource|null} Parsed resource when the user was created; otherwise null.
     */
    static toResourceFromResponse(data) {
        if (!data || !data.id) {
            console.error('Sign-up failed: no user data returned');
            return null;
        }
        return new SignUpResource(data);
    }
}