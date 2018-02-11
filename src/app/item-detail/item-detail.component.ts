import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {

  constructor(public route: ActivatedRoute) { }

  ngOnInit() {
  	// this.item = this.route.paramMap.switchMap(paramMap => this.afs.doc<Details>('/details/' + paramMap.get('itemId')).valueChanges());
  	// this.route.paramMap.switchMap(paramMap => this.afs.doc<Item>('/items/' + paramMap.get('itemId')).ref.get()).subscribe(snap => {
  	// 	console.log(snap.data());
  	// });
  }


}
