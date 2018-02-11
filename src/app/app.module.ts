import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { RegionDetailComponent } from './region-detail/region-detail.component';
import { RegionListComponent } from './region-list/region-list.component';
import { RegionListResolver, ItemListResolver } from './resolvers.service';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { ItemListComponent } from './item-list/item-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegionComponent } from './region/region.component';
import { RegionsComponent } from './regions/regions.component';
import { ItemComponent } from './item/item.component';
import { FieldFilterPipe } from './field-filter.pipe';
import { AddStringComponent } from './add-string/add-string.component';

const appRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'regions',
    component: RegionsComponent,
    resolve: {
      regions: RegionListResolver
    },
    children: [
      {
        path: '',
        component: RegionListComponent
      },
      {
        path: ':regionId',
        component: RegionComponent,
        resolve: {
          items: ItemListResolver
        },
        children: [
          {
            path: '',
            component: ItemListComponent
          },
          {
            path: ':itemId',
            component: ItemComponent
          }
        ]
      }
    ]
  }
  // {
  //   path: '',
  //   redirectTo: 'regions',
  //   pathMatch: 'full'
  // }
];

@NgModule({
  declarations: [
    AppComponent,
    RegionDetailComponent,
    RegionListComponent,
    ItemDetailComponent,
    ItemListComponent,
    DashboardComponent,
    RegionComponent,
    RegionsComponent,
    ItemComponent,
    FieldFilterPipe,
    AddStringComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false })
  ],
  providers: [
    RegionListResolver,
    ItemListResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
