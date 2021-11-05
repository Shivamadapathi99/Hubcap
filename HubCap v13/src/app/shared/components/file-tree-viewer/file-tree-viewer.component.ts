import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { SafePipe } from '../../pipes/safe.pipe';
import { hasData } from '../../utilities/utilities';

import { BoxService } from '../../services/box.service';

import { BOX_URL } from '../../constants/constants';

@Component({
  selector: 'app-file-tree-viewer',
  templateUrl: './file-tree-viewer.component.html',
  styleUrls: ['./file-tree-viewer.component.scss']
})
export class FileTreeViewerComponent implements OnInit, OnChanges {

  @Input() settings: any = null;
  @Output() previewDocument = new EventEmitter<any>();

  editedFile: any = null;
  list: any[] = [];
  loadingFolderData = false;
  selectedFolder: string = '';
  selectedFolderResult: any | null;

  // Subscriptions
  putBoxFileNameUpdateSub: Subscription | null = null;

  constructor(
    private boxService: BoxService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (JSON.stringify(changes.settings.currentValue) !== JSON.stringify(changes.settings.previousValue)) {
      this.settings = changes.settings ? changes.settings.currentValue : this.settings;
      if (this.list !== this.settings.data && hasData(this.settings.data) === true) {
        this.list = this.settings.data;
        this.initList();
      }
    }
  }

  getFolderData(id: string) {
    this.loadingFolderData = true;
    this.boxService.GetBoxFolder(id).subscribe(response => {
      this.loadingFolderData = false;
      if (hasData(response) === true) {
        this.list = response.entries;
        this.initList();
      }
    });
  }

  initList() {
    this.list.forEach(item => {
      item.open = false;
      item.children = [];
    });
  }

  loadChildren(item: any) {
    if (hasData(this.settings.openFileItem) === true) {
      this.settings.openFileItem.preview = false;
    }
    if (this.loadingFolderData === false) {
      let url = '';
      if (item.type === 'folder') {
        this.selectedFolder = item.id;
        this.searchItem('id', this.list);
        if (hasData(this.selectedFolder) === true) {
          this.selectedFolderResult.open = !this.selectedFolderResult.open;
          this.loadingFolderData = true;
          this.boxService.GetBoxFolder(item.id).subscribe(response => {
            this.loadingFolderData = false;
            if (response.entries.length > 0) {
              this.selectedFolderResult.children = response.entries;
            } else {
              url = `${BOX_URL}folder/${item.id}`;
              window.open(url, '_blank');
            }
          });
        }
      }
      if (item.type === 'file') {
        this.settings.openFileItem = item;
        this.settings.openFileItem.preview = true;
        this.previewDocument.emit(this.settings.openFileItem);
      }
      if (item.type === 'web_link') {
        window.open(item.url, '_blank');
      }
    }
  }

  openFile(id: string) {
    const url = `${BOX_URL}file/${id}`;
    window.open(url, '_blank');
  }

  openRenameFile(item: any) {
    this.editedFile = item;
  }

  renameFile(data: any) {
    this.editedFile.name = data.fileName;
    const submitData: any = {
      name: data.fileName
    };
    this.putBoxFileNameUpdateSub = this.boxService.PutBoxFileNameUpdate(this.editedFile.id, submitData, this.boxService.getBoxTokens()).subscribe(response => {
      this.editedFile = null;
    });
  }

  searchItem(keyName: string, item: any) {
    if (hasData(item) === true) {
      Object.keys(item).forEach((key) => {
        if (typeof item[key] === 'object') {
          this.searchItem(keyName, item[key]);
        }
        if (
          typeof item[key] === 'string' &&
          key === keyName &&
          item[key] === this.selectedFolder
        ) {
          this.selectedFolderResult = item;
        }
      });
    }
  }

}
