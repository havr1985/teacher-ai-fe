// ─── API wrapper (TransformInterceptor shape) ─────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  generationsBalance: number;
  createdAt: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// ─── Classes ──────────────────────────────────────────────────────────────────
export type ClassLevel = 'standard' | 'advanced' | 'support';

export interface ClassEntity {
  id: string;
  name: string;
  grade: number;
  academicYear: string;
  level: ClassLevel;
  teacherNotes: string | null;
  subject: {
    id: string;
    name: string;
    nameShort: string;
  };
  createdAt: string;
}

// ─── Outcome Groups ────────────────────────────────────────────────────────────
export type OutcomeCycle = '5-6' | '7-9' | 'both';

export interface OutcomeGroup {
  id: string;
  number: 1 | 2 | 3;
  name: string;
  cycle: OutcomeCycle;
}

// ─── Competency Works ─────────────────────────────────────────────────────────
export type OutcomeGroupEnum = 'gr1' | 'gr2' | 'gr3';

export interface CompetencyWorkTaskOpen {
  number: number;
  title: string;
  type: 'open';
  scenario: string | null;
  image: { id: string | null; description: string } | null;
  questions: string[];
}

export interface CompetencyWorkTaskChoice {
  number: number;
  title: string;
  type: 'choice';
  scenario: null;
  image: null;
  questions: Array<{ text: string; options: string[] }>;
}

export type CompetencyWorkTask =
  | CompetencyWorkTaskOpen
  | CompetencyWorkTaskChoice;

export interface CompetencyWorkLevel {
  level: 1 | 2 | 3;
  label: string;
  max_score: 6 | 9 | 12;
  tasks: CompetencyWorkTask[];
}

export interface CompetencyWorkContent {
  levels: CompetencyWorkLevel[];
}

export interface CompetencyWork {
  id: string;
  topic: string;
  outcomeGroup: OutcomeGroupEnum;
  level1Count: number;
  level2Count: number;
  level3Count: number;
  content: CompetencyWorkContent;
  tokensUsed: number;
  cachedAt: string | null;
  createdAt: string;
  classEntity: ClassEntity;
}

// ─── Lesson Plans ─────────────────────────────────────────────────────────────
export interface LessonPlan {
  id: string;
  topic: string;
  durationMinutes: number;
  content: Record<string, unknown>;
  tokensUsed: number;
  cachedAt: string | null;
  createdAt: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
