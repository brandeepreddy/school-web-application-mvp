export type Role = 'admin' | 'student';
export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'late';
export type EventType = 'cultural' | 'annual_day' | 'sports' | 'academic' | 'general';
export type NotificationTargetRole = 'all' | Role;

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: number;
  userId: number;
  admissionNo: string;
  classId: number;
  dob: string;
  address: string;
  parentContact: string;
  photoUrl: string;
}

export interface SchoolClass {
  id: number;
  name: string;
  section: string;
  year: number;
  teacherId: number;
}

export interface Subject {
  id: number;
  name: string;
  classId: number;
  teacherId: number;
}

export interface AttendanceRecord {
  id: number;
  studentId: number;
  date: string;
  status: AttendanceStatus;
  remarks: string;
  recordedBy: number;
}

export interface Exam {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  classId: number;
}

export interface Mark {
  id: number;
  examId: number;
  studentId: number;
  subjectId: number;
  marksObtained: number;
  maxMarks: number;
  gradedBy: number;
}

export interface Homework {
  id: number;
  title: string;
  description: string;
  assignedBy: number;
  classId: number;
  dueDate: string;
  attachments: string[];
  createdAt: string;
}

export interface Submission {
  id: number;
  homeworkId: number;
  studentId: number;
  submittedAt: string;
  fileUrl: string;
  grade: string | null;
  remarks: string;
}

export interface Event {
  id: number;
  title: string;
  type: EventType;
  date: string;
  description: string;
  createdBy: number;
  participants: number[];
  photoUrls: string[];
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  targetRole: NotificationTargetRole;
  targetIds: number[];
  readBy: number[];
  createdAt: string;
  createdBy: number;
}

export interface AuditLog {
  id: number;
  actorId: number;
  action: string;
  entityType: string;
  entityId: number;
  timestamp: string;
  details: Record<string, unknown>;
}

export interface RefreshTokenRecord {
  id: number;
  userId: number;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface PasswordResetRecord {
  id: number;
  userId: number;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface AppSettings {
  schoolName: string;
  academicYear: string;
  holidays: string[];
  allowHomeworkSubmission: boolean;
  allowStaffRoleManagement: boolean;
}

export interface Database {
  users: User[];
  students: Student[];
  classes: SchoolClass[];
  subjects: Subject[];
  attendance: AttendanceRecord[];
  exams: Exam[];
  marks: Mark[];
  homeworks: Homework[];
  submissions: Submission[];
  events: Event[];
  notifications: Notification[];
  settings: AppSettings;
  auditLogs: AuditLog[];
  refreshTokens: RefreshTokenRecord[];
  passwordResets: PasswordResetRecord[];
}

export interface PublicUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface AuthenticatedUser extends PublicUser {
  studentId?: number;
}
