import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { RouterModule, Routes } from '@angular/router';

// import { TerminalModule } from 'primeng/terminal';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';

// import { TerminalModule } from 'primeng/terminal';

import { EditStateService } from './edit-state.service';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegionListComponent } from './region-list/region-list.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { FieldFilterPipe } from './field-filter.pipe';
import { AddStringComponent } from './add-string/add-string.component';
import { QuizTerminalComponent } from './quiz-terminal/quiz-terminal.component';
import { TerminalComponent } from './terminal/terminal.component';

const firebaseConfig = {
  apiKey: 'AIzaSyCNC0Rl6WPNd1qzTpyVchkyImJc1Fy4T54',
  authDomain: 'ranzcr-anatomy.firebaseapp.com',
  databaseURL: 'https://ranzcr-anatomy.firebaseio.com',
  projectId: 'ranzcr-anatomy',
  storageBucket: 'ranzcr-anatomy.appspot.com',
  messagingSenderId: '51391304946'
};

const appRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'quiz',
    component: QuizTerminalComponent,
  },
  {
    path: 'regions',
    children: [
      {
        path: '',
        component: RegionListComponent
      },
      {
        path: ':regionId',
        children: [
          {
            path: '',
            component: ItemListComponent
          },
          {
            path: ':itemId',
            component: ItemDetailComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    RegionListComponent,
    ItemListComponent,
    ItemDetailComponent,
    AddStringComponent,
    FieldFilterPipe,
    QuizTerminalComponent,
    TerminalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    // TerminalModule,
    ButtonModule,
    InputSwitchModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false })
  ],
  providers: [
    EditStateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
