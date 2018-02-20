import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegionListComponent } from './region-list/region-list.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { DetailFieldFilterPipe, SubItemsDoneFilter } from './detail-field-filter.pipe';
import { AddStringComponent } from './add-string/add-string.component';
import { QuizComponent } from './quiz/quiz.component';
import { EditStateService } from './edit-state.service';
import { EditButtonComponent } from './edit-button/edit-button.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

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
    component: QuizComponent,
  },
  {
    path: 'regions',
    data: {
      regions: true
    },
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
            path: 'quiz',
            component: QuizComponent
          },
          {
            path: ':itemId',
            children : [
              {
                path: '',
                component: ItemDetailComponent
              },
              {
                path: 'quiz',
                component: QuizComponent
              }
            ]
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
    DetailFieldFilterPipe,
    SubItemsDoneFilter,
    QuizComponent,
    EditButtonComponent,
    BreadcrumbsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    // ButtonModule,
    // InputSwitchModule,
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
