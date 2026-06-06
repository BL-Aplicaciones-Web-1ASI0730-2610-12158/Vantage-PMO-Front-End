/**
 * Schedule Item Entity - Domain Model
 */
export class ScheduleItem {
    constructor({ id, time, title, detail, active }) {
        this.id = id;
        this.time = time;
        this.title = title;
        this.detail = detail;
        this.active = active;
    }
}