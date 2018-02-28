import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
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
import { UserComponent } from './user/user.component';
import { DeleteItemComponent } from './delete-item/delete-item.component';

const firebaseConfig = {
  apiKey: 'AIzaSyCNC0Rl6WPNd1qzTpyVchkyImJc1Fy4T54',
  authDomain: 'ranzcr-anatomy.firebaseapp.com',
  databaseURL: 'https://ranzcr-anatomy.firebaseio.com',
  projectId: 'ranzcr-anatomy',
  storageBucket: 'ranzcr-anatomy.appspot.com',
  messagingSenderId: '51391304946'
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
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
    UserComponent,
    DeleteItemComponent,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
