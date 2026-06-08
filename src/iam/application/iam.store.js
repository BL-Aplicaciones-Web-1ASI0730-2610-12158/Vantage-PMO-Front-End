import {IamApi} from "../infrastructure/iam-api.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {SignInAssembler} from "../infrastructure/sign-in.assembler.js";
import {UserAssembler} from "../infrastructure/user.assembler.js";
import {SignUpAssembler} from "../infrastructure/sign-up.assembler.js";
import {RegisterAccountCommand} from "../domain/register-account.command.js";
import { useWorkspaceStore } from "../../workspace/application/workspace.store.js"

const iamApi = new IamApi();
/**
 * Application service store for the IAM bounded context.
 * It coordinates authentication commands and exposes UI-facing auth state.
 *
 * @returns {Object} Store state and actions.
 */
const useIamStore = defineStore('iam', () => {
    /** @type {import('vue').Ref<Array<User>>} Array of user entities. */
    const users = ref([]);
    /** @type {import('vue').Ref<Array<Error>>} Array of error messages. */
    const errors = ref([]);
    /** @type {import('vue').Ref<boolean>} Flag indicating if users have been loaded. */
    const usersLoaded = ref(false);
    /** @type {import('vue').Ref<boolean>} Flag indicating if a user is signed in. */
    const isSignedIn = ref(false);
    /** @type {import('vue').Ref<string|null>} Username of the currently authenticated user, or null when signed out. */
    const currentUsername = ref(null);
    /** @type {import('vue').Ref<number>} Identifier of the currently authenticated user, or 0 when signed out. */
    const currentUserId = ref(0);
    /** @type {import('vue').ComputedRef<string|null>} Bearer token for the active session, or null when signed out. */
    const currentToken = computed(() => isSignedIn.value ? localStorage.getItem('token') : null);

    /**
     * Executes the sign-in use case and updates authentication state.
     * @param {SignInCommand} signInCommand - Sign-in command.
     * @param {import('vue-router').Router} router - Router used to redirect on result.
     * @returns {void}
     */
    function signIn(signInCommand, router) {
        console.log(signInCommand);
        return iamApi.signIn(signInCommand)
            .then(response => {
                let signInResource = SignInAssembler.toResourceFromResponse(response);
                if (signInResource) {
                    let currentUser = UserAssembler.toEntityFromResource(signInResource);
                    currentUsername.value = currentUser.username;
                    currentUserId.value = currentUser.id;
                    localStorage.setItem('token', signInResource.token);
                    isSignedIn.value = true;
                    console.log(`User signed in: ${currentUsername.value}`);
                    errors.value = [];
                    const workspaceStore = useWorkspaceStore();
                    workspaceStore.loadUserWorkspace();
                    router.push({name: 'home'});
                    return true;
                } else {
                    isSignedIn.value = false;
                    errors.value.push(new Error('Sign-in failed'));
                    return false;
                }
            })
            .catch(error => {
                isSignedIn.value = false;
                console.log(error);
                errors.value.push(error);
                return false;
            });
    }

    /**
     * Registers a new account, signs the user in, and persists workspace selection.
     * @param {RegisterAccountCommand} registerCommand - Registration command with workspace.
     * @param {import('vue-router').Router} router - Router used to redirect on result.
     * @returns {Promise<boolean>} True when registration completes successfully.
     */
    async function registerAccount(registerCommand, router) {
        try {
            const response = await iamApi.signUp(registerCommand.signUp);
            const signUpResource = SignUpAssembler.toResourceFromResponse(response);

            if (!signUpResource) {
                errors.value.push(new Error('Registration failed'));
                return false;
            }

            const token = btoa(`${signUpResource.username}:${signUpResource.id}:${Date.now()}`);
            currentUsername.value = signUpResource.username;
            currentUserId.value = signUpResource.id;
            localStorage.setItem('token', token);
            isSignedIn.value = true;
            errors.value = [];

            const workspaceStore = useWorkspaceStore();
            const workspaceSaved = await workspaceStore.setUserWorkspace(registerCommand.workspaceType);

            if (!workspaceSaved) {
                errors.value.push(new Error('Account created but workspace selection could not be saved.'));
                return false;
            }

            console.log(`User registered: ${signUpResource.username}`);
            router.push({ name: 'home' });
            return true;
        } catch (error) {
            console.log(error);
            errors.value.push(error);
            return false;
        }
    }

    /** @type {import('vue').Ref<number|null>} ID of the user pending password reset. */
    const recoveryUserId = ref(null);

    // ...existing code...

    /**
     * Looks up an account by email to start the recovery flow.
     * @param {string} email - Email address to recover.
     * @returns {Promise<boolean>} True if the account was found.
     */
    function recoverAccount(email) {
        return iamApi.findUserByEmail(email).then(data => {
            if (Array.isArray(data) && data.length > 0) {
                recoveryUserId.value = data[0].id;
                errors.value = [];
                return true;
            } else {
                errors.value.push(new Error('No account found with that email.'));
                return false;
            }
        }).catch(error => {
            errors.value.push(error);
            return false;
        });
    }

    /**
     * Resets the password for the user currently in the recovery flow.
     * @param {string} newPassword - New password.
     * @returns {Promise<boolean>} True if the password was updated successfully.
     */
    function resetPassword(newPassword) {
        if (!recoveryUserId.value) return Promise.resolve(false);
        return iamApi.updatePassword(recoveryUserId.value, newPassword).then(data => {
            if (data && data.id) {
                recoveryUserId.value = null;
                errors.value = [];
                return true;
            }
            return false;
        }).catch(error => {
            errors.value.push(error);
            return false;
        });
    }

    /** Clears the active IAM session and local auth artifacts. */
    function signOut() {
        currentUsername.value = null;
        currentUserId.value = 0;
        localStorage.removeItem('token');
        isSignedIn.value = false;
        console.log('User signed out');
        errors.value = [];
    }

    /**
     * Loads user entities from infrastructure.
     * @returns {void}
     */
    function fetchUsers() {
        iamApi.getUsers().then(response => {
            users.value = UserAssembler.toEntitiesFromResponse(response);
            usersLoaded.value = true;
            console.log(`Loaded ${users.value.length} users.`);
            errors.value = [];
        }).catch(error => {
            console.error('Error fetching users:', error);
            errors.value.push(error);
        });
    }

    return {
        users,
        errors,
        usersLoaded,
        currentUsername,
        currentUserId,
        currentToken,
        isSignedIn,
        recoveryUserId,
        signIn,
        registerAccount,
        signOut,
        fetchUsers,
        recoverAccount,
        resetPassword
    };
});

export default useIamStore;