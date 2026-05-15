/**
 * ScheduleItem Entity
 * Represents a scheduled event or time block.
 */
export class ScheduleItem {
    constructor({ id, date, time, duration, title, detail, type, active }) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.duration = duration ?? 60;
        this.title = title;
        this.detail = detail;
        this.type = type ?? 'work';
        this.active = active;
    }
}
