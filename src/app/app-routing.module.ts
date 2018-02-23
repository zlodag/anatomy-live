import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthedComponent } from './authed/authed.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QuizComponent } from './quiz/quiz.component';
import { RegionListComponent } from './region-list/region-list.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: ':uid',
    component: AuthedComponent,
    canActivateChild: [AuthGuard],
    children: [
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
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    )
  ],
  providers: [
    AuthGuard
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}