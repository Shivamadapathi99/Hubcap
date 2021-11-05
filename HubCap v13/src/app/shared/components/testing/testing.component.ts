declare var Box: any;

import { Component, OnInit } from '@angular/core';

import { getMappedQueueTableData } from '../../utilities/utilities';

import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {

  dataMain: any = {};

  constructor(
    private state: StateService
  ) { }

  async ngOnInit() {
    this.state.dataMain.subscribe(result => {
      this.dataMain = result;
    });
  }

  fileUploadComplete($event: any) {
    console.log($event);
  }

  showOpenWith() {
    const container = '#box-open-with';
    const fileId = '872183792112';
    const contentOpenWith = new Box.ContentOpenWith();
    contentOpenWith.show(fileId, this.dataMain.boxToken.accessToken, {
      container: container
    });
  }

  showContentExplorer() {
    const container = '#box-content-explorer';
    const folder = '121937861336';
    const contentExplorer = new Box.ContentExplorer();
    contentExplorer.show(folder, this.dataMain.boxToken.accessToken, {
      container: container,
      contentPreviewProps: {
        contentOpenWithProps: {
          show: true
        }
      }
    });
  }

  showContentUploader() {
    const container = '#box-content-uploader';
    const folder = '121937861336';
    const uploader = new Box.ContentUploader();
    uploader.show(folder, this.dataMain.boxToken.accessToken, {
      container: container
    });
    // Log upload data to console
    uploader.on('complete', (data: any) => {
      console.log(`All files successfully uploaded: ${JSON.stringify(data)}`);
    });

    uploader.on('upload', (data: any) => {
      console.log(`Successfully uploaded file with name "${data.name}" to Box File ID ${data.id}`);
    });

    uploader.on('error', (data: any) => {
      console.log(`Error uploading file with name "${data.file.name}". The error was: "${data.error}"`);
    });
  }

}
