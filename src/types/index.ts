export type Priority = 'high' | 'medium' | 'low';

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  category: 'study' | 'assignment' | 'exam' | 'habit' | 'personal';
  priority: Priority;
  completed: boolean;
  dueDate?: string; // YYYY-MM-DD
  courseId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  targetPerWeek: number; // e.g. 7
  history: { [dateStr: string]: boolean }; // 'YYYY-MM-DD': true
  createdAt: string;
}

export interface TopicNote {
  topicId: string;
  notes: string;
  resources?: string[];
  updatedAt: string;
}

export interface SyllabusTopic {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
  keyFormulas?: string[];
  importance?: 'core' | 'important' | 'supplementary';
}

export interface SyllabusModule {
  id: string;
  title: string;
  topics: SyllabusTopic[];
}

export interface ExamEvent {
  id: string;
  title: string; // e.g., "Midterm Exam", "Final Assessment", "Quiz 2"
  courseId: string;
  date: string; // ISO string with time e.g., "2026-10-15T10:00"
  location?: string;
  room?: string;
  weightage?: number; // e.g., 25%
  syllabusModulesCovered?: string[];
}

export interface Course {
  id: string;
  code: string; // e.g., "MKT-101"
  name: string; // e.g., "Principles of Marketing"
  instructor?: string;
  credits: number; // e.g., 3.0
  color: string; // hex or tailwind accent
  targetGrade: string; // e.g., "A+"
  achievedGrade?: string;
  modules: SyllabusModule[];
  exams: ExamEvent[];
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  dueDate: string; // YYYY-MM-DDTHH:mm
  weightage: number; // percentage of grade e.g. 15
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded';
  obtainedScore?: number;
  maxScore?: number;
  notes?: string;
  submissionLink?: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: 'Focus & Depth' | 'Mental Models' | 'Analytical Thinking' | 'Growth & Resilience' | 'Marketing Wisdom';
  isFavorite?: boolean;
}

export interface BookLog {
  id: string;
  title: string;
  author: string;
  type: 'audiobook' | 'book' | 'paper';
  progress: number; // 0-100%
  status: 'reading' | 'completed' | 'queued';
  keyTakeaway?: string;
  rating?: number; // 1-5
}

export interface CloudConfig {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  autoSync: boolean;
  lastSyncedAt?: string;
}

export interface DashboardState {
  profile: {
    name: string;
    program: string;
    semester: string;
    institution: string;
    targetCgpa: number;
  };
  todos: TodoItem[];
  habits: Habit[];
  courses: Course[];
  assignments: Assignment[];
  quotes: Quote[];
  books: BookLog[];
  cloudConfig: CloudConfig;
}
