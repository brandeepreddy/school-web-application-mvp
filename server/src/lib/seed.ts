import { hashSync } from 'bcryptjs';
import type { AttendanceRecord, AuditLog, Database, Exam, Homework, Mark, Notification, SchoolClass, Student, Subject, User } from '../types.js';

const createDate = (offsetDays = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date;
};

const toDateString = (date: Date) => date.toISOString().slice(0, 10);
const toDateTimeString = (date: Date) => date.toISOString();

export const createSeedDatabase = (): Database => {
  const now = new Date();
  const createdAt = toDateTimeString(createDate(-60));

  const users: User[] = [
    {
      id: 1,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'admin@school.com',
      passwordHash: hashSync('Admin123!', 10),
      role: 'admin',
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: 2,
      firstName: 'Brian',
      lastName: 'Thomas',
      email: 'staff@school.com',
      passwordHash: hashSync('Admin123!', 10),
      role: 'admin',
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: 3,
      firstName: 'Emma',
      lastName: 'Stone',
      email: 'emma@student.com',
      passwordHash: hashSync('Student123!', 10),
      role: 'student',
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: 4,
      firstName: 'Liam',
      lastName: 'Parker',
      email: 'liam@student.com',
      passwordHash: hashSync('Student123!', 10),
      role: 'student',
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: 5,
      firstName: 'Sophia',
      lastName: 'Reed',
      email: 'sophia@student.com',
      passwordHash: hashSync('Student123!', 10),
      role: 'student',
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: 6,
      firstName: 'Noah',
      lastName: 'Shaw',
      email: 'noah@student.com',
      passwordHash: hashSync('Student123!', 10),
      role: 'student',
      createdAt,
      updatedAt: createdAt,
    },
  ];

  const classes: SchoolClass[] = [
    { id: 1, name: 'Grade 10', section: 'A', year: now.getFullYear(), teacherId: 1 },
    { id: 2, name: 'Grade 9', section: 'B', year: now.getFullYear(), teacherId: 2 },
  ];

  const students: Student[] = [
    {
      id: 1,
      userId: 3,
      admissionNo: 'ADM-1001',
      classId: 1,
      dob: '2010-05-14',
      address: '12 Lake View, Hyderabad',
      parentContact: '+91-9000000001',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 2,
      userId: 4,
      admissionNo: 'ADM-1002',
      classId: 1,
      dob: '2010-09-06',
      address: '18 Jubilee Hills, Hyderabad',
      parentContact: '+91-9000000002',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 3,
      userId: 5,
      admissionNo: 'ADM-1003',
      classId: 1,
      dob: '2010-01-21',
      address: '44 Banjara Hills, Hyderabad',
      parentContact: '+91-9000000003',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 4,
      userId: 6,
      admissionNo: 'ADM-1004',
      classId: 2,
      dob: '2011-03-11',
      address: '55 Secunderabad, Hyderabad',
      parentContact: '+91-9000000004',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    },
  ];

  const subjects: Subject[] = [
    { id: 1, name: 'Mathematics', classId: 1, teacherId: 1 },
    { id: 2, name: 'Science', classId: 1, teacherId: 1 },
    { id: 3, name: 'English', classId: 1, teacherId: 1 },
    { id: 4, name: 'Social Studies', classId: 1, teacherId: 1 },
    { id: 5, name: 'Mathematics', classId: 2, teacherId: 2 },
    { id: 6, name: 'Science', classId: 2, teacherId: 2 },
  ];

  const exams: Exam[] = [
    {
      id: 1,
      name: 'Term 1 Examination',
      startDate: toDateString(createDate(-45)),
      endDate: toDateString(createDate(-40)),
      classId: 1,
    },
    {
      id: 2,
      name: 'Weekly Assessment',
      startDate: toDateString(createDate(-12)),
      endDate: toDateString(createDate(-11)),
      classId: 1,
    },
    {
      id: 3,
      name: 'Monthly Test',
      startDate: toDateString(createDate(-20)),
      endDate: toDateString(createDate(-19)),
      classId: 2,
    },
  ];

  const marks: Mark[] = [
    { id: 1, examId: 1, studentId: 1, subjectId: 1, marksObtained: 91, maxMarks: 100, gradedBy: 1 },
    { id: 2, examId: 1, studentId: 1, subjectId: 2, marksObtained: 88, maxMarks: 100, gradedBy: 1 },
    { id: 3, examId: 1, studentId: 1, subjectId: 3, marksObtained: 86, maxMarks: 100, gradedBy: 1 },
    { id: 4, examId: 2, studentId: 1, subjectId: 1, marksObtained: 94, maxMarks: 100, gradedBy: 1 },
    { id: 5, examId: 2, studentId: 1, subjectId: 2, marksObtained: 90, maxMarks: 100, gradedBy: 1 },
    { id: 6, examId: 1, studentId: 2, subjectId: 1, marksObtained: 76, maxMarks: 100, gradedBy: 1 },
    { id: 7, examId: 1, studentId: 2, subjectId: 2, marksObtained: 80, maxMarks: 100, gradedBy: 1 },
    { id: 8, examId: 2, studentId: 2, subjectId: 1, marksObtained: 84, maxMarks: 100, gradedBy: 1 },
    { id: 9, examId: 1, studentId: 3, subjectId: 1, marksObtained: 95, maxMarks: 100, gradedBy: 1 },
    { id: 10, examId: 1, studentId: 3, subjectId: 2, marksObtained: 93, maxMarks: 100, gradedBy: 1 },
    { id: 11, examId: 3, studentId: 4, subjectId: 5, marksObtained: 89, maxMarks: 100, gradedBy: 2 },
    { id: 12, examId: 3, studentId: 4, subjectId: 6, marksObtained: 87, maxMarks: 100, gradedBy: 2 },
  ];

  const attendance: AttendanceRecord[] = [];
  let attendanceId = 1;
  const pattern: Array<Record<number, AttendanceRecord['status']>> = [
    { 1: 'present', 2: 'present', 3: 'late', 4: 'present' },
    { 1: 'present', 2: 'absent', 3: 'present', 4: 'present' },
    { 1: 'present', 2: 'present', 3: 'present', 4: 'present' },
    { 1: 'late', 2: 'present', 3: 'present', 4: 'leave' },
    { 1: 'present', 2: 'present', 3: 'absent', 4: 'present' },
    { 1: 'present', 2: 'present', 3: 'present', 4: 'present' },
    { 1: 'present', 2: 'late', 3: 'present', 4: 'present' },
  ];

  pattern.forEach((dayPattern, index) => {
    const date = toDateString(createDate(index - 6));
    students.forEach((student) => {
      attendance.push({
        id: attendanceId++,
        studentId: student.id,
        date,
        status: dayPattern[student.id] ?? 'present',
        remarks: dayPattern[student.id] === 'absent' ? 'Parent informed' : '',
        recordedBy: student.classId === 1 ? 1 : 2,
      });
    });
  });

  const homeworks: Homework[] = [
    {
      id: 1,
      title: 'Math Worksheet 5',
      description: 'Complete algebra worksheet exercises 1 to 10.',
      assignedBy: 1,
      classId: 1,
      dueDate: toDateString(createDate(2)),
      attachments: ['https://example.com/files/math-worksheet-5.pdf'],
      createdAt: toDateTimeString(createDate(-2)),
    },
    {
      id: 2,
      title: 'Science Lab Reflection',
      description: 'Write a one-page reflection on the recent lab activity.',
      assignedBy: 1,
      classId: 1,
      dueDate: toDateString(createDate(4)),
      attachments: [],
      createdAt: toDateTimeString(createDate(-1)),
    },
    {
      id: 3,
      title: 'Fractions Practice',
      description: 'Solve the fractions worksheet and upload your notebook scan.',
      assignedBy: 2,
      classId: 2,
      dueDate: toDateString(createDate(1)),
      attachments: ['https://example.com/files/fractions-practice.pdf'],
      createdAt: toDateTimeString(createDate(-3)),
    },
  ];

  const notifications: Notification[] = [
    {
      id: 1,
      title: 'Exam Schedule Published',
      message: 'Term 2 examination dates have been published in the marks module.',
      targetRole: 'student',
      targetIds: [1, 2, 3, 4],
      readBy: [2],
      createdAt: toDateTimeString(createDate(-2)),
      createdBy: 1,
    },
    {
      id: 2,
      title: 'Staff Meeting',
      message: 'All class teachers are requested to join the weekly academic review meeting.',
      targetRole: 'admin',
      targetIds: [1, 2],
      readBy: [],
      createdAt: toDateTimeString(createDate(-1)),
      createdBy: 1,
    },
    {
      id: 3,
      title: 'Cultural Day Registration',
      message: 'Registrations for the cultural day performances close this Friday.',
      targetRole: 'all',
      targetIds: [],
      readBy: [1],
      createdAt: toDateTimeString(createDate(-3)),
      createdBy: 2,
    },
  ];

  const auditLogs: AuditLog[] = [
    {
      id: 1,
      actorId: 1,
      action: 'seed.initialize',
      entityType: 'system',
      entityId: 0,
      timestamp: toDateTimeString(now),
      details: { message: 'Seed data initialized for school web application MVP' },
    },
  ];

  return {
    users,
    students,
    classes,
    subjects,
    attendance,
    exams,
    marks,
    homeworks,
    submissions: [
      {
        id: 1,
        homeworkId: 1,
        studentId: 1,
        submittedAt: toDateTimeString(createDate(-1)),
        fileUrl: 'https://example.com/submissions/emma-math-worksheet-5.pdf',
        grade: 'A',
        remarks: 'Neat and complete submission.',
      },
      {
        id: 2,
        homeworkId: 1,
        studentId: 2,
        submittedAt: toDateTimeString(createDate(-1)),
        fileUrl: 'https://example.com/submissions/liam-math-worksheet-5.pdf',
        grade: null,
        remarks: 'Pending review',
      },
      {
        id: 3,
        homeworkId: 3,
        studentId: 4,
        submittedAt: toDateTimeString(createDate(-1)),
        fileUrl: 'https://example.com/submissions/noah-fractions-practice.pdf',
        grade: 'B+',
        remarks: 'Good effort',
      },
    ],
    events: [
      {
        id: 1,
        title: 'Cultural Day 2026',
        type: 'cultural',
        date: toDateString(createDate(6)),
        description: 'A full day of student performances, exhibitions, and art showcases.',
        createdBy: 1,
        participants: [1, 2, 3],
        photoUrls: [],
      },
      {
        id: 2,
        title: 'Annual Day Celebration',
        type: 'annual_day',
        date: toDateString(createDate(20)),
        description: 'Annual day stage performances and prize distribution ceremony.',
        createdBy: 2,
        participants: [1, 4],
        photoUrls: ['https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80'],
      },
    ],
    notifications,
    settings: {
      schoolName: 'Springfield Public School',
      academicYear: `${now.getFullYear()}-${now.getFullYear() + 1}`,
      holidays: [toDateString(createDate(12)), toDateString(createDate(30))],
      allowHomeworkSubmission: true,
      allowStaffRoleManagement: true,
    },
    auditLogs,
    refreshTokens: [],
    passwordResets: [],
  };
};
