import { IUser, User } from '../user/user';

export interface ILesson {
  _id: string;
  title: string;
  content: string;
  resourceUrl?: string;
}

export interface ICourse {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  instructor: IUser;
  createdAt: string;
  published: boolean;
  category: string;
  lessons: ILesson[];
}

export class Course implements ICourse {
  constructor(
    public _id = '',
    public name = '',
    public description = '',
    public imageUrl = '',
    public instructor = new User(),
    public createdAt = '',
    public published = false,
    public category = '',
    public lessons: ILesson[] = []
  ) {}

  static Build(course: ICourse) {
    return new Course(
      course._id,
      course.name,
      course.description,
      course.imageUrl,
      course.instructor,
      course.createdAt,
      course.published,
      course.category,
      course.lessons
    );
  }

  static BuildMany(courses: ICourse[]) {
    return courses.map((c) => Course.Build(c));
  }
}
