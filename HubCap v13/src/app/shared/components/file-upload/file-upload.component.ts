import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy, OnInit, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { hasData } from '../../utilities/utilities';

import { BoxService } from '../../services/box.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, OnChanges, OnDestroy {

  @Input() settings = null;
  @Input() showUploadButton = false;
  @Output() formReady = new EventEmitter<FormGroup>();
  @Output() itemEdited = new EventEmitter<any>();
  @Output() filesUploaded = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput?: ElementRef;

  // tslint:disable-next-line:max-line-length
  acceptedFileTypes = '.doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .rtf, .msg, .bmp, .csv, .gif, .jpg, .jpeg, .png, .tif, .tiff, .txt, .zip, .7z, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/pdf, application/rtf, application/vnd.ms-outlook, image/bmp, text/csv, image/gif, image/jpeg, image/png, image/tiff, text/plain, application/zip, application/x-7z-compressed';
  errorLog = [];
  files: any[] = [];
  form: FormGroup = new FormGroup({});
  savedFileName = null;

  // Subscriptions
  formChangesSub: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private boxService: BoxService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (JSON.stringify(changes.settings.currentValue) !== JSON.stringify(changes.settings.previousValue)) {
      this.settings = changes.settings ? changes.settings.currentValue : this.settings;
      this.initForm();
    }
  }

  ngOnDestroy() {
    if (this.formChangesSub && !this.formChangesSub.closed) {
      this.formChangesSub.unsubscribe();
    }
  }

  deleteFile(idx: number) {
    this.files.splice(idx, 1);
    if (this.files.length === 0) {
      this.form.get('filesData')!.setValue(null);
    }
    this.errorLog = [];
    this.itemEdited.emit(
      {
        files: this.files
      });
  }

  initForm() {
    const formGroup = {
      filesData: [null],
      formName: 'fileUploadForm',
      type: 'fileUpload'
    };

    this.form = this.fb.group(formGroup);

    this.formChangesSub = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe(x => {
      });
  }

  onSelectFile($event: any) {
    // this.files = [];
    this.errorLog = [];
    if ($event.target.files && $event.target.files.length > 0) {
      const filesAmount = $event.target.files.length;
      const files = hasData($event.target.files) === true ? $event.target.files : [];
      for (let i = 0; i < filesAmount; i++) {

        const obj = files[i];

        const re = /(?:\.([^.]+))?$/;
        const ext = re.exec($event.target.files[i].name)![1];
        if (this.validateFile(files[i].name, ext, files[i].size) === true) {
          this.files.push(obj);
        }
      }
      this.form.get('filesData')!.setValue(this.files);
      this.fileInput!.nativeElement.value = null;
      this.resetSavedFile();
      this.itemEdited.emit(
        {
          files: this.files
        });
    }
  }

  resetSavedFile() {
    this.savedFileName = null;
  }

  uploadDocuments() {
    const files = this.form.get('filesData')!.value;
    if (hasData(files) === true && files.length > 0) {
      this.boxService.uploadDocuments(files).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * event.loaded / event.total!);
            break;
          case HttpEventType.Response:
            this.itemEdited.emit(
              {
                files: this.files
              });
            setTimeout(() => {
              this.form.get('filesData')!.setValue(null);
              this.errorLog = [];
              this.files = [];
              this.filesUploaded.emit(
                {
                  value: true
                });
            }, 1000);

            break;
        }
      });
    }
  }

  validateFile(fileName: string, ext: string, size: any) {
    let isValid = true;
    ext = ext.toLowerCase();
    if (this.acceptedFileTypes.includes(ext) === false && hasData(ext) === true) {
      isValid = false;
      // this.errorLog.push(`File type not allowed on ${fileName} and was not added.`);
    }
    if (hasData(ext) === true && size >= 30000000) {
      isValid = false;
      // this.errorLog.push(`File size has exceeded max size on ${fileName} and was not added.`);
    }
    return isValid;
  }

}
