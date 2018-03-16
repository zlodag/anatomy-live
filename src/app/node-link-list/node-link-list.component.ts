import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { OwnerService } from '../owner.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';
import { database } from 'firebase';
import { Node, LinkNode } from '../models';

@Component({
  selector: 'app-node-link-list',
  templateUrl: './node-link-list.component.html',
})
export class NodeLinkListComponent {

  constructor(public ownerService: OwnerService, private route: ActivatedRoute, private db: AngularFireDatabase) { }

  @Input() to: boolean;

  @Output() delete = new EventEmitter<string>();

  nodes: Observable<LinkNode[]> = this.route.paramMap.switchMap(params => {
    const userId = params.get('userId');
    const thisNodeKey = params.get('nodeId');
    return this.db
      .list(this.db.database.ref(this.to ? 'to' : 'from').child(userId).child(thisNodeKey), ref => ref.orderByValue())
      .snapshotChanges()
      .switchMap(actions => Promise.all(actions.map(a =>
        this.db.database.ref('nodes').child(userId).child(a.key).once('value').then(snap => ({
          key: a.key,
          name: snap.val(),
          timestamp: a.payload.val(),
        }))
      )));
  });

  swap(node1: LinkNode, node2: LinkNode) {
    this.route.paramMap.first().subscribe(params => {
      this.db.database.ref(this.to ? 'to' : 'from')
        .child(params.get('userId'))
        .child(params.get('nodeId'))
        .update({
          [node1.key]: node2.timestamp,
          [node2.key]: node1.timestamp,
        });
    });
  }

}
