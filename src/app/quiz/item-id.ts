import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { firestore } from 'firebase';

export class ItemId extends BehaviorSubject<string> {

	private itemIds: string[] = [];
	private itemIndex = 0;

	constructor(ids: firestore.Query | string[]) {
		super(null);
		if (ids instanceof firestore.Query) {
			// console.log('Getting IDs by query');
			ids.get().then(
				value => {
					value.forEach(snap => this.itemIds.push(snap.id));
					shuffle(this.itemIds);
					this.nextItem();
				},
				error => {
					this.error(error);
					this.complete();
				}
			);
		} else if (ids instanceof Array) {
			// console.log('Getting IDs by array: ' + JSON.stringify(ids));
			this.itemIds = ids;
			shuffle(this.itemIds);
			this.nextItem();
		} else {
			console.error('Neither query nor array: ' + JSON.stringify(ids));
		}
	}

	nextItem() {
		if (this.itemIndex < this.itemIds.length) {
			this.next(this.itemIds[this.itemIndex]);
			this.itemIndex++;
		} else {
			this.complete();
		}
	}

}

function shuffle(array: any[]): void {
  for (let i = array.length - 1, j = 0, temp = null; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
