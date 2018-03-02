import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

@Injectable()
export class EditStateService implements OnDestroy {

  constructor(auth: AngularFireAuth, route: ActivatedRoute) {
  	this.subscription = Observable.combineLatest(auth.authState, route.paramMap).subscribe(([user, params])  => {
      const ownerId = params.get('userId');
      this._enabled = user && (!ownerId || user.uid == ownerId);
      if (this._edit.getValue() && !this._enabled) {
        this._edit.next(false);
      }
    });
  }

  private _enabled: boolean = false;

  private _edit: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public edit = this._edit.asObservable();

  public toggle(){
    if (this._edit.getValue()) {
      this._edit.next(false);
    } else if (this._enabled) {
      this._edit.next(true);
    }
  }

  public get enabled() : boolean {
  	return this._enabled;
  }

  private subscription: Subscription;

  ngOnDestroy() {
  	this.subscription.unsubscribe();
  }
}
