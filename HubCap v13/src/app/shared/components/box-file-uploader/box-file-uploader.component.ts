declare var Box: any;
import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { StateService } from '../../services/state.service';
import { BoxService } from '../../services/box.service';

@Component({
  selector: 'app-box-file-uploader',
  templateUrl: './box-file-uploader.component.html',
  styleUrls: ['./box-file-uploader.component.scss']
})
export class BoxFileUploaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() settings: any = null;
  @Output() itemsUploaded = new EventEmitter<any>();

  dataMain: any = {};
  files: any[] = [];
  uploaderOpen = false;

  constructor(
    private state: StateService,
    private boxService: BoxService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (JSON.stringify(changes.settings.currentValue) !== JSON.stringify(changes.settings.previousValue)) {
      this.settings = changes.settings ? changes.settings.currentValue : this.settings;
    }
  }

  ngOnDestroy() {

  }

  deleteFile(idx: number) {
    this.files.splice(idx, 1);
    this.itemsUploaded.emit(this.files);
  }

  showContentUploader() {
    this.uploaderOpen = true;
    const container = '#box-content-uploader';
    const folder = this.settings!.boxParentId;
    const uploader = new Box.ContentUploader();
    const tokens = this.boxService.getBoxTokens();
    console.log(tokens);
    uploader.show(folder, tokens!.accessToken, {
      container: container
    });
    setTimeout(() => {
      uploader.hide();
      this.uploaderOpen = false;
    }, 100000);

    uploader.on('complete', (data: any) => {
      console.log(`All files successfully uploaded:`);
      this.files = data;
      uploader.hide();
      this.uploaderOpen = false;
      this.itemsUploaded.emit(data);
    });

    uploader.on('upload', (data: any) => {
      console.log(`Successfully uploaded file with name "${data.name}" to Box File ID ${data.id}`);
    });

    uploader.on('error', (data: any) => {
      console.log(`Error uploading file with name "${data.file.name}". The error was: "${data.error}"`);
    });

    uploader.on('close', (data: any) => {
      uploader.hide();
      this.uploaderOpen = false;
    });
  }

}
