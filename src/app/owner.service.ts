import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class OwnerService implements OnDestroy {

  constructor(private auth: AngularFireAuth, private route: ActivatedRoute) {
  }

  private _edit = false;

  private _authed: boolean = false;

  private _owner: boolean = false;

  private ownerId = this.route.snapshot.paramMap.get('userId');

  private subscription = this.auth.authState.subscribe(user  => {
    this._authed = !!user;
    this._owner = user && user.uid === this.ownerId;
  });

  public get edit() : boolean {
    return this._edit;
  }

  public toggleEdit() {
    this._edit = !this._edit;
  }
  // public set edit(v : boolean) {
  //   this._edit = v;
  // }

  public get owner(): boolean {
    return this._owner;
  }

  public get authed(): boolean {
    return this._authed;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
