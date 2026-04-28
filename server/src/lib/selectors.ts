import type { AuthenticatedUser, Database, PublicUser, SchoolClass, Student, User } from '../types.js';

export const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
});

export const getStudentByUserId = (db: Database, userId: number): Student | undefined =>
  db.students.find((student) => student.userId === userId);

export const getAssignedClasses = (db: Database, userId: number): SchoolClass[] =>
  db.classes.filter((schoolClass) => schoolClass.teacherId === userId);

export const getAuthenticatedUserFromDb = (db: Database, userId: number): AuthenticatedUser | undefined => {
  const user = db.users.find((item) => item.id === userId);
  if (!user) {
    return undefined;
  }

  const publicUser = toPublicUser(user);
  const student = user.role === 'student' ? getStudentByUserId(db, user.id) : undefined;

  return {
    ...publicUser,
    studentId: student?.id,
  };
};

export const buildSessionUser = (db: Database, userId: number) => {
  const user = db.users.find((item) => item.id === userId);
  if (!user) {
    return null;
  }

  return {
    ...toPublicUser(user),
    student: user.role === 'student' ? getStudentByUserId(db, user.id) ?? null : null,
    assignedClasses: user.role === 'admin' ? getAssignedClasses(db, user.id) : [],
  };
};
