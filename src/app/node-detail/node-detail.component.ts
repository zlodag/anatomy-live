import { Component } from '@angular/core';
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
  selector: 'app-node-detail',
  templateUrl: './node-detail.component.html',
})
export class NodeDetailComponent {

  constructor(public ownerService: OwnerService, private route: ActivatedRoute, private db: AngularFireDatabase) { }

  nodeName: Observable<string> = this.route.paramMap.switchMap(params => this.db.object<string>(
        this.db.database.ref('nodes').child(params.get('userId')).child(params.get('nodeId'))
      ).snapshotChanges()
    )
    .map(snap => snap.payload.val());

  nodes: Observable<Node[]> = this.route.paramMap
    .switchMap(params => {
      const thisNodeKey = params.get('nodeId');
      return this.db.list<string>(this.db.database.ref('nodes').child(params.get('userId')))
        .snapshotChanges()
        .map(action => action
            .filter(a => a.key !== thisNodeKey)
            .map(a => ({
              key: a.key,
              name: a.payload.val(),
            })));
    });

  selectedNode = '';

  newNodeName = '';

  selectedTo = true;

  private updateWithUserId(userId: string, thisNodeKey: string, otherNodeKey: string, to: boolean, add: boolean) {
    const value = add ? database.ServerValue.TIMESTAMP : null;
    const updateObj = {
      [`${to ? 'to' : 'from'}/${userId}/${thisNodeKey}/${otherNodeKey}`]: value,
      [`${to ? 'from' : 'to'}/${userId}/${otherNodeKey}/${thisNodeKey}`]: value,
    };
    this.db.database.ref().update(updateObj);
  }

  update(otherNodeKey: string, to: boolean, add: boolean) {
    this.route.paramMap.first().subscribe(params => this.updateWithUserId(
      params.get('userId'),
      params.get('nodeId'),
      otherNodeKey,
      to,
      add
    ));
  }

  linkToNew(newNodeName: string, to: boolean) {
    this.route.paramMap.first().subscribe(params => {
      const userId = params.get('userId');
      const thisNodeKey = params.get('nodeId');
      const newRef = this.db.database.ref('nodes').child(params.get('userId')).push();
      newRef.set(newNodeName).then(() => this.updateWithUserId(
        params.get('userId'),
        params.get('nodeId'),
        newRef.key,
        to,
        true
      ));
    });
    this.newNodeName = '';
  }

}
