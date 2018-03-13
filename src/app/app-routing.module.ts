import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QuizComponent } from './quiz/quiz.component';
import { OwnerComponent } from './owner/owner.component';
import { ServerBackupComponent, FileBackupComponent } from './backup/backup.component';
import { RegionListComponent } from './region-list/region-list.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { UserNameResolver, RegionNameResolver, ItemNameResolver, ServerBackupResolver } from './resolvers.service';

const appRoutes: Routes = [
  {
    path: '',
    component: UserListComponent
  },
  {
    path: ':userId',
    component: OwnerComponent,
    resolve: {
      userName: UserNameResolver
    },
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'server-backup',
        component: ServerBackupComponent,
        resolve: {
          serverBackup: ServerBackupResolver
        }
      },
      {
        path: 'file-backup',
        component: FileBackupComponent,
        data: {
          fileBackup: true
        }
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
            resolve: {
              regionName: RegionNameResolver
            },
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
                resolve: {
                  itemName: ItemNameResolver
                },
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
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false, paramsInheritanceStrategy: 'always' }
    )
  ],
  providers: [
    UserNameResolver,
    RegionNameResolver,
    ItemNameResolver,
    ServerBackupResolver,
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
