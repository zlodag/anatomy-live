import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class EditStateService
 implements OnDestroy 
 {

  constructor(
    auth: AngularFireAuth,
    route: ActivatedRoute
    ) {
    const ownerId = route.snapshot.paramMap.get('userId');
  	this.subscription = auth.authState.subscribe(user => {
      this._mine = (user && user.uid === ownerId);
      if (this.edit.getValue() && !this._mine) {
        this.edit.next(false);
      }
    });
  }
  private _mine: boolean = false;
  public edit: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public toggle(){
    if (this.edit.getValue()) {
      this.edit.next(false);
    } else if (this._mine) {
      this.edit.next(true);
    }
  }
  // public set edit(v : boolean) {
  // 	this._edit = v && this._authed;
  // }
  public get mine() : boolean {
  	return this._mine;
  }
  // private _authed: boolean = false;
  // public get authed() : boolean {
  // 	return this._authed;
  // }
  private subscription: Subscription;

  ngOnDestroy() {
  	this.subscription.unsubscribe();
  }
}
