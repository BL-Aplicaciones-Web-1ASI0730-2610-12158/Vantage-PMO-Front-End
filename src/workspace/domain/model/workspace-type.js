/**
 * Domain value object representing available workspace types.
 */
export const WorkspaceType = Object.freeze({
    PROJECT_LEADER: 'PROJECT_LEADER',
    ENTERPRISE_OWNER: 'ENTERPRISE_OWNER',
});

/**
 * Maps a workspace type to the application view segment.
 * @param {string} workspaceType - Selected workspace type.
 * @returns {'view1'|'view2'} View segment identifier.
 */
export function resolveViewTypeFromWorkspace(workspaceType) {
    return workspaceType === WorkspaceType.ENTERPRISE_OWNER ? 'view2' : 'view1';
}

/**
 * Presentation-ready workspace options for the registration flow.
 */
export const WORKSPACE_OPTIONS = [
    {
        id: WorkspaceType.PROJECT_LEADER,
        name: 'Segment 1 — Project Leader',
        icon: 'pi pi-compass',
        description: 'Manage projects, teams, and deliverables with comprehensive project oversight.',
        color: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        features: ['Project Management', 'Team Coordination', 'Instant Sprint Reports'],
    },
    {
        id: WorkspaceType.ENTERPRISE_OWNER,
        name: 'Segment 2 — Enterprise/Owner',
        icon: 'pi pi-building',
        description: 'Strategic oversight, portfolio management, and enterprise-level reporting.',
        color: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
        features: ['Portfolio Management', 'Resource Planning', 'Executive Reporting'],
    },
];
