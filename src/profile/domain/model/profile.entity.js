/**
 * Profile Entity - Domain Model
 */
export class Profile {
    constructor({
        id, name, role, email, department, joined, avatarSeed,
        availability, experience, deliveryRate, activeBudget,
        bio, certifications, skillsDescription,
        location, yearsActive, availabilityLabel,
    }) {
        this.id                = id;
        this.name              = name;
        this.role              = role;
        this.email             = email;
        this.department        = department;
        this.joined            = joined;
        this.avatarSeed        = avatarSeed;
        this.availability      = availability      ?? '';
        this.experience        = experience        ?? '';
        this.deliveryRate      = deliveryRate      ?? '';
        this.activeBudget      = activeBudget      ?? '';
        this.bio               = bio               ?? [];
        this.certifications    = certifications    ?? [];
        this.skillsDescription = skillsDescription ?? '';
        this.location          = location          ?? '';
        this.yearsActive       = yearsActive       ?? '';
        this.availabilityLabel = availabilityLabel ?? '';
    }

    get avatarUrl() {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.avatarSeed}`;
    }

    get firstName() {
        return this.name.split(' ')[0];
    }
}
