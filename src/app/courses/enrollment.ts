import { IUser } from '../user/user';
import { ICourse, ILesson } from './course';

export interface ILessonStatus {
  _id: string;
  lesson: ILesson;
  complete: boolean;
}

export interface IEnrollment {
  _id: string;
  course: ICourse;
  student: IUser;
  lessonStatus: ILessonStatus[];
}

export class Enrollment implements IEnrollment {
  constructor(
    public _id = '',
    public course: ICourse,
    public student: IUser,
    public lessonStatus: ILessonStatus[]
  ) {}

  static Build(enrollment: IEnrollment): Enrollment {
    return new Enrollment(
      enrollment._id,
      enrollment.course,
      enrollment.student,
      enrollment.lessonStatus
    );
  }

  static BuildMany(enrollments: IEnrollment[]): Enrollment[] {
    return enrollments.map(Enrollment.Build);
  }
}
