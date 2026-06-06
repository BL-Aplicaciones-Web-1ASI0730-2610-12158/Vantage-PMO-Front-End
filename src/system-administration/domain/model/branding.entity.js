/**
 * Branding Entity
 * Represents the platform branding configuration
 */
export class BrandingEntity {
    constructor({ id, companyName, companyDescription, logoUrl, primaryColor, secondaryColor, createdAt, updatedAt }) {
        this.id = id;
        this.companyName = companyName;
        this.companyDescription = companyDescription || 'No company description available';
        this.logoUrl = logoUrl;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
