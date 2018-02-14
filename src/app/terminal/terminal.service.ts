import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
// import * as firestore from 'firebase/firestore';
import { firestore } from 'firebase';
import { Details, DetailField, DETAIL_FIELDS } from '../models';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import { from } from 'rxjs/observable/from';
import { merge } from 'rxjs/observable/merge';
// import { create } from 'rxjs/observable/create';
import 'rxjs/add/operator/withLatestFrom';
import { fromPromise } from 'rxjs/observable/fromPromise';
// import { from } from 'rxjs/observable/from';



class CurrentIdObservable extends Observable<string> {
	private currentIndex = 0;
	// private subscriber : Subscriber<string>;
	private itemIds: string[];
	constructor(afs: AngularFirestore) {
		super(subscriber => {
			// subscriber = subscriber;
			this.currentIndex = 0;
			afs.collection('/items').ref.get().then(querySnapshot => {
				let itemIds = [];
				querySnapshot.forEach(querySnapshot => itemIds.push(querySnapshot.id));
				shuffle(itemIds);
				this.itemIds = itemIds;
				this.advance(subscriber);
			});
		});
	}
	advance(subscriber : Subscriber<string>) {
		if (this.currentIndex < this.itemIds.length) {
			subscriber.next(this.itemIds[this.currentIndex]);
			this.currentIndex++;
		} else {
			subscriber.complete();
		}
	}
}

@Injectable()
export class TerminalService {
    
	constructor(private readonly afs: AngularFirestore) {
	}
	currentId = new CurrentIdObservable(this.afs);
    private commandSource = new Subject<string>();
    private responseSource = new Subject<string>();
    
    
    // remainder: number;
	index = 0;
	itemIds: string[];

	private currentDetails: Observable<Details> = this.currentId
		.do(id => console.log(id))
		.switchMap(currentId => this.afs.collection('/details').doc<Details>(currentId).ref.get())
		.map((documentSnapshot) : Details => documentSnapshot.data())
		// .do(details => console.log(JSON.stringify(details)))
		;

    private commandHandler : Observable<string> = this.commandSource.withLatestFrom(this.currentDetails).map(([command, details]) => {
    	let lines: string[] = [];
    	lines.push(` > ${command}`);
    	console.log(` > ${command}`);
    	return ` > ${command}`;
    	// // lines.push(`${details.id} > ${command}`);
    	// // lines.push(`against: ${JSON.stringify(details.data())}`);
    	// // lines.push(details.id + ' >');
	    // let match = command.match(/^(\w{2})\s+(.+)$/);
	    // if (match) {
	    // 	const shortcut = match[1].toLowerCase();
	    // 	for (var i = 0; i < DETAIL_FIELDS.length; i++) {
	    // 		const detailField = DETAIL_FIELDS[i];
	    // 		if (shortcut == detailField.shortcut){
	    // 			this.testAgainst(details, detailField, lines, match[2].split(','));
	    // 			break;
	    // 		}
	    // 	}
	    // }
    	// return lines;
    });
    // .switchMap(lines => from(lines));

    responseHandler = merge(this.responseSource, this.commandHandler);

    sendCommand(command: string) {
    	command = command.trim();
        if(command) {
        	console.log('sending command: ' + command);
        	this.commandSource.next(command);
        }
    }


	// responseHandler : Observable<string> = merge(this.responseSource, this.commandHandler);


		// 
		// this.commandSource.withLatestFrom(this.currentDetails).subscribe(([command, details]) => {
		// 	if (!details) {
		//         console.log(`No details...`);
		//         return;
		// 	}
		//     let match = command.match(/^(\w{2})\s+(.+)$/);
		//     if (match) {
		//     	const shortcut = match[1].toLowerCase();
		//     	for (var i = 0; i < DETAIL_FIELDS.length; i++) {
		//     		const detailField = DETAIL_FIELDS[i];
		//     		if (shortcut == detailField.shortcut){
		// 	    		// console.log(JSON.stringify(detailField));
		// 	    		// console.log('My async log is ' + JSON.stringify(details));
		//     			const itemField = details[detailField.key];
		// 				const tokens = match[2].split(',');
		// 				// console.log(`tokens: ${match[2]}`);
		// 				for (var i = 0; i < tokens.length; i++) {
		// 					const token = tokens[i].trim();
		// 					// console.log(`Token: ${token}`);
		// 					if (this.isAdequateLength(token)){
		// 						let found = false;
		// 						if (itemField) {
		// 							for (var j = itemField.length - 1; j >= 0; j--) {
		// 								if (this.tokenMatches(token, detailField.key, itemField[j])){
		// 									found = true;
		// 									itemField.splice(j, 1);
		// 									// console.log(`itemField is now length: ${itemField.length}`);
		// 									if (!itemField.length) {
		// 										delete details[detailField.key];
		// 									}
		// 									console.log(JSON.stringify(details));
		// 									this.remainder--;
		// 									if (!this.remainder) {
		// 										this.index++;
		// 										this.loadDetails();
		// 										return;
		// 									}
		// 									break;
		// 								}
		// 							}
		// 						}
		// 						if (!found) {
		//     						this.informIncorrect(token, detailField.key);
		// 						}
		// 					}
		// 				}
		//     			return;
		//     		}
		//     	}
		//         console.log(`Invalid key: "${shortcut}". Try "keys"`);		
		//     } else {
		//         console.log(`Invalid command: "${command}". Try "help"`);		
		//     }
		// 
		//     let match = command.match(/^\W*(?:(cheat)\W+)?(\w{2})(?:\W+(.+))?$/);
		//     if (match) {
		//       let shortcut = match[2];
		//       let detailField: DetailField = null;
		//       for (var i = 0; !detailField && i < DETAIL_FIELDS.length; i++) {
		//         if (shortcut == DETAIL_FIELDS[i].shortcut){
		//           detailField = DETAIL_FIELDS[i];
		//           if (match[1]){
		//             this.log({text: 'Cheating:', userInput: false});
		//           }
		//           this.log({text: detailField.label, userInput: false});
		//           let itemField = item[detailField.key];
		//           if (detailField.array ? !itemField.length : !itemField){
		//             this.log({text: 'No entry for: ' + detailField.label, userInput: false});
		//             return;
		//           } else {
		//             testItems = detailField.array ? itemField : [itemField];
		//             if (match[1]){
		//               for (var j = 0; j < testItems.length; j++) {
		//                 let testItem = testItems[j];
		//                 this.log({text: 'ANSWER: "' + testItem + '"', userInput: false});
		//               }
		//               return;
		//             }
		//           }
		//         }
		//       }
		//       if (!detailField) {
		//         this.log({text: 'Invalid key: "' + key + '". Try "help"', userInput: false});
		//         return;
		//       }
		//     } else {
		//
		//     }
		// 	break;
		// 
		// });

	// private detailWatcher: Observable<string[]> = this.currentDetails.map(documentSnapshot => {
 //    	let lines: string[] = [];
 //    	lines.push(`Time for a new item: ${documentSnapshot.id}`);
 //    	return lines;
	// });
	// .do(details => {
	// 	let totalAnswers = 0;
	// 	for (let i = DETAIL_FIELDS.length - 1; i >= 0; i--) {
	// 		const detailField = DETAIL_FIELDS[i];
	// 		const itemField = details[detailField.key];
	// 		if (itemField) {
	// 			totalAnswers += itemField.length;
	// 		}
	// 	}
	// 	this.remainder = totalAnswers;
	// 	// console.log(`Loading item: "${currentId}"`);
	// 	// console.log(`Loaded item with ${totalAnswers} answers`);
	// 	console.log(`Loaded!`);
	// 	console.log(JSON.stringify(details));
	// })


	testAgainst(details: Details, detailField: DetailField, lines: string[], tokens: string[]) {
		const itemField = details[detailField.key];
		// let lines = [];

		// const tokens = match[2].split(',');
		// console.log(`tokens: ${match[2]}`);
		for (var i = 0; i < tokens.length; i++) {
			const token = tokens[i].trim();
			// console.log(`Token: ${token}`);
			if (this.isAdequateLength(token, lines)){
				let found = false;
				if (itemField) {
					for (var j = itemField.length - 1; j >= 0; j--) {
						if (this.tokenMatches(token, detailField.key, itemField[j], lines)){
							found = true;
							itemField.splice(j, 1);
							// console.log(`itemField is now length: ${itemField.length}`);
							if (!itemField.length) {
								delete details[detailField.key];
							}
							console.log(JSON.stringify(details));
							if (Object.keys(details).length === 0) {
								this.index++;
								this.loadDetails();
								return;
							}
							break;
						}
					}
				}
				if (!found) {
					this.informIncorrect(token, detailField.key, lines);
				}
			}
		}
	}

	isAdequateLength(token, lines){
		if (token.length <= 2) {
			lines.push(`✘ Entry must be 3 or more characters: "${token}"`);
	        console.log(`✘ Entry must be 3 or more characters: "${token}"`);		
			return false;
		}
		return true;
	}

	tokenMatches(token, label, answer, lines) {
		const indexStart = answer.toLowerCase().indexOf(token.toLowerCase());
		if (indexStart != -1) {
			this.informCorrect(answer, indexStart, indexStart + token.length, label, lines);
			return true;
		}
		return false;
	}

	informCorrect(answer, indexStart, indexEnd, label, lines){
		lines.push(`✔ ${label}: ${answer.slice(0, indexStart) + answer.slice(indexStart, indexEnd).toUpperCase() + answer.slice(indexEnd, answer.length)}`);
		console.log(`✔ ${label}: ${answer.slice(0, indexStart) + answer.slice(indexStart, indexEnd).toUpperCase() + answer.slice(indexEnd, answer.length)}`);
	}

	informIncorrect(token, label, lines) {
		lines.push(`✘ ${label}: ${token}`);
		console.log(`✘ ${label}: ${token}`);

	}


    // guess(detailField: DetailField, token: string) {

    // }
    
    // private sendResponse(...responses: string[]) {
    // 	for (let i = 0; i < responses.length; i++) {
    // 		const response = responses[i];
    // 		if(response) {
	   //      	// console.log(`Response: ${response}`);
	   //          this.responseSource.next(response);
	   //      }
    // 	}
    // }

  //   printHelp(){
		// console.log(
		// 	'Usage',
		// 	'"regions" : list all regions',
		// 	'"all" : list all items',
		// 	'"items" : list items filtered by region',
		// 	'"add" : add new regions or items',
		// 	'"help" : display this message'
		// );
  //   }

  //   cheat(){
		// console.log('You cheated!');
  //   }

    // testAll(){
		// let regionId = this.route.snapshot.paramMap.get('region');
		// console.log(`regionId: ${regionId}`);
		// console.log('Loading...');
		// this.terminalService.sendResponse('Loading...');
		// this.afs.collection('/items').ref.get().then(querySnapshot => {
		// 	this.itemIds = [];
		// 	querySnapshot.forEach(querySnapshot => this.itemIds.push(querySnapshot.id));
		// 	console.log('Total items: ' + this.itemIds.length);
		// 	shuffle(this.itemIds);
		// 	this.loadDetails();
		// });
		// this.afs.collection('/items').snapshotChanges().map(actions => shuffleAndReturn(actions.map(a => a.payload.doc.id))).first().subscribe(ids => {
		// 	this.itemIds = ids;
		// 	console.log('Total items: ' + this.itemIds.length);
		// 	// for (var i = 0; i < this.itemIds.length; i++) {
		// 	// 	console.log(this.itemIds[i]);
		// 	// }
		// 	this.loadDetails();
		// 	// console.log('Loaded items: ' + this.itemIds.length);
		// 	// this.loadDetails();
		// });
		// combineLatest(this.currentDetails, this.terminalService.commandHandler).subscribe(([details, command]) => {
		// 	console.log(`Details: ` + JSON.stringify(details));
		// 	console.log(`Command: ` + JSON.stringify(command));
		// 	this.terminalService.sendResponse('Nice!');
		// 	this.terminalService.sendResponse('Nice afain!');
		// });
		// this.currentId.subscribe(id => console.log(JSON.stringify(id)));
		// this.currentDetails.subscribe(details => console.log(JSON.stringify(details)));

    // }

	// loadDetails() {
	// 	if (this.index < this.itemIds.length) {
	// 		let itemId = this.itemIds[this.index];
	// 		console.log(`Loading item: "${itemId}"`);
	// 		this.currentId.next(itemId);
	// 	} else {
	// 		console.log('No more items!');
	// 	}
	// }

}


function shuffle(array) {
  for (let i = array.length - 1, j = 0, temp = null; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}