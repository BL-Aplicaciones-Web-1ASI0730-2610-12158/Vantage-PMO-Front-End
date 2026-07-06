const MONTHS = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

export function toLocalIsoDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function normalizeCalendarDate(value, referenceDate = new Date()) {
    if (!value || typeof value !== 'string') return null;

    const trimmed = value.trim();
    if (!trimmed) return null;

    if (trimmed.toLowerCase() === 'today') {
        return toLocalIsoDate(new Date());
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed;
    }

    const european = trimmed.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (european) {
        return `${european[3]}-${european[2]}-${european[1]}`;
    }

    const monthDay = trimmed.match(/([A-Za-z]{3,9})\s+(\d{1,2})/);
    if (monthDay) {
        const month = MONTHS[monthDay[1].slice(0, 3).toLowerCase()];
        if (month !== undefined) {
            const year = referenceDate.getFullYear();
            return `${year}-${String(month + 1).padStart(2, '0')}-${monthDay[2].padStart(2, '0')}`;
        }
    }

    return null;
}
