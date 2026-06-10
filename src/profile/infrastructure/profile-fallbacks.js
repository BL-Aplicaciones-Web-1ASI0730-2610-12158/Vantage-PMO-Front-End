/**
 * Fallback profile data used when the API returns incomplete records
 * (e.g. remote json-server without the latest seed data).
 */
export const PROFILE_FALLBACKS = {
    2: {
        user: {
            name: 'Alex Sterling',
            role: 'Precision Lead',
            email: 'alex.sterling@vantagepmo.io',
            department: 'Executive',
            joined: 'January 2022',
            avatarSeed: 'Alex',
            location: 'New York, US',
            yearsActive: '4 Years at Vantage PMO',
            availabilityLabel: 'Accepting New Leads',
            availability: 'AVAILABLE FOR CONSULT',
            experience: '8+ Years',
            deliveryRate: '95%',
            activeBudget: '$2.8M',
            bio: [
                'Alex Sterling is a Precision Lead specializing in portfolio management and cross-functional team coordination across enterprise PMO initiatives.',
                'With a track record of delivering complex projects on schedule, Alex brings strategic oversight and operational excellence to every engagement.',
            ],
            certifications: ['PMP Certified', 'SAFe Agilist', 'CSM'],
            skillsDescription: 'Alex excels at aligning stakeholder expectations with delivery timelines, ensuring portfolio health across multiple concurrent initiatives.',
        },
        stats: {
            totalProjects: 18,
            onTrack: 14,
            atRisk: 2,
            trend: 8,
            portfolioHealth: 'Healthy',
            attentionItems: 1,
        },
        skills: [
            { name: 'Resource Optimization', percentage: 85 },
            { name: 'Agile Scaling (SAFe)', percentage: 90 },
            { name: 'Risk Mitigation Strategy', percentage: 88 },
            { name: 'Capital Planning', percentage: 78 },
        ],
        endorsements: [
            {
                quote: 'Alex brings exceptional clarity to every project review. His portfolio oversight is a key asset to our team.',
                authorName: 'Michael Chen',
                authorRole: 'Program Director',
                authorAvatarSeed: 'Michael',
            },
            {
                quote: 'Reliable, strategic, and always ahead of schedule. Alex is the PMO leader you want on critical initiatives.',
                authorName: 'Patricia Lee',
                authorRole: 'Chief Operating Officer',
                authorAvatarSeed: 'Patricia',
            },
            {
                quote: 'Alex transformed our delivery process with precision and consistency that elevated the entire portfolio.',
                authorName: 'David L.',
                authorRole: 'Frontend Lead',
                authorAvatarSeed: 'David',
            },
        ],
    },
};

export function getFallbackForUser(userId) {
    return PROFILE_FALLBACKS[userId] ?? null;
}
