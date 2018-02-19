import { Subject } from 'rxjs/Subject';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';

export class ItemId extends Subject<string> {

	private itemIds: string[] = [];
	private itemIndex = 0;

	constructor(private query: firestore.Query ) {
		super();
		query.get().then(
			value => {
				value.forEach(snap => this.itemIds.push(snap.id));
				shuffle(this.itemIds);
				this.nextItem();
			},
			error => {
				this.error(error);
			}
		);
	}

	nextItem() {
		if (this.itemIndex < this.itemIds.length) {
			this.next(this.itemIds[this.itemIndex]);
			this.itemIndex++;
		} else {
			// this.next(null);
			this.complete();
		}
	}

}

function shuffle(array) {
  for (let i = array.length - 1, j = 0, temp = null; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
