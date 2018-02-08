import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Item } from '../models';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {

  item: Observable<Item>;

  constructor(private readonly afs: AngularFirestore, public route: ActivatedRoute) { }

  ngOnInit() {
  	this.item = this.route.paramMap.switchMap(paramMap => this.afs.doc<Item>('/items/' + paramMap.get('itemId')).valueChanges());
  }

}
