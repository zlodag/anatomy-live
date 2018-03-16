import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BackupComponent, ServerBackupComponent, FileBackupComponent } from './backup/backup.component';
import { QuizComponent } from './quiz/quiz.component';
import { RegionListComponent } from './region-list/region-list.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { EditButtonComponent } from './edit-button/edit-button.component';
import { AddStringComponent } from './add-string/add-string.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { UserListComponent } from './user-list/user-list.component';
import { EditStringComponent } from './edit-string/edit-string.component';
import { ItemDetailListComponent } from './item-detail-list/item-detail-list.component';
import { OwnerComponent } from './owner/owner.component';
import { LoadingComponent } from './loading/loading.component';
import { DragDropUploadComponent } from './drag-drop-upload/drag-drop-upload.component';
import { DragDropUploadDirective } from './drag-drop-upload/drag-drop-upload.directive';
import { CoursesComponent } from './courses/courses.component';
import { NodeDetailComponent } from './node-detail/node-detail.component';
import { NodeLinkListComponent } from './node-link-list/node-link-list.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    BackupComponent,
    ServerBackupComponent,
    FileBackupComponent,
    RegionListComponent,
    ItemListComponent,
    ItemDetailComponent,
    QuizComponent,
    EditButtonComponent,
    BreadcrumbsComponent,
    AddStringComponent,
    UserListComponent,
    EditStringComponent,
    ItemDetailListComponent,
    OwnerComponent,
    LoadingComponent,
    DragDropUploadComponent,
    DragDropUploadDirective,
    CoursesComponent,
    NodeDetailComponent,
    NodeLinkListComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
