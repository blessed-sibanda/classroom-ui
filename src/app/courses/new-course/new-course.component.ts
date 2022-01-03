import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImagePickerConf } from 'ngp-image-picker';
import { CourseService, ICourseData } from '../course.service';
import { take } from 'rxjs';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import { UiService } from 'src/app/common/ui.service';

@Component({
  selector: 'app-new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.scss'],
})
export class NewCourseComponent implements OnInit, OnDestroy {
  courseForm!: FormGroup;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  image: any | undefined | null;
  subs = new SubSink();

  imagePickerConf: ImagePickerConf = {
    borderRadius: '4px',
    language: 'en',
    width: '200px',
    height: '150px',
    hideDownloadBtn: true,
  };

  constructor(
    private formBuider: FormBuilder,
    private courseService: CourseService,
    private _ngZone: NgZone,
    private router: Router,
    private uiService: UiService
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  dataURLtoFile(dataurl: any, filename: string) {
    if (!dataurl) return null;
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  onImageChange(event: any) {
    let filename = `${Date.now()}${Math.floor(Math.random() * Date.now())}`;
    this.image = this.dataURLtoFile(event, filename);
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.courseForm = this.formBuider.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', [Validators.minLength(2)]],
    });
  }

  createCourse(submittedForm: FormGroup) {
    let courseData = submittedForm.value as ICourseData;
    courseData.file = this.image;
    this.subs.sink = this.courseService.createCourse(courseData).subscribe({
      next: (res) => {
        this.router.navigate(['/teach/courses']);
      },
      error: (err) => this.uiService.showToast(err.message),
    });
  }
}
