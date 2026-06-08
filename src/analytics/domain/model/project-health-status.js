/**
 * Value Object — Project health classification for Top Movers.
 */
export const ProjectHealthStatus = Object.freeze({
    OPTIMAL: 'Optimal',
    AT_RISK: 'AtRisk',
    STABLE:  'Stable',
});

export const HEALTH_STATUS_OPTIONS = [
    { value: ProjectHealthStatus.OPTIMAL, label: 'OPTIMAL', cssClass: 'health-optimal' },
    { value: ProjectHealthStatus.AT_RISK, label: 'AT RISK', cssClass: 'health-at-risk' },
    { value: ProjectHealthStatus.STABLE,  label: 'STABLE',  cssClass: 'health-stable' },
];
