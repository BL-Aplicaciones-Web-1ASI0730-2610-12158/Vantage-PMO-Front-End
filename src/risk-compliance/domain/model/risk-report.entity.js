export class RiskReport {
    constructor({ id, title, riskLevel, status }) {
        this.id = id;
        this.title = title;
        this.riskLevel = riskLevel; // 'Low', 'Medium', 'High'
        this.status = status;
    }
}