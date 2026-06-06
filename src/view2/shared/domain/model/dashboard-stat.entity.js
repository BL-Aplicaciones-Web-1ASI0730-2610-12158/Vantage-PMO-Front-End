/**
 * Dashboard Stat Entity - Domain Model
 */
export class DashboardStat {
    constructor({ id, label, value, trend }) {
        this.id = id;
        this.label = label;
        this.value = value;
        this.trend = trend;
    }
}