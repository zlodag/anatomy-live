import { Subject } from 'rxjs/Subject';
import { AngularFireDatabase } from 'angularfire2/database';

interface Item {
  regionKey: string;
  itemKey: string;
  itemName: string;
}

export abstract class IdSubject extends Subject<Item> {
  protected items: Item[];
  private itemIndex = 0;
  nextItem() {
    if (this.itemIndex < this.items.length) {
      this.next(this.items[this.itemIndex]);
      this.itemIndex++;
    } else {
      this.complete();
    }
  }
}

export class ItemSubject extends IdSubject {
  constructor(db: AngularFireDatabase, user: string, regionKey: string, itemKey: string) {
    super();
    itemRef(db, user, regionKey, itemKey).child('name').once('value', itemSnap => {
      this.items = [{
        regionKey: regionKey,
        itemKey: itemKey,
        itemName: itemSnap.val(),
      }];
      this.nextItem();
    });
  }
}

export class RegionSubject extends IdSubject {
  constructor(db: AngularFireDatabase, user: string, regionKey: string) {
    super();
    regionRef(db, user, regionKey).once('value', regionSnap => {
      this.items = [];
      regionSnap.forEach(itemSnap => {
        this.items.push({
          regionKey: regionKey,
          itemKey: itemSnap.key,
          itemName: itemSnap.child('name').val(),
        });
        return false;
      });
      shuffle(this.items);
      this.nextItem();
    });
  }
}

export class AllRegionsSubject extends IdSubject {
  constructor(db: AngularFireDatabase, user: string) {
    super();
    userRef(db, user).once('value', userSnap => {
      this.items = [];
      userSnap.forEach(regionSnap => {
        const regionKey = regionSnap.key;
        regionSnap.forEach(itemSnap => {
          this.items.push({
            regionKey: regionKey,
            itemKey: itemSnap.key,
            itemName: itemSnap.child('name').val(),
          });
          return false;
        });
        return false;
      });
      shuffle(this.items);
      this.nextItem();
    });
  }
}

function userRef(db: AngularFireDatabase, user: string) {
  return db.database.ref('items').child(user);
}

function regionRef(db: AngularFireDatabase, user: string, regionKey: string) {
  return userRef(db, user).child(regionKey);
}

function itemRef(db: AngularFireDatabase, user: string, regionKey: string, itemKey: string) {
  return regionRef(db, user, regionKey).child(itemKey);
}

function shuffle(array: any[]): void {
  for (let i = array.length - 1, j = 0, temp = null; i > 0; i -= 1) {
  j = Math.floor(Math.random() * (i + 1));
  temp = array[i];
  array[i] = array[j];
  array[j] = temp;
  }
}
