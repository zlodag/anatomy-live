import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
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
import { RestoreComponent } from './restore/restore.component';

const firebaseConfig = {
  apiKey: 'AIzaSyAnAVo8J_rGWUOpsqMn6e7KcHEEesjNLls',
  authDomain: 'anatomy-live.firebaseapp.com',
  databaseURL: 'https://anatomy-live.firebaseio.com',
  projectId: 'anatomy-live',
  storageBucket: 'anatomy-live.appspot.com',
  messagingSenderId: '385016421303'
};

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
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
    RestoreComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
