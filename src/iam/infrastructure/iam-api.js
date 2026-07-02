import baseApi from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const signInEndpointPath = import.meta.env.VITE_SIGNIN_ENDPOINT_PATH;
const signUpEndpointPath = import.meta.env.VITE_SIGNUP_ENDPOINT_PATH;
const usersEndpointPath = import.meta.env.VITE_USERS_ENDPOINT_PATH;

const isAuthenticationPath = (path) => String(path ?? '').includes('authentication');

/**
 * Infrastructure gateway for IAM bounded-context endpoints.
 */
export class IamApi {
    #signUpEndpoint;
    #usersEndpoint;

    constructor() {
        this.#signUpEndpoint = new BaseEndpoint(signUpEndpointPath);
        this.#usersEndpoint = new BaseEndpoint(usersEndpointPath);
    }

    /**
     * Sign-in via GET /users?username=&password= (dev/json-server)
     * or POST /authentication/sign-in (production JWT).
     */
    signIn(signInRequest) {
        if (isAuthenticationPath(signInEndpointPath)) {
            return baseApi
                .post(signInEndpointPath.replace(/^\//, ''), {
                    username: signInRequest.username,
                    password: signInRequest.password,
                })
                .then((res) => res.data);
        }

        const isEmail = signInRequest.username.includes('@');
        const query = isEmail
            ? { email: signInRequest.username, password: signInRequest.password }
            : { username: signInRequest.username, password: signInRequest.password };

        return this.#usersEndpoint.getByQuery(query);
    }

    /**
     * Sign-up via POST /users (front contract) or POST /authentication/sign-up.
     */
    signUp(signUpRequest) {
        if (isAuthenticationPath(signUpEndpointPath)) {
            return baseApi
                .post(signUpEndpointPath.replace(/^\//, ''), {
                    fullName: signUpRequest.name,
                    username: signUpRequest.username,
                    role: signUpRequest.role,
                    dateOfBirth: signUpRequest.birthDate,
                    email: signUpRequest.email,
                    password: signUpRequest.password,
                    confirmPassword: signUpRequest.password,
                })
                .then((res) => res.data);
        }

        return this.#signUpEndpoint.create(signUpRequest);
    }

    findUserByEmail(email) {
        return this.#usersEndpoint.getByQuery({ email });
    }

    updatePassword(userId, newPassword) {
        return this.#usersEndpoint.patch(userId, { password: newPassword });
    }

    getUsers() {
        return this.#usersEndpoint.getAll();
    }
}
