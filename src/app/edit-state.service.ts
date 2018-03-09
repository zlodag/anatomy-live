import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/combineLatest';

@Injectable()
export class EditStateService implements OnDestroy {

  constructor(private auth: AngularFireAuth) {
  }

  private subscription = this.auth.authState.subscribe(user  => {
      if (this._edit && !user) {
        this._edit = false;
      }
    });;

  private _edit = false;

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
