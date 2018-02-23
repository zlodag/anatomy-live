import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import {
  AuthMethods,
  AuthProvider,
  AuthProviderWithCustomConfig,
  CredentialHelper,
  FirebaseUIAuthConfig,
  FirebaseUIModule,
} from 'firebaseui-angular';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthedComponent } from './authed/authed.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QuizComponent } from './quiz/quiz.component';
import { RegionListComponent } from './region-list/region-list.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { EditButtonComponent } from './edit-button/edit-button.component';
import { AddStringComponent } from './add-string/add-string.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { DetailFieldFilterPipe } from './detail-field-filter.pipe';
import { EditStateService } from './edit-state.service';

const firebaseUiAuthConfig: FirebaseUIAuthConfig = {
  providers: [
    AuthProvider.Google,
    // facebookCustomConfig,
    // AuthProvider.Twitter,
    AuthProvider.Github,
    // AuthProvider.Password,
    // AuthProvider.Phone
  ],
  method: AuthMethods.Popup,
  // tos: '<your-tos-link>',
  credentialHelper: CredentialHelper.AccountChooser
};

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    AngularFirestoreModule,
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    RegionListComponent,
    ItemListComponent,
    ItemDetailComponent,
    QuizComponent,
    LoginComponent,
    AuthedComponent,
    EditButtonComponent,
    BreadcrumbsComponent,
    AddStringComponent,
    DetailFieldFilterPipe,
  ],
  providers: [
    EditStateService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
