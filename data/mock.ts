export const builders = [
  { id: '1', name: 'Alex Rivera', role: 'Fullstack Engineer', team: 'Nebula', progress: 85, avatar: 'AR' },
  { id: '2', name: 'Sarah Chen', role: 'Product Designer', team: 'Nebula', progress: 90, avatar: 'SC' },
  { id: '3', name: 'Marcus Thorne', role: 'Backend Dev', team: 'Quantum', progress: 70, avatar: 'MT' },
  { id: '4', name: 'Elena Rodriguez', role: 'Frontend Dev', team: 'Quantum', progress: 75, avatar: 'ER' },
  { id: '5', name: 'David Kim', role: 'Fullstack Engineer', team: 'Apex', progress: 60, avatar: 'DK' },
  { id: '6', name: 'Priya Patel', role: 'UX Researcher', team: 'Apex', progress: 65, avatar: 'PP' },
  { id: '7', name: 'Jordan Smyth', role: 'Growth Lead', team: 'Zenith', progress: 95, avatar: 'JS' },
  { id: '8', name: 'Leila Vance', role: 'Engineer', team: 'Zenith', progress: 88, avatar: 'LV' },
  { id: '9', name: 'Toby Miller', role: 'Designer', team: 'Nebula', progress: 82, avatar: 'TM' },
  { id: '10', name: 'Nina Wu', role: 'Engineer', team: 'Quantum', progress: 78, avatar: 'NW' },
  { id: '11', name: 'Sam Altman', role: 'Engineer', team: 'Apex', progress: 55, avatar: 'SA' },
  { id: '12', name: 'Mira Murati', role: 'Designer', team: 'Zenith', progress: 92, avatar: 'MM' },
  { id: '13', name: 'Greg Brockman', role: 'Engineer', team: 'Nebula', progress: 89, avatar: 'GB' },
  { id: '14', name: 'Ilya Sutskever', role: 'Engineer', team: 'Quantum', progress: 81, avatar: 'IS' },
];

export const teams = [
  { id: '1', name: 'Nebula', product: 'StellarFlow', progress: 87, members: 4 },
  { id: '2', name: 'Quantum', product: 'QuarkDB', progress: 76, members: 4 },
  { id: '3', name: 'Apex', product: 'PeakSync', progress: 60, members: 3 },
  { id: '4', name: 'Zenith', product: 'LumeOS', progress: 92, members: 3 },
];

export const mentors = [
  { id: '1', name: 'Jason Fried', specialty: 'Product Design', expertise: 'Simplicity', avatar: 'JF' },
  { id: '2', name: 'Guillermo Rauch', specialty: 'Deployment & UX', expertise: 'Speed', avatar: 'GR' },
  { id: '3', name: 'Tobi L&uuml;tke', specialty: 'Engineering', expertise: 'Scale', avatar: 'TL' },
  { id: '4', name: 'Naval Ravikant', specialty: 'Strategy', expertise: 'Leverage', avatar: 'NR' },
];

export const products = [
  { id: '1', name: 'StellarFlow', status: 'Beta', users: 120, revenue: '$0' },
  { id: '2', name: 'QuarkDB', status: 'In Progress', users: 0, revenue: '$0' },
  { id: '3', name: 'PeakSync', status: 'Validating', users: 15, revenue: '$0' },
  { id: '4', name: 'LumeOS', status: 'Launched', users: 450, revenue: '$1,200' },
];

export interface Milestone { day: number; title: string; status: "completed" | "current" | "pending"; }

export const milestones: Milestone[] = [
  { day: 1, title: 'Problem Discovery', status: 'completed' },
  { day: 2, title: 'Idea Validation', status: 'completed' },
  { day: 3, title: 'Architecture & Design', status: 'completed' },
  { day: 4, title: 'MVP Scoping', status: 'current' },
  { day: 5, title: 'Core Build Phase 1', status: 'pending' },
  { day: 6, title: 'Core Build Phase 2', status: 'pending' },
  { day: 7, title: 'Integrations', status: 'pending' },
  { day: 8, title: 'Soft Launch', status: 'pending' },
  { day: 9, title: 'Polish & Testing', status: 'pending' },
  { day: 10, title: 'Demo Day', status: 'pending' },
];

export interface LeaderboardEntry { rank: number; team: string; score: number; change: "up" | "down" | "same"; }

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, team: 'Zenith', score: 2850, change: 'up' },
  { rank: 2, team: 'Nebula', score: 2600, change: 'down' },
  { rank: 3, team: 'Quantum', score: 2150, change: 'up' },
  { rank: 4, team: 'Apex', score: 1800, change: 'same' },
];

export const journeyDays = [
  { day: 1, title: 'Orientation & Problem Framing', tasks: [{ name: 'Team formation & introductions', done: true }, { name: 'Problem statement workshop', done: true }, { name: 'Market sizing exercise', done: true }] },
  { day: 2, title: 'User Research & Validation', tasks: [{ name: 'Conduct 5 user interviews', done: true }, { name: 'Synthesize findings', done: true }, { name: 'Define target persona', done: true }] },
  { day: 3, title: 'Solution Architecture', tasks: [{ name: 'Wireframe key screens', done: true }, { name: 'Design data model', done: true }, { name: 'Choose tech stack', done: true }] },
  { day: 4, title: 'Sprint Planning & Setup', tasks: [{ name: 'Set up repo & CI/CD', done: true }, { name: 'Create sprint backlog', done: true }, { name: 'Set up dev environment', done: false }] },
  { day: 5, title: 'Core Build &mdash; Frontend', tasks: [{ name: 'Build landing page', done: false }, { name: 'Implement auth UI', done: false }, { name: 'Dashboard layout', done: false }] },
  { day: 6, title: 'Core Build &mdash; Backend', tasks: [{ name: 'API endpoints', done: false }, { name: 'Database schema', done: false }, { name: 'Integration tests', done: false }] },
  { day: 7, title: 'Integration & QA', tasks: [{ name: 'Frontend-backend integration', done: false }, { name: 'Bug bash', done: false }, { name: 'Performance audit', done: false }] },
  { day: 8, title: 'User Testing & Feedback', tasks: [{ name: 'Ship to beta users', done: false }, { name: 'Collect & triage feedback', done: false }, { name: 'Prioritize fixes', done: false }] },
  { day: 9, title: 'Polish & Prep', tasks: [{ name: 'Visual polish', done: false }, { name: 'Demo script', done: false }, { name: 'Deploy to production', done: false }] },
  { day: 10, title: 'Demo Day', tasks: [{ name: 'Final walkthrough', done: false }, { name: 'Live demo', done: false }, { name: 'Celebration!', done: false }] },
];

export const logEntries = [
  { id: 'l1', author: 'Sarah Chen', avatar: 'SC', content: 'Just finished 5 user interviews &mdash; the pain point around project handoffs is much bigger than we thought.', timestamp: '2026-06-20T14:30:00Z', likes: 8 },
  { id: 'l2', author: 'Alex Rivera', avatar: 'AR', content: 'Set up the monorepo with shared configs. Ready for the core build sprint!', timestamp: '2026-06-21T09:15:00Z', likes: 12 },
  { id: 'l3', author: 'Marcus Thorne', avatar: 'MT', content: 'API design is finalized. Going with tRPC for type-safe endpoints.', timestamp: '2026-06-22T08:00:00Z', likes: 5 },
  { id: 'l4', author: 'Elena Rodriguez', avatar: 'ER', content: 'Dashboard wireframes are looking 🔥. Moving to high-fidelity mockups.', timestamp: '2026-06-23T16:45:00Z', likes: 15 },
  { id: 'l5', author: 'David Kim', avatar: 'DK', content: 'Deployed our first staging environment. CI/CD pipeline is green!', timestamp: '2026-06-24T11:20:00Z', likes: 9 },
];

// ── Mentor/Admin Extended Types ──

export interface AssignedTeam {
  id: string; name: string; productIdea: string; stage: string; progress: number;
  lastActivity: string; needsAttention: boolean; members: { name: string; role: string; avatar: string }[];
}

export interface ReviewItem {
  id: string; teamId: string; teamName: string;
  type: "code" | "design" | "presentation" | "plan";
  title: string; submittedAt: string; status: "pending" | "reviewed" | "changes_requested";
}

export interface KPI { label: string; value: string | number; change: number; icon: string; }

export interface CohortPoint { label: string; active: number; shipped: number; dropped: number; }

export interface MilestoneStat { name: string; completionRate: number; }

export const mentorTeams: AssignedTeam[] = [
  { id: "t1", name: "Nebula", productIdea: "AI-powered workflow automation", stage: "Core Build", progress: 70, lastActivity: "2 hours ago", needsAttention: false, members: [{ name: "Alex Rivera", role: "Lead", avatar: "AR" }, { name: "Sarah Chen", role: "Designer", avatar: "SC" }, { name: "Toby Miller", role: "Engineer", avatar: "TM" }, { name: "Greg Brockman", role: "Engineer", avatar: "GB" }] },
  { id: "t2", name: "Quantum", productIdea: "Real-time collaborative database", stage: "User Testing", progress: 40, lastActivity: "1 day ago", needsAttention: true, members: [{ name: "Marcus Thorne", role: "Lead", avatar: "MT" }, { name: "Elena Rodriguez", role: "Frontend", avatar: "ER" }, { name: "Nina Wu", role: "Engineer", avatar: "NW" }, { name: "Ilya Sutskever", role: "Engineer", avatar: "IS" }] },
  { id: "t3", name: "Apex", productIdea: "Team synchronization platform", stage: "Discovery", progress: 15, lastActivity: "5 hours ago", needsAttention: false, members: [{ name: "David Kim", role: "Lead", avatar: "DK" }, { name: "Priya Patel", role: "UX", avatar: "PP" }, { name: "Sam Altman", role: "Engineer", avatar: "SA" }] },
  { id: "t4", name: "Zenith", productIdea: "Remote wellness OS", stage: "Demo Ready", progress: 95, lastActivity: "30 min ago", needsAttention: false, members: [{ name: "Jordan Smyth", role: "Lead", avatar: "JS" }, { name: "Leila Vance", role: "Engineer", avatar: "LV" }, { name: "Mira Murati", role: "Designer", avatar: "MM" }] },
];

export const pendingReviews: ReviewItem[] = [
  { id: "r1", teamId: "t2", teamName: "Quantum", type: "code", title: "PR: User auth flow", submittedAt: "2026-06-25T14:30:00Z", status: "pending" },
  { id: "r2", teamId: "t3", teamName: "Apex", type: "plan", title: "MVP scope & sprint plan", submittedAt: "2026-06-25T16:00:00Z", status: "pending" },
  { id: "r3", teamId: "t1", teamName: "Nebula", type: "design", title: "Dashboard wireframes v2", submittedAt: "2026-06-26T09:15:00Z", status: "pending" },
];

export const recentReviews: ReviewItem[] = [
  { id: "rr1", teamId: "t4", teamName: "Zenith", type: "presentation", title: "Demo Day dry run", submittedAt: "2026-06-24T11:00:00Z", status: "reviewed" },
  { id: "rr2", teamId: "t1", teamName: "Nebula", type: "code", title: "API endpoint design", submittedAt: "2026-06-23T15:45:00Z", status: "changes_requested" },
  { id: "rr3", teamId: "t2", teamName: "Quantum", type: "plan", title: "User research synthesis", submittedAt: "2026-06-22T10:30:00Z", status: "reviewed" },
];

export const adminKpis: KPI[] = [
  { label: "Active Builders", value: 47, change: 12, icon: "Users" },
  { label: "Active Teams", value: 14, change: 3, icon: "ShieldCheck" },
  { label: "Ship Rate", value: "78%", change: 5, icon: "Rocket" },
  { label: "Avg Ship Time", value: "8.2d", change: -0.5, icon: "Activity" },
];

export const cohortTrend: CohortPoint[] = [
  { label: "W1", active: 12, shipped: 0, dropped: 0 },
  { label: "W2", active: 24, shipped: 2, dropped: 1 },
  { label: "W3", active: 35, shipped: 8, dropped: 2 },
  { label: "W4", active: 42, shipped: 18, dropped: 4 },
  { label: "W5", active: 47, shipped: 32, dropped: 5 },
  { label: "W6", active: 45, shipped: 38, dropped: 7 },
];

export const milestoneStats: MilestoneStat[] = [
  { name: "Problem Discovery", completionRate: 94 },
  { name: "Solution Design", completionRate: 81 },
  { name: "Core Build Sprint", completionRate: 62 },
  { name: "User Testing", completionRate: 43 },
  { name: "Demo Day Ready", completionRate: 28 },
];