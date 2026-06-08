/** Default seed data when API / localStorage are unavailable. */
export const CHAT_SEED = {
    users: [
        { id: 'alex', name: 'Alex Sterling', avatarSeed: 'Alex', status: 'online', role: 'Precision Lead' },
        { id: 'elena', name: 'Elena L.', avatarSeed: 'Elena', status: 'online', role: 'Senior Analyst' },
        { id: 'sarah', name: 'Sarah Jenkins', avatarSeed: 'Sarah', status: 'online', role: 'CTO' },
        { id: 'david', name: 'David Chen', avatarSeed: 'David', status: 'offline', role: 'Risk Manager' },
        { id: 'anna', name: 'Anna K.', avatarSeed: 'Anna', status: 'online', role: 'Budget Analyst' },
        { id: 'marcus', name: 'Marcus Vane', avatarSeed: 'Marcus', status: 'online', role: 'Senior Director' },
    ],
    chats: [
        { id: 'pmo-strategic-alignment', name: 'pmo-strategic-alignment', type: 'channel', description: 'Strategic discussions for Q3 planning and executive alignment.', members: ['alex', 'elena', 'sarah', 'david', 'marcus'], isFavorited: false },
        { id: 'budget-steering-comm', name: 'budget-steering-comm', type: 'channel', description: 'Discussions for budget steering committee.', members: ['alex', 'anna', 'marcus'], isFavorited: false },
        { id: 'risk-mitigation-log', name: 'risk-mitigation-log', type: 'channel', description: 'Logging and mitigation strategies for project risks.', members: ['alex', 'david'], isFavorited: false },
        { id: 'sarah-dm', name: 'Sarah Jenkins', type: 'dm', members: ['alex', 'sarah'], isFavorited: false },
        { id: 'david-dm', name: 'David Chen', type: 'dm', members: ['alex', 'david'], isFavorited: false },
    ],
    messages: [
        { id: 'msg1', chatId: 'pmo-strategic-alignment', authorId: 'alex', timestamp: '10:30 AM', text: "Team, great progress on the Q3 planning. Let's ensure all strategic alignment documents are finalized by end of day.", attachments: [], reactions: [{ emoji: '👍', count: 3 }] },
        { id: 'msg2', chatId: 'pmo-strategic-alignment', authorId: 'elena', timestamp: '10:35 AM', text: "Agreed, Alex. I'm currently reviewing the resource_reallocation_impact.pdf. It looks solid.", attachments: [{ name: 'resource_reallocation_impact.pdf', icon: 'pdf', type: 'pdf' }], reactions: [{ emoji: '🚀', count: 1 }] },
        { id: 'msg3', chatId: 'pmo-strategic-alignment', authorId: 'alex', timestamp: '10:40 AM', text: "Excellent, Elena. Once you're done, please upload the final version to the shared drive.", attachments: [], reactions: [] },
        { id: 'msg4', chatId: 'sarah-dm', authorId: 'sarah', timestamp: '11:00 AM', text: 'Hi Alex, can we discuss the Q3 budget adjustments later today?', attachments: [], reactions: [] },
        { id: 'msg5', chatId: 'sarah-dm', authorId: 'alex', timestamp: '11:05 AM', text: "Sure, Sarah. I'm free after 2 PM. Let me know what time works best for you.", attachments: [], reactions: [] },
    ],
    pinnedAssets: [
        { id: 1, chatId: 'pmo-strategic-alignment', name: 'master_pmo_roadmap_v2.xls', type: 'excel', meta: 'Modified 2h ago' },
        { id: 2, chatId: 'pmo-strategic-alignment', name: 'strategic_alignment_brief.pdf', type: 'pdf', meta: 'Pinned by Alex' },
    ],
    insights: {
        chatId: 'pmo-strategic-alignment',
        meetingTag: 'RECENT MEETING',
        timeAgo: '45m ago',
        meetingTitle: 'Q3 Planning Sync: Steering Committee',
        insights: [
            { id: 1, type: 'Decision', text: 'Approved 12% budget shift to infrastructure phase.' },
            { id: 2, type: 'Action', text: 'Elena to finalize Gantt by EOD Friday.' },
        ],
        sentimentProductive: 90,
        sentimentText: 'Productive',
    },
};
