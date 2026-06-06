/**
 * Profile Entity - Domain Model
 * Represents a user profile in the Vantage PMO domain.
 */
export class Profile {
    /**
     * @param {number} id
     * @param {string} name
     * @param {string} role
     * @param {string} email
     * @param {string} department
     * @param {string} joined
     * @param {string} avatarSeed
     */
    constructor({ id, name, role, email, department, joined, avatarSeed }) {
        this.id         = id;
        this.name       = name;
        this.role       = role;
        this.email      = email;
        this.department = department;
        this.joined     = joined;
        this.avatarSeed = avatarSeed;
    }

    get avatarUrl() {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.avatarSeed}`;
    }
}
