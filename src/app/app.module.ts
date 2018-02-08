import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { RegionDetailComponent } from './region-detail/region-detail.component';
import { RegionListComponent } from './region-list/region-list.component';
import { RegionResolver } from './region-resolver.service';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { ItemListComponent } from './item-list/item-list.component';

const appRoutes: Routes = [
  {
    path: 'regions',
    children: [
      {
        path: '',
        component: RegionListComponent
      },
      {
        path: ':regionId',
        component: RegionDetailComponent,
        resolve: {
          region: RegionResolver
        },
        children: [
          {
            path: '',
            component: ItemListComponent,
          },
          {
            path: ':itemId',
            component: ItemDetailComponent
          }
        ]
      }
    ]
  },
  {
    path: '',
    redirectTo: 'regions',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    RegionDetailComponent,
    RegionListComponent,
    ItemDetailComponent,
    ItemListComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false })
  ],
  providers: [RegionResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
