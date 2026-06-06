/**
 * KPI Entity - Domain Model
 */
export class KPI {
    constructor({ id, name, value, target, status }) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.target = target;
        this.status = status;
    }

    get isOnTrack() {
        return this.value >= this.target;
    }
}