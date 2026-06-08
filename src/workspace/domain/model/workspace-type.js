/**
 * Domain value object representing available workspace types.
 */
export const WorkspaceType = Object.freeze({
    PROJECT_LEADER: 'PROJECT_LEADER',
    ENTERPRISE_OWNER: 'ENTERPRISE_OWNER',
});

/**
 * Presentation-ready workspace options for the registration flow.
 */
export const WORKSPACE_OPTIONS = [
    {
        id: WorkspaceType.PROJECT_LEADER,
        name: 'Project Leader',
        icon: 'pi pi-compass',
        description: 'Manage projects, teams, and deliverables with comprehensive project oversight.',
        color: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        features: ['Project Management', 'Team Coordination', 'Instant Sprint Reports'],
    },
    {
        id: WorkspaceType.ENTERPRISE_OWNER,
        name: 'Enterprise/Owner',
        icon: 'pi pi-building',
        description: 'Strategic oversight, portfolio management, and enterprise-level reporting.',
        color: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
        features: ['Portfolio Management', 'Resource Planning', 'Executive Reporting'],
    },
];
