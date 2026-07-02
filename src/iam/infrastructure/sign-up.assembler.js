import { SignUpResource } from './sign-up.resource.js';

/**
 * Maps registration endpoint responses into IAM infrastructure resources.
 */
export class SignUpAssembler {
    /**
     * @param {Object} data - Created user object or auth confirmation message.
     * @returns {SignUpResource|null}
     */
    static toResourceFromResponse(data) {
        if (data?.id) {
            return new SignUpResource(data);
        }

        if (data?.message) {
            return new SignUpResource({ id: 0, username: 'registered', email: '' });
        }

        console.error('Sign-up failed: no user data returned');
        return null;
    }
}
