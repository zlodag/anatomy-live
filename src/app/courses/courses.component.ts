import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { OwnerService } from '../owner.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Node } from '../models';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
})
export class CoursesComponent implements OnInit {

  constructor(public ownerService: OwnerService, private route: ActivatedRoute, private db: AngularFireDatabase) { }

  ngOnInit() {
  }

  private nodeList = this.db.list<string>(this.db.database.ref('nodes').child(this.route.snapshot.paramMap.get('userId')), ref => ref.orderByValue());
  nodes: Observable<Node[]> = this.nodeList.snapshotChanges().map(action => action.map(a => ({
  	key: a.key,
  	name: a.payload.val(),
  })));

  add(name: string) {
  	this.nodeList.push(name);
  }

  update(nodeKey: string, name: string) {
    this.nodeList.set(nodeKey, name);
  }

  delete(nodeKey: string) {
    this.nodeList.remove(nodeKey).catch(error => {
      if (error.code === 'PERMISSION_DENIED') {
        alert('Node is still linked');
      }
    });
  }

}
