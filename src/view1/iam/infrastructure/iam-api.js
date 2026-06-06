import {BaseEndpoint} from "../../../shared/infrastructure/base-endpoint.js";
const signInEndpointPath = import.meta.env.VITE_SIGNIN_ENDPOINT_PATH;
const signUpEndpointPath = import.meta.env.VITE_SIGNUP_ENDPOINT_PATH;
const usersEndpointPath   = import.meta.env.VITE_USERS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for IAM bounded-context endpoints.
 *
 * @class IamApi
 */
export class IamApi {
    #signInEndpoint;
    #signUpEndpoint;
    #usersEndpoint;

    /** Creates endpoint clients for sign-in, sign-up, and user listing. */
    constructor() {
        this.#signInEndpoint = new BaseEndpoint(signInEndpointPath);
        this.#signUpEndpoint = new BaseEndpoint(signUpEndpointPath);
        this.#usersEndpoint = new BaseEndpoint(usersEndpointPath);
    }

    /**
     * Queries users matching the provided credentials.
     * Supports sign-in by username or by email address.
     * @param {import('../domain/sign-in.command.js').SignInCommand} signInRequest - Sign-in command.
     * @returns {Promise<Array<Object>>} Filtered users array from the server.
     */
    signIn(signInRequest) {
        const isEmail = signInRequest.username.includes('@');
        const query = isEmail
            ? { email: signInRequest.username, password: signInRequest.password }
            : { username: signInRequest.username, password: signInRequest.password };
        return this.#signInEndpoint.getByQuery(query);
    }

    /**
     * Sends a sign-up command to the registration endpoint.
     * @param {import('../domain/sign-up.command.js').SignUpCommand} signUpRequest - Sign-up command.
     * @returns {Promise<Object>} Created user object.
     */
    signUp(signUpRequest) {
        return this.#signUpEndpoint.create(signUpRequest);
    }

    /**
     * Finds a user by email address for account recovery.
     * @param {string} email - Email to search.
     * @returns {Promise<Array<Object>>} Matching users array.
     */
    findUserByEmail(email) {
        return this.#usersEndpoint.getByQuery({ email });
    }

    /**
     * Partially updates a user's password by ID (PATCH — preserves all other fields).
     * @param {number} userId - The user's ID.
     * @param {string} newPassword - New plain-text password.
     * @returns {Promise<Object>} Updated user object.
     */
    updatePassword(userId, newPassword) {
        return this.#usersEndpoint.patch(userId, { password: newPassword });
    }

    /**
     * Retrieves users visible to the IAM context.
     * @returns {Promise<Array<Object>|Object>} User resources.
     */
    getUsers() {
        return this.#usersEndpoint.getAll();
    }
}

