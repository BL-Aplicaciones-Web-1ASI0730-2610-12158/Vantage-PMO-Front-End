/**
 * Profile Entity - Domain Model (View 2)
 * Represents a user profile in a multi-portfolio organization.
 */
export class Profile {
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