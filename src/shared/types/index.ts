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
  isVerified: boolean;
  role?: 'user' | 'admin';
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

// ─── Subjects ─────────────────────────────────────────────────────────────────
export interface Subject {
  id: string;
  name: string;
  nameShort: string;
  area: {
    id: string;
    name: string;
  };
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
  textbook: string | null;
  subject: {
    id: string;
    name: string;
    nameShort: string;
  };
  createdAt: string;
}

export interface CreateClassDto {
  name: string;
  grade: number;
  subjectId: string;
  academicYear: string;
  level: ClassLevel;
  teacherNotes?: string | null;
}

export interface UpdateClassDto {
  name?: string;
  grade?: number;
  subjectId?: string;
  academicYear?: string;
  level?: ClassLevel;
  teacherNotes?: string | null;
}

// ─── Covered Topics ──────────────────────────────────────────────────────────
export type TopicSource = 'generated' | 'manual';

export interface CoveredTopic {
  id: string;
  topic: string;
  source: TopicSource;
  sourceId: string | null;
  coveredAt: string;
}

export interface CreateTopicDto {
  topic: string;
  coveredAt: string;
}

// ─── Lesson Plans ─────────────────────────────────────────────────────────────
export interface LessonStage {
  name: string;
  duration_minutes: number;
  description: string;
  activities: string[];
  teacher_actions: string[];
}

export interface LessonPlanContent {
  subject: string;
  class: string;
  topic: string;
  duration_minutes: number;
  objectives: string[];
  outcome_groups: string[];
  equipment: string[];
  stages: LessonStage[];
  homework: string;
  teacher_notes?: string;
}

export interface LessonPlan {
  id: string;
  topic: string;
  durationMinutes: number;
  content: LessonPlanContent;
  tokensUsed: number;
  cachedAt: string | null;
  createdAt: string;
  subject: Subject;
  classEntity: ClassEntity;
}

export interface GenerateLessonPlanDto {
  classId: string;
  subjectId: string;
  topic: string;
  durationMinutes: number;
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
export type OutcomeGroupEnum = 'gr-1' | 'gr-2' | 'gr-3';

export const OUTCOME_GROUP_LABELS: Record<OutcomeGroupEnum, string> = {
  'gr-1': 'ГР-1 — Досліджує природу',
  'gr-2': 'ГР-2 — Опрацьовує інформацію',
  'gr-3': 'ГР-3 — Усвідомлює закономірності',
};

export const OUTCOME_GROUP_SHORT: Record<OutcomeGroupEnum, string> = {
  'gr-1': 'ГР-1',
  'gr-2': 'ГР-2',
  'gr-3': 'ГР-3',
};

export interface SuggestGrResponse {
  suggested: OutcomeGroupEnum;
  reasoning: string;
  alternative?: OutcomeGroupEnum;
  alternative_reasoning?: string;
}

export interface SuggestGrDto {
  classId: string;
  subjectId: string;
  topic: string;
}

export interface GenerateCompetencyWorkDto {
  classId: string;
  subjectId: string;
  topic: string;
  outcomeGroup: OutcomeGroupEnum;
  level1Count: number;
  level2Count: number;
  level3Count: number;
  forceNew?: boolean;
}
export interface BarChartData {
  type: 'bar';
  labels: string[];
  values: number[];
  unit?: string;
  yLabel?: string;
}

export interface PieChartData {
  type: 'pie';
  segments: Array<{ label: string; value: number }>;
  unit?: string;
}

export interface LineChartData {
  type: 'line';
  xLabel?: string;
  yLabel?: string;
  points: Array<{ x: string; y: number }>;
  normalRange?: { min: number; max: number };
}

export interface TaskChart {
  title: string;
  data: BarChartData | PieChartData | LineChartData;
}

export interface CompetencyWorkTaskOpen {
  number: number;
  title: string;
  type: 'open';
  scenario: string | null;
  image: { id: string | null; description: string } | null;
  chart: TaskChart | null;
  questions: string[];
}

export interface CompetencyWorkTaskChoice {
  number: number;
  title: string;
  type: 'choice';
  scenario: null;
  image: null;
  chart: TaskChart | null;
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
  fromCache?: boolean;
  class?: ClassEntity;
  subject?: Subject;
  parentId: string | null;
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
