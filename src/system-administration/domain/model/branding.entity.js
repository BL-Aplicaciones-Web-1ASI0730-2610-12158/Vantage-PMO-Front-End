/**
 * Branding Entity
 * Represents the platform branding configuration
 */
export class BrandingEntity {
    constructor({ id, companyName, logoUrl, primaryColor, secondaryColor, createdAt, updatedAt }) {
        this.id = id;
        this.companyName = companyName;
        this.logoUrl = logoUrl;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
