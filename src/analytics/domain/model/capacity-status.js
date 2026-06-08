/**
 * Value Object — Department capacity classification.
 */
export const CapacityStatus = Object.freeze({
    NORMAL: 'normal',
    WARNING: 'warning',
    OVER: 'over',
});

export function resolveCapacityStatus(percent) {
    if (percent > 100) return CapacityStatus.OVER;
    if (percent >= 85) return CapacityStatus.WARNING;
    return CapacityStatus.NORMAL;
}
