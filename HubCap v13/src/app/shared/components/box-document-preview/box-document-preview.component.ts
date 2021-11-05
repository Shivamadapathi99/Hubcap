import { Component, Input, Output, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { BOX_URL } from '../../constants/constants';
import { BoxService } from '../../services/box.service';

@Component({
  selector: 'app-box-document-preview',
  templateUrl: './box-document-preview.component.html',
  styleUrls: ['./box-document-preview.component.scss']
})
export class BoxDocumentPreviewComponent implements OnInit, OnDestroy {

  @Input() settings: any = null;
  @Output() closeDocument = new EventEmitter<any>();

  boxFileEmbedCode: string | null = null;
  documentDetails = {
    name: ''
  };
  openDocumentNum = 0;
  openFileItem: any = null;

  // Subscriptions
  getDocumentDetailsSub: Subscription | null = null;
  loadDocumentSub: Subscription | null = null;

  constructor(
    private boxService: BoxService
  ) { }

  ngOnInit(): void {
    this.loadDocument(this.settings.data[this.openDocumentNum]);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (JSON.stringify(changes.settings.currentValue) !== JSON.stringify(changes.settings.previousValue)) {
      this.settings = changes.settings ? changes.settings.currentValue : this.settings;
      this.openDocumentNum = 0;
      this.loadDocument(this.settings.data[this.openDocumentNum]);
    }
  }

  ngOnDestroy() {
    if (this.getDocumentDetailsSub && !this.getDocumentDetailsSub.closed) {
      this.getDocumentDetailsSub.unsubscribe();
    }
    if (this.loadDocumentSub && !this.loadDocumentSub.closed) {
      this.loadDocumentSub.unsubscribe();
    }
  }

  advanceDocument(direction: string) {
    if (direction === 'previous') {
      this.openDocumentNum = this.openDocumentNum > 0 ? this.openDocumentNum - 1 : 0;
    }
    if (direction === 'next') {
      this.openDocumentNum = this.openDocumentNum < (this.settings.data.length - 1) ? this.openDocumentNum + 1 : (this.settings.data.length - 1);
    }
    this.loadDocument(this.settings.data[this.openDocumentNum]);
  }

  close() {
    this.closeDocument.emit();
  }

  getDocumentDetails(id: string) {
    this.getDocumentDetailsSub = this.boxService.GetBoxFileInfo(id).subscribe(response => {
      this.documentDetails = response;
    });
  }

  loadDocument(item: any) {
    this.getDocumentDetails(item.id);
    this.loadDocumentSub = this.boxService.GetBoxExpiringEmbedLink(item.id).subscribe(response => {
      this.openFileItem = item;
      this.boxFileEmbedCode = `${response.expiring_embed_link.url}?showAnnotations=true&showDownload=true`;
    });
  }

  openInBox(id: number) {
    const url = `${BOX_URL}file/${id}`;
    window.open(url, '_blank');
  }

}
