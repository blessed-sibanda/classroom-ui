import { IUser, User } from '../user/user';

export interface ICourse {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  instructor: IUser;
  createdAt: string;
  published: boolean;
  category: string;
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
    public category = ''
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
      course.category
    );
  }

  static BuildMany(courses: ICourse[]) {
    return courses.map((c) => Course.Build(c));
  }
}
