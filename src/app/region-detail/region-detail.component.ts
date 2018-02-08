import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Item } from '../models';

@Component({
  selector: 'app-region-detail',
  templateUrl: './region-detail.component.html',
  styleUrls: ['./region-detail.component.css']
})
export class RegionDetailComponent implements OnInit {

  private itemsCollection: AngularFirestoreCollection<Item>;

  items: Observable<Item[]>;

  constructor(private readonly afs: AngularFirestore, private router: Router, public route: ActivatedRoute) { }

  ngOnInit() {
    this.itemsCollection = this.afs.collection<Item>('/items', ref => ref.where('region', '==', this.route.snapshot.paramMap.get('regionId')).orderBy('name'));
    this.items = this.itemsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Item;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

}
