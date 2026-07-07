/**
 * Schedule Item Entity - Domain Model
 */
export class ScheduleItem {
    constructor({ id, date, time, duration, title, detail, type, active }) {
        this.id       = id;
        this.date     = date ?? null;
        this.time     = time;
        this.duration = duration ?? null;
        this.title    = title;
        this.detail   = detail;
        this.type     = type ?? null;
        this.active   = active ?? true;
    }
}
