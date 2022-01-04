import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagePickerConf } from 'ngp-image-picker';
import { take } from 'rxjs';
import { UiService } from 'src/app/common/ui.service';
import { SubSink } from 'subsink';
import { Course, ILesson } from '../course';
import { CourseService, ICourseData } from '../course.service';
import { AuthService } from '../../auth/auth.service';
import { UrlValidation } from 'src/app/common/validations';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { dataURLtoFile } from '../../common/common';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss'],
})
export class EditCourseComponent implements OnInit, OnDestroy {
  courseForm!: FormGroup;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  image: any | undefined | null;
  subs = new SubSink();
  course!: Course;
  lessons!: ILesson[];

  imagePickerConf: ImagePickerConf = {
    borderRadius: '0px',
    language: 'en',
    width: '210px',
    height: '180px',
    hideDownloadBtn: true,
  };

  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private _ngZone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private uiService: UiService,
    private authService: AuthService
  ) {}

  onImageChange(event: any) {
    let filename = `${Date.now()}${Math.floor(Math.random() * Date.now())}`;
    this.image = dataURLtoFile(event, filename);
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  drop(event: CdkDragDrop<ILesson[]>) {
    moveItemInArray(
      this.lessonsArray.controls,
      event.previousIndex,
      event.currentIndex
    );

    let temp = this.lessons[event.currentIndex];
    this.lessons[event.currentIndex] = this.lessons[event.previousIndex];
    this.lessons[event.previousIndex] = temp;

    this.lessons = this.lessons.map((item, i) => {
      item.order = i;
      return item;
    });
  }

  ngOnInit(): void {
    this.course = this.route.snapshot.data['course'];
    this.lessons = this.course.lessons.sort((a, b) => a.order - b.order);

    // for lessons without orders
    this.lessons = this.course.lessons.map((lesson, i) => {
      if (!lesson.order) lesson.order = i;
      return lesson;
    });
    this.buildForm();
    this.subs.add(
      this.authService.getCurrentUser().subscribe({
        next: (u) => {
          if (u._id != this.course.instructor._id) {
            this.uiService.showToast(
              'Only the course owner is allowed to edit a course'
            );
            this.router.navigate([`/course/${this.course._id}`]);
          }
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  get lessonsArray(): FormArray {
    return this.courseForm.get('lessons') as FormArray;
  }

  buildForm() {
    this.courseForm = this.formBuilder.group({
      name: [this.course.name, [Validators.required, Validators.minLength(3)]],
      description: [
        this.course.description,
        [Validators.required, Validators.minLength(3)],
      ],
      category: [this.course.category, [Validators.minLength(2)]],
      lessons: this.formBuilder.array(this.buildLessonsFormArray(this.lessons)),
    });
  }

  private buildLessonsFormArray(lessons: ILesson[]) {
    let groups: FormGroup[] = [];
    lessons.forEach((l) => groups.push(this.buildLessonFormControl(l)));
    return groups;
  }

  private buildLessonFormControl(lesson: ILesson) {
    return this.formBuilder.group({
      _id: [lesson._id, []],
      title: [lesson.title, [Validators.required, Validators.minLength(3)]],
      content: [
        lesson.content,
        [Validators.required, Validators.minLength(10)],
      ],
      resourceUrl: [lesson.resourceUrl, UrlValidation],
      order: [lesson.order, [Validators.required]],
    });
  }

  updateCourse(submittedForm: FormGroup) {
    let courseData = submittedForm.value as ICourseData;
    let lessons = courseData.lessons?.map((l) => {
      this.lessons.forEach((lesson) => {
        if (l._id === lesson._id) {
          l.order = lesson.order;
        }
      });
      return l;
    });
    courseData = { ...courseData, lessons };
    courseData.file = this.image;
    this.subs.add(
      this.courseService.updateCourse(this.course._id, courseData).subscribe({
        next: (res) => {
          this.uiService.showToast('Course updated successfully!');
          this.router.navigate([`course/${this.course._id}`]);
        },
        error: (err) => this.uiService.showToast(err.message),
      })
    );
  }
}
