import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  Component,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { UiService } from 'src/app/common/ui.service';
import { SubSink } from 'subsink';
import { Course } from '../course';
import { CourseService, ILessonData } from '../course.service';

@Component({
  selector: 'app-new-lesson',
  templateUrl: './new-lesson.component.html',
  styleUrls: ['./new-lesson.component.scss'],
})
export class NewLessonComponent implements OnInit, OnDestroy {
  lessonForm!: FormGroup;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  subs = new SubSink();

  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private _ngZone: NgZone,
    private uiService: UiService,
    public dialogRef: MatDialogRef<NewLessonComponent>,
    @Inject(MAT_DIALOG_DATA) public course: Course
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  buildForm() {
    this.lessonForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      resourceUrl: ['', [Validators.pattern(/^(https?:\/\/|www).+\..+/)]],
    });
  }

  onBackClick(): void {
    this.dialogRef.close();
  }

  createLesson(submittedForm: FormGroup) {
    let lessonData = submittedForm.value as ILessonData;
    this.subs.sink = this.courseService
      .createLesson(this.course._id, lessonData)
      .subscribe({
        next: (res) => {
          this.uiService.showToast('Lesson created successfully', '', {
            duration: 1500,
          });
          this.dialogRef.close();
        },
        error: (err) => this.uiService.showToast(err.message),
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
