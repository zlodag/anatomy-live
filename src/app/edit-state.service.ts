import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/combineLatest';

@Injectable()
export class EditStateService implements OnDestroy {

  constructor(auth: AngularFireAuth) {
    this.subscription = auth.authState.subscribe(user  => {
      // console.log('user: ' + JSON.stringify(user));
      // const ownerId = params.get('userId');
      // console.log('ownerId: ' + ownerId);
      // this._enabled = !!user;
      // console.log('enabled: ' + this._enabled);
      if (this._edit && !user) {
        this._edit = false;
      }
    });
  }

  // private _enabled = false;

  // private _edit: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _edit = false;

  private subscription: Subscription;

  // publicedit = this._edit.asObservable();

  // public toggle() {
  //   if (this._edit.getValue()) {
  //     this._edit.next(false);
  //   } else if (this._enabled) {
  //     this._edit.next(true);
  //   }
  // }

  public set edit(v : boolean) {
    this._edit = v;
  }

  public get edit(): boolean {
    return this._edit;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
