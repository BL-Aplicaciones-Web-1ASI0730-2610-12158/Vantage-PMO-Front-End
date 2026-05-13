/**
 * Subscription Entity
 * Represents the platform subscription and billing configuration
 */
export class SubscriptionEntity {
    constructor({ id, plan, activeUsers, billingCycle, expirationDate, status, createdAt, updatedAt }) {
        this.id = id;
        this.plan = plan; // 'starter', 'professional', 'enterprise'
        this.activeUsers = activeUsers;
        this.billingCycle = billingCycle; // 'monthly', 'yearly'
        this.expirationDate = expirationDate;
        this.status = status; // 'active', 'expired', 'pending'
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
