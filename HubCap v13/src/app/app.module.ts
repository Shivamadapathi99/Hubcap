import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// 3rd Party Libraries

import { NgApexchartsModule } from 'ng-apexcharts';

// Constants

// import { AUTH_SETTINGS, OKTA_SETTINGS } from './shared/constants/constants';
import { AUTH_SETTINGS, OKTA_SETTINGS } from '../environments/environment'

// Routing

import { AppRoutingModule } from './app-routing.module';

// Angular Material

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

// Components

import { AppComponent } from './app.component';
import { BoxDocumentPreviewComponent } from './shared/components/box-document-preview/box-document-preview.component';
import { BoxEditFilenameComponent } from './shared/components/box-edit-filename/box-edit-filename.component';
import { BoxFileUploaderComponent } from './shared/components/box-file-uploader/box-file-uploader.component';
import { BoxLoginManagerComponent } from './shared/components/box-login-manager/box-login-manager.component';
import { BoxViewerComponent } from './shared/components/box-viewer/box-viewer.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { CascadingSelectFiltersComponent } from './shared/components/cascading-select-filters/cascading-select-filters.component';
import { CreateWorkComponent } from './shared/components/create-work/create-work.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { DashboardTempComponent } from './shared/components/dashboard-temp/dashboard-temp.component';
import { DynamicFormComponent } from './shared/components/dynamic-form/dynamic-form.component';
import { FileSearchComponent } from './shared/components/file-search/file-search.component';
import { FileSearchFormComponent } from './shared/components/file-search-form/file-search-form.component';
import { FileSearchRecentFilesComponent } from './shared/components/file-search-recent-files/file-search-recent-files.component';
import { FileSearchResultItemComponent } from './shared/components/file-search-result-item/file-search-result-item.component';
import { FileTreeViewerComponent } from './shared/components/file-tree-viewer/file-tree-viewer.component';
import { FileUploadComponent } from './shared/components/file-upload/file-upload.component';
import { MainComponent } from './shared/components/main/main.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { RelatedTasksListComponent } from './shared/components/related-tasks-list/related-tasks-list.component';
import { TestingComponent } from './shared/components/testing/testing.component';
import { WorkItemEditComponent } from './shared/components/work-item-edit/work-item-edit.component';
import { WorkItemHistoryComponent } from './shared/components/work-item-history/work-item-history.component';
import { WorkQueueComponent } from './shared/components/work-queue/work-queue.component';
import { CallbackComponent } from './shared/callback/callback.component';


// Services

import { AuthService } from './shared/services/auth.service';
import { BoxService } from './shared/services/box.service';
import { CookieService } from 'ngx-cookie-service';
import { LocalDataService } from './shared/services/local-data.service';
import { LocalStorageService } from './shared/services/local-storage.service';
import { StateService } from './shared/services/state.service';
import { WorkQueueService } from './shared/services/work-queue.service';


// Interceptors

import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { BoxApiInterceptor } from './shared/interceptors/box-api.interceptor';

import { SafePipe } from './shared/pipes/safe.pipe';
import { OktaAuthService } from './shared/services/okta.service';

import { OktaInterceptor } from './shared/interceptors/okta.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    BoxDocumentPreviewComponent,
    BoxEditFilenameComponent,
    BoxFileUploaderComponent,
    BoxLoginManagerComponent,
    BoxViewerComponent,
    ButtonComponent,
    CascadingSelectFiltersComponent,
    CreateWorkComponent,
    DashboardComponent,
    DashboardTempComponent,
    DynamicFormComponent,
    FileSearchComponent,
    FileSearchFormComponent,
    FileSearchRecentFilesComponent,
    FileSearchResultItemComponent,
    FileTreeViewerComponent,
    FileUploadComponent,
    MainComponent,
    NotFoundComponent,
    RelatedTasksListComponent,
    TestingComponent,
    WorkItemEditComponent,
    WorkItemHistoryComponent,
    WorkQueueComponent,
    SafePipe,
    CallbackComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    NgApexchartsModule,
    RouterModule
  ],
  exports: [
    BoxDocumentPreviewComponent,
    BoxEditFilenameComponent,
    BoxFileUploaderComponent,
    BoxLoginManagerComponent,
    BoxViewerComponent,
    BrowserAnimationsModule,
    ButtonComponent,
    CascadingSelectFiltersComponent,
    CreateWorkComponent,
    DashboardComponent,
    DashboardTempComponent,
    DynamicFormComponent,
    FileSearchComponent,
    FileSearchFormComponent,
    FileSearchRecentFilesComponent,
    FileSearchResultItemComponent,
    FileTreeViewerComponent,
    FileUploadComponent,
    FormsModule,
    ReactiveFormsModule,
    RelatedTasksListComponent,
    MainComponent,
    MatAutocompleteModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    NotFoundComponent,
    RouterModule,
    TestingComponent,
    WorkItemEditComponent,
    WorkItemHistoryComponent,
    WorkQueueComponent
  ],
  providers: [
    { provide: 'AUTH', useValue: AUTH_SETTINGS.auth },
    { provide: 'OKTA_CONFIG', useValue: OKTA_SETTINGS },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BoxApiInterceptor,
      multi: true
    },
    AuthService,
    BoxService,
    CookieService,
    LocalDataService,
    LocalStorageService,
    StateService,
    WorkQueueService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
