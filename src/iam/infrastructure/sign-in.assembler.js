import { SignInResource } from './sign-in.resource.js';

/**
 * Maps sign-in API responses into IAM infrastructure resources.
 */
export class SignInAssembler {
    /**
     * @param {Array<Object>|Object} data - Users array (GET /users) or JWT payload (POST /authentication/sign-in).
     * @returns {SignInResource|null}
     */
    static toResourceFromResponse(data) {
        if (Array.isArray(data)) {
            if (data.length === 0) {
                console.error('Sign-in failed: invalid credentials');
                return null;
            }
            const user = data[0];
            const token = btoa(`${user.username}:${user.id}:${Date.now()}`);
            return new SignInResource({ id: user.id, username: user.username, token });
        }

        if (data?.id && data?.username && data?.token) {
            return new SignInResource({
                id: data.id,
                username: data.username,
                token: data.token,
            });
        }

        console.error('Sign-in failed: unexpected response shape');
        return null;
    }
}
