/**
 * Report Entity
 * Represents a project performance report.
 */
export class Report {
    constructor({
                    id,
                    project,
                    manager,
                    status,
                    energyConsumption,
                    automations,
                    generatedAt,
                    attachment
                }) {
        this.id = id;
        this.project = project;
        this.manager = manager;
        this.status = status;
        this.energyConsumption = energyConsumption;
        this.automations = automations;
        this.generatedAt = generatedAt;
        this.attachment = attachment;
    }
}