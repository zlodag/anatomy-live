import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Details, DetailField, DETAIL_FIELDS } from '../models';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/withLatestFrom';
// import { combineLatest } from 'rxjs/observable/combineLatest';

@Injectable()
export class TerminalService {
    

	constructor(private readonly afs: AngularFirestore) {
		this.commandSource.withLatestFrom(this.currentDetails).subscribe(([command, details]) => {
			if (!details) {
		        this.sendResponse(`No details...`);
		        return;
			}
		    let match = command.match(/^(\w{2})\s+(.+)$/);
		    if (match) {
		    	const shortcut = match[1].toLowerCase();
		    	for (var i = 0; i < DETAIL_FIELDS.length; i++) {
		    		const detailField = DETAIL_FIELDS[i];
		    		if (shortcut == detailField.shortcut){
			    		// console.log(JSON.stringify(detailField));
			    		// console.log('My async log is ' + JSON.stringify(details));
		    			const itemField = details[detailField.key];
						const tokens = match[2].split(',');
						// console.log(`tokens: ${match[2]}`);
						for (var i = 0; i < tokens.length; i++) {
							const token = tokens[i].trim();
							// console.log(`Token: ${token}`);
							if (this.isAdequateLength(token)){
								let found = false;
								if (itemField) {
									for (var j = itemField.length - 1; j >= 0; j--) {
										if (this.tokenMatches(token, detailField.key, itemField[j])){
											found = true;
											itemField.splice(j, 1);
											// console.log(`itemField is now length: ${itemField.length}`);
											if (!itemField.length) {
												delete details[detailField.key];
											}
											console.log(JSON.stringify(details));
											this.remainder--;
											if (!this.remainder) {
												this.index++;
												this.loadDetails();
												return;
											}
											break;
										}
									}
								}
								if (!found) {
		    						this.informIncorrect(token, detailField.key);
								}
							}
						}
		    			return;
		    		}
		    	}
		        this.sendResponse(`Invalid key: "${shortcut}". Try "keys"`);		
		    } else {
		        this.sendResponse(`Invalid command: "${command}". Try "help"`);		
		    }

// 		    let match = command.match(/^\W*(?:(cheat)\W+)?(\w{2})(?:\W+(.+))?$/);
		    // if (match) {
		    //   let shortcut = match[2];
		    //   let detailField: DetailField = null;
		    //   for (var i = 0; !detailField && i < DETAIL_FIELDS.length; i++) {
		    //     if (shortcut == DETAIL_FIELDS[i].shortcut){
		    //       detailField = DETAIL_FIELDS[i];
		    //       if (match[1]){
		    //         this.log({text: 'Cheating:', userInput: false});
		    //       }
		    //       this.log({text: detailField.label, userInput: false});
		    //       let itemField = item[detailField.key];
		    //       if (detailField.array ? !itemField.length : !itemField){
		    //         this.log({text: 'No entry for: ' + detailField.label, userInput: false});
		    //         return;
		    //       } else {
		    //         testItems = detailField.array ? itemField : [itemField];
		    //         if (match[1]){
		    //           for (var j = 0; j < testItems.length; j++) {
		    //             let testItem = testItems[j];
		    //             this.log({text: 'ANSWER: "' + testItem + '"', userInput: false});
		    //           }
		    //           return;
		    //         }
		    //       }
		    //     }
		    //   }
		    //   if (!detailField) {
		    //     this.log({text: 'Invalid key: "' + key + '". Try "help"', userInput: false});
		    //     return;
		    //   }
		    // } else {

		    // }
// 			break;

		});
	}

    private commandSource = new Subject<string>();
    private responseSource = new Subject<string>();
    
    // commandHandler = this.commandSource.asObservable();
    responseHandler = this.responseSource.asObservable();
    
    remainder: number;
	index = 0;
	itemIds: string[];
	currentId: Subject<string> = new Subject();
	currentDetails: Observable<Details> = this.currentId.switchMap(currentId => this.afs.collection('/details').doc<Details>(currentId).valueChanges()
		.first())
	.do(details => {
		let totalAnswers = 0;
		for (let i = DETAIL_FIELDS.length - 1; i >= 0; i--) {
			const detailField = DETAIL_FIELDS[i];
			const itemField = details[detailField.key];
			if (itemField) {
				totalAnswers += itemField.length;
			}
		}
		this.remainder = totalAnswers;
		// this.sendResponse(`Loading item: "${currentId}"`);
		// this.sendResponse(`Loaded item with ${totalAnswers} answers`);
		this.sendResponse(`Loaded!`);
		console.log(JSON.stringify(details));
	})
	;

	isAdequateLength(token){
		if (token.length <= 2) {
	        this.sendResponse(`✘ Entry must be 3 or more characters: "${token}"`);		
			return false;
		}
		return true;
	}

	tokenMatches(token, label, answer) {
		const indexStart = answer.toLowerCase().indexOf(token.toLowerCase());
		if (indexStart != -1) {
			this.informCorrect(answer, indexStart, indexStart + token.length, label);
			return true;
		}
		return false;
	}

	informCorrect(answer, indexStart, indexEnd, label){
		this.sendResponse(`✔ ${label}: ${answer.slice(0, indexStart) + answer.slice(indexStart, indexEnd).toUpperCase() + answer.slice(indexEnd, answer.length)}`);
	}

	informIncorrect(token, label) {
		this.sendResponse(`✘ ${label}: ${token}`);

	}

    sendCommand(command: string) {
    	command = command.trim();
        if(command) {
        	switch (command) {
        		// case "cheat":
        		// 	this.printHelp();
        		// 	break;
        		case "help":
        			this.printHelp();
        			break;
        		default:
        			this.commandSource.next(command);
        	}
        }
    }

    guess(detailField: DetailField, token: string) {

    }
    
    private sendResponse(...responses: string[]) {
    	for (let i = 0; i < responses.length; i++) {
    		const response = responses[i];
    		if(response) {
	        	// console.log(`Response: ${response}`);
	            this.responseSource.next(response);
	        }
    	}
    }

    printHelp(){
		this.sendResponse(
			'Usage',
			'"regions" : list all regions',
			'"all" : list all items',
			'"items" : list items filtered by region',
			'"add" : add new regions or items',
			'"help" : display this message'
		);
    }

  //   cheat(){
		// this.sendResponse('You cheated!');
  //   }

    testAll(){
		// let regionId = this.route.snapshot.paramMap.get('region');
		// console.log(`regionId: ${regionId}`);
		// console.log('Loading...');
		// this.terminalService.sendResponse('Loading...');
		this.afs.collection('/items').snapshotChanges().map(actions => shuffleAndReturn(actions.map(a => a.payload.doc.id))).first().subscribe(ids => {
			this.itemIds = ids;
			this.sendResponse('Total items: ' + this.itemIds.length);
			// for (var i = 0; i < this.itemIds.length; i++) {
			// 	this.sendResponse(this.itemIds[i]);
			// }
			this.loadDetails();
			// console.log('Loaded items: ' + this.itemIds.length);
			// this.loadDetails();
		});
		// combineLatest(this.currentDetails, this.terminalService.commandHandler).subscribe(([details, command]) => {
		// 	console.log(`Details: ` + JSON.stringify(details));
		// 	console.log(`Command: ` + JSON.stringify(command));
		// 	this.terminalService.sendResponse('Nice!');
		// 	this.terminalService.sendResponse('Nice afain!');
		// });
		// this.currentId.subscribe(id => console.log(JSON.stringify(id)));
		// this.currentDetails.subscribe(details => console.log(JSON.stringify(details)));

    }

	loadDetails() {
		if (this.index < this.itemIds.length) {
			let itemId = this.itemIds[this.index];
			this.sendResponse(`Loading item: "${itemId}"`);
			this.currentId.next(itemId);
		} else {
			this.sendResponse('No more items!');
		}
	}

}


function shuffleAndReturn(array) {
  for (let i = array.length - 1, j = 0, temp = null; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array;
}