import { Component, Inject, EventEmitter, Input, Output, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { hasData } from '../../utilities/utilities';

@Component({
  selector: 'app-file-search-recent-files',
  templateUrl: './file-search-recent-files.component.html',
  styleUrls: ['./file-search-recent-files.component.scss']
})
export class FileSearchRecentFilesComponent implements OnInit, OnChanges {

  @Input() settings: any = null;
  @Output() itemsSelected = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (JSON.stringify(changes.settings.currentValue) !== JSON.stringify(changes.settings.previousValue)) {
      this.settings = changes.settings ? changes.settings.currentValue : this.settings;
    }
  }

}
