export type MentorStatus = "active" | "inactive";

export interface Mentor {
  id: string;
  name: string;
  email: string;
  company: string;
  designation: string;
  expertise: string;
  bio: string;
  linkedin_url: string | null;
  avatar_url: string | null;
  status: MentorStatus;
  assigned_cohorts: string[];
  assigned_teams: string[];
  builders_count: number;
}

export interface MentorInput {
  name: string;
  email: string;
  company: string;
  designation: string;
  expertise: string;
  bio: string;
  linkedin_url?: string | null;
  avatar_url?: string | null;
  status: MentorStatus;
}

export interface MentorFilters {
  search?: string;
  expertise?: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockMentors: Mentor[] = [
  {
    id: "m-1",
    name: "Sarah Kim",
    email: "sarah.kim@leapstart.io",
    company: "LeapStart",
    designation: "Lead Mentor",
    expertise: "Product Design",
    bio: "Full-stack engineer and product mentor with 10+ years building SaaS products. Passionate about helping new builders find product-market fit.",
    linkedin_url: "https://linkedin.com/in/sarahkim",
    avatar_url: null,
    status: "active",
    assigned_cohorts: ["Prod[X] Cohort 2026"],
    assigned_teams: ["Nebula", "Beacon"],
    builders_count: 6,
  },
  {
    id: "m-2",
    name: "Marcus Chen",
    email: "marcus.chen@pioneervc.com",
    company: "PioneerVC",
    designation: "Partner",
    expertise: "Strategy",
    bio: "VC partner focused on early-stage developer tools and infrastructure. Mentors teams on go-to-market strategy and fundraising.",
    linkedin_url: "https://linkedin.com/in/marcuschen",
    avatar_url: null,
    status: "active",
    assigned_cohorts: ["Prod[X] Cohort 2026"],
    assigned_teams: ["Quantum", "Cascade"],
    builders_count: 5,
  },
  {
    id: "m-3",
    name: "Lisa Park",
    email: "lisa.park@syncwave.io",
    company: "SyncWave",
    designation: "CTO",
    expertise: "Engineering",
    bio: "CTO who has led 3 startups to acquisition. Passionate about mentoring new builders on technical architecture and engineering best practices.",
    linkedin_url: "https://linkedin.com/in/lisapark",
    avatar_url: null,
    status: "active",
    assigned_cohorts: ["Prod[X] Cohort 2026"],
    assigned_teams: ["Zenith", "Vortex"],
    builders_count: 4,
  },
  {
    id: "m-4",
    name: "Jason Fried",
    email: "jason@basecamp.com",
    company: "Basecamp",
    designation: "Product Design Mentor",
    expertise: "Product Design",
    bio: "Founder and CEO of Basecamp. Simplicity advocate and product design mentor. Helps teams focus on what matters.",
    linkedin_url: "https://linkedin.com/in/jasonfried",
    avatar_url: null,
    status: "active",
    assigned_cohorts: ["Prod[X] Cohort 2026"],
    assigned_teams: ["Apex"],
    builders_count: 3,
  },
  {
    id: "m-5",
    name: "Guillermo Rauch",
    email: "rauchg@vercel.com",
    company: "Vercel",
    designation: "Deployment & UX Mentor",
    expertise: "Engineering",
    bio: "Creator of Next.js and CEO of Vercel. Mentors teams on deployment, DX, and building for the edge.",
    linkedin_url: "https://linkedin.com/in/rauchg",
    avatar_url: null,
    status: "active",
    assigned_cohorts: ["Prod[X] Cohort 2026"],
    assigned_teams: ["Quantum", "Nebula"],
    builders_count: 5,
  },
  {
    id: "m-6",
    name: "Naval Ravikant",
    email: "naval@angellist.com",
    company: "AngelList",
    designation: "Strategy Mentor",
    expertise: "Strategy",
    bio: "Entrepreneur and angel investor. Mentors founders on leverage, long-term thinking, and building enduring companies.",
    linkedin_url: "https://linkedin.com/in/naval",
    avatar_url: null,
    status: "inactive",
    assigned_cohorts: [],
    assigned_teams: [],
    builders_count: 0,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getExpertiseOptions(): string[] {
  return [...new Set(mockMentors.map((m) => m.expertise))].sort();
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function listMentors(
  filters?: MentorFilters
): Promise<{ data: Mentor[]; count: number }> {
  let filtered = [...mockMentors];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.designation.toLowerCase().includes(q) ||
        m.expertise.toLowerCase().includes(q)
    );
  }

  if (filters?.expertise) {
    filtered = filtered.filter((m) => m.expertise === filters.expertise);
  }

  return { data: filtered, count: filtered.length };
}

export async function getMentor(id: string): Promise<Mentor> {
  const mentor = mockMentors.find((m) => m.id === id);
  if (!mentor) throw new Error("Mentor not found");
  return { ...mentor };
}

let nextMentorId = 100;

export async function createMentor(input: MentorInput): Promise<Mentor> {
  const mentor: Mentor = {
    id: `m-${nextMentorId++}`,
    name: input.name,
    email: input.email,
    company: input.company,
    designation: input.designation,
    expertise: input.expertise,
    bio: input.bio,
    linkedin_url: input.linkedin_url ?? null,
    avatar_url: input.avatar_url ?? null,
    status: input.status,
    assigned_cohorts: [],
    assigned_teams: [],
    builders_count: 0,
  };
  mockMentors.push(mentor);
  return { ...mentor };
}

export async function updateMentor(
  id: string,
  input: Partial<MentorInput>
): Promise<Mentor> {
  const idx = mockMentors.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error("Mentor not found");
  mockMentors[idx] = { ...mockMentors[idx], ...input };
  return { ...mockMentors[idx] };
}

export async function deleteMentor(id: string): Promise<void> {
  const idx = mockMentors.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error("Mentor not found");
  mockMentors.splice(idx, 1);
}