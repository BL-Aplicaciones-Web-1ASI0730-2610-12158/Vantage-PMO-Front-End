import {SignInResource} from "./sign-in.resource.js";

/**
 * Maps authentication query results into IAM infrastructure resources.
 *
 * @class SignInAssembler
 */
export class SignInAssembler {
    /**
     * @param {Array<Object>} data - Array of users returned by the credentials query.
     * @returns {SignInResource|null} Parsed resource when credentials match; otherwise null.
     */
    static toResourceFromResponse(data) {
        if (!Array.isArray(data) || data.length === 0) {
            console.error('Sign-in failed: invalid credentials');
            return null;
        }
        const user = data[0];
        const token = btoa(`${user.username}:${user.id}:${Date.now()}`);

        return new SignInResource({
            id: user.id,
            username: user.username,
            email: user.email,
            token,
            viewType: user.viewType
        });
    }
}