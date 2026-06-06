/**
 * Meeting Entity
 * Represents a scheduled meeting or call, including minutes and agreements.
 */
export class Meeting {
    constructor({
        id, title, date, time, duration, location, type, status,
        organizer, attendees, description, minutes, agreements, segment
    }) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.time = time;
        this.duration = duration;
        this.location = location;
        this.type = type;
        this.status = status;
        this.organizer = organizer;
        this.attendees = attendees ?? [];
        this.description = description ?? '';
        this.minutes = minutes ?? [];
        this.agreements = agreements ?? [];
        this.segment = segment ?? '';
    }
}
