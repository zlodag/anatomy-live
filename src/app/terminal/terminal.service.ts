import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/publish';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';


import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { firestore } from 'firebase';
import { Details, DetailField, DETAIL_FIELDS, QuizItem, QuizDetail, QuizDetails, PrintField, Progress } from '../models';
import { ItemId } from './item-id';

interface Guess {
	detailField: DetailField;
	tokens: string[];
}

function getProgress(quizItem: QuizItem) : Progress {
	let progress: Progress = {
		id: quizItem.id,
		completed: [],
		remaining: []
	};
    for (var i = 0; i < DETAIL_FIELDS.length; i++) {
        const key = DETAIL_FIELDS[i].key;
        if (key in quizItem.details) {
            const completed = [];
            const remaining = [];
            quizItem.details[key].forEach(item => (item.done ? completed : remaining).push(item.text));
            if (completed.length) {
                progress.completed.push({key: key, items: completed});
            }
            if (remaining.length) {
                progress.remaining.push({key: key, items: remaining});
            }
        }
    }
    return progress;
}

@Injectable()
export class TerminalService {
    
	constructor(private readonly afs: AngularFirestore) {
		this.progress.connect();
	}
    private logSource = new Subject<string>();
    response: Observable<string> = this.logSource.asObservable();
	itemId = new ItemId(this.afs.firestore.collection('/items'));
	private command = new Subject<string>();
	progress = this.itemId
		.switchMap(itemId => this.afs.firestore.collection('/details').doc(itemId).get())
		.do(snapshot => {
			if (!snapshot.exists) {
	 	    	this.logSource.next(`Skipping ${snapshot.id} (no data)`);
				this.itemId.nextItem();
			}
		})
		.filter(snapshot => snapshot.exists)
		.map(snapshot => {
			const quizDetails : QuizDetails = {};
			const data = snapshot.data();
			let count = 0;
			for (let key in data) {
				if (data[key].length) {
					const fieldDetails: QuizDetail[] = [];
					for (let j = 0; j < data[key].length; j++) {
						const text: string = data[key][j];
						fieldDetails.push({text: text, done: false});
						count++;
					}
					quizDetails[key] = fieldDetails;
				}
			}
			return {
				id: snapshot.id,
				details: quizDetails,
				total: count,
				remainder: count
			};
		})
		.do(quizItem => {
			if (quizItem.total == 0) {
	 	    	this.logSource.next(`Skipping ${quizItem.id} (no data)`);
				this.itemId.nextItem();
			}
		})
		.filter(quizItem => quizItem.total > 0)
		.switchMap(quizItem => this.command
			.filter(command => {
				this.logSource.next(`${quizItem.id} > ${command}`);
				switch (command) {
		    		case 'help':
		    			this.printHelp();
		    			return false;
	    			case 'keys':
	    				this.printKeys();
		    			return false;
		    	 	case 'skip':
			 	    	this.logSource.next(`Skipping ${quizItem.id}`);
		    			this.itemId.nextItem();
		    			return false;
	    	 		case 'cheat':
	    	 			const progress = getProgress(quizItem).remaining;
						for (let i = 0; i < progress.length; i++) {
							const field = progress[i];
							this.logSource.next(field.key);
							for (let j = 0; j < field.items.length; j++) {
								this.logSource.next(`- ${field.items[j]}`);
							}
						}
		    			return false;
	    			default:
	    				return true;
	    		}
			})
			.map((command) : RegExpMatchArray => {
				const match = command.match(/^(\w{2})\s+(.+)$/);
				if (!match) {
			        this.logSource.next(`Invalid command: "${command}". Try "help"`);		
				}
				return match;
			})
			.filter(match => !!match)
			.map((match) : Guess => {
				const shortcut = match[1].toLowerCase();
				const detailField = getDetailField(shortcut);
				if (!detailField) {
		        	this.logSource.next(`Invalid key: "${shortcut}". Try "keys"`);
				}
				return {
					detailField: detailField,
					tokens: match[2].split(',')
				};
			})
			.filter(guess => !!guess.detailField)
			.map(guess => {
				for (var i = 0; i < guess.tokens.length; i++) {
					const token = guess.tokens[i].trim();
					if (this.isAdequateLength(token)){
						let found = false;
						if (guess.detailField.key in quizItem.details) {
							const subItems = quizItem.details[guess.detailField.key];
							for (let j = 0; j < subItems.length; j++) {
								const subItem = subItems[j];
								if (!subItem.done && this.tokenMatches(token, guess.detailField.key, subItem.text)){
									found = subItem.done = true;
									quizItem.remainder--;
									if (quizItem.remainder == 0) {
										this.logSource.next(`Completed "${quizItem.id}"`);
										this.itemId.nextItem();
										return quizItem;
									}
									break;
								}
							}
						}
						if (!found) {
							this.informIncorrect(token, guess.detailField.key);
						}
					}
				}
				return quizItem;
			})
			.startWith(quizItem)
		)
		.map(getProgress)
		.publish()

		;
	// private guesses = new Subject<Guess>();
	// guesses: Observable<Guess> = this.command
	// 	.map((command) : RegExpMatchArray => command.match(/^(\w{2})\s+(.+)$/))
	// 	.filter(match => !!match)
	// 	.map((match) : Guess => ({
	// 		detailField: getDetailField(match[1].toLowerCase()),
	// 		tokens: match[2].split(',')
	// 	}))
	// 	.filter(guess => !!guess.detailField);

	// progress: Observable<Progress> = this.quizItem
	// 	.switchMap(quizItem => this.guesses
	// 		.map(guess => {

	// 		})
	// 		.startWith(getProgress(quizItem))
	// 	);
	// 		const firstItem = getProgress(quizItem);
	// 		return 
	// 		.map(guess => {
	// 			for (var i = 0; i < guess.tokens.length; i++) {
	// 				const token = tokens[i].trim();
	// 				if (this.isAdequateLength(token)){
	// 					let found = false;
	// 					if (itemField) {
	// 						for (let j = itemField.length - 1; j >= 0; j--) {
	// 							const subItem = itemField[j];
	// 							if (!subItem.done && this.tokenMatches(token, detailField.key, subItem.text)){
	// 								found = subItem.done = true;
	// 								quizItem.remainder--;
	// 								if (quizItem.remainder == 0) {
	// 									this.logSource.next(`Completed "${quizItem.id}"`);
	// 									this.itemId.nextItem();
	// 									return quizItem;
	// 								}
	// 								break;
	// 							}
	// 						}
	// 					}
	// 					if (!found) {
	// 						this.informIncorrect(token, detailField.key);
	// 					}
	// 				}
	// 			}
	// 		})
	// 		;
	// });
	// 	.withLatestFrom(this.quizItem)
	// 	.map(([command, quizItem]) => {})
	// 	.startWith(this.quizItem.)
	// ;
	// doneItem: Observable<DoneItem[]> = this.itemId
	// 	.switchMap(itemId => this.afs.firestore.collection('/details').doc(itemId).get())
	// 	.do(snapshot => {
	// 		if (!snapshot.exists) {
	// 			console.log('Snapshot is empty, skipping...');
	// 			this.itemId.nextItem();
	// 		}
	// 	})
	// 	.filter(snapshot => snapshot.exists)
	// 	.map(snapshot => {
	// 		const quizDetails : QuizDetails = {};
	// 		const data = snapshot.data();
	// 		let count = 0;
	// 		for (let key in data) {
	// 			if (data[key].length) {
	// 				const fieldDetails: QuizDetail[] = [];
	// 				for (let j = 0; j < data[key].length; j++) {
	// 					const text: string = data[key][j];
	// 					fieldDetails.push({text: text, done: false});
	// 					count++;
	// 				}
	// 				quizDetails[key] = fieldDetails;
	// 			}
	// 		}
	// 		return {
	// 			id: snapshot.id,
	// 			details: quizDetails,
	// 			total: count,
	// 			remainder: count
	// 		};
	// 	})
	// 	.filter(quizItem => quizItem.total > 0)
	// 	.switchMap((quizItem) : Observable<QuizItem> => this.command.map(command => {
	// 		this.logSource.next(`${quizItem.id} > ${command}`);
	//     	command = command.trim();
	//     	if (command.length) {
	// 	    	switch (command) {
	// 	    		case 'help':
	// 	    			this.printHelp();
	// 	    			break;
	//     			case 'keys':
	//     				this.printKeys();
	// 	    			break;
	// 	    	 	case 'skip':
	// 		 	    	this.logSource.next(`Skipping ${quizItem.id}`);
	// 	    			this.itemId.nextItem();
	// 	    			break;
	//     	 		case 'cheat':
	// 					for (let i = 0; i < DETAIL_FIELDS.length; i++) {
	// 						const detailField = DETAIL_FIELDS[i];
	// 						if (detailField.key in quizItem.details){
	// 							const subItems = quizItem.details[detailField.key];
	// 							for (let j = 0; j < subItems.length; j++) {
	// 								const subItem = subItems[j];
	// 								if (!subItem.done) {
	// 									this.logSource.next(detailField.key);
	// 									this.logSource.next(`- ${subItem.text}`);
	// 								}
	// 							}
	// 						}
	// 					}
	// 	    			return quizItem;
	// 	    	 	default:
	// 					const match = command.match(/^(\w{2})\s+(.+)$/);
	// 				    if (match) {
	// 				    	const shortcut = match[1].toLowerCase();
	// 				    	const detailField = getDetailField(shortcut);
	// 				    	if (detailField) {
	// 							const itemField = quizItem.details[detailField.key];
	// 				    		const tokens = match[2].split(',');
	// 							for (var i = 0; i < tokens.length; i++) {
	// 								const token = tokens[i].trim();
	// 								if (this.isAdequateLength(token)){
	// 									let found = false;
	// 									if (itemField) {
	// 										for (let j = itemField.length - 1; j >= 0; j--) {
	// 											const subItem = itemField[j];
	// 											if (!subItem.done && this.tokenMatches(token, detailField.key, subItem.text)){
	// 												found = subItem.done = true;
	// 												quizItem.remainder--;
	// 												if (quizItem.remainder == 0) {
	// 													this.logSource.next(`Completed "${quizItem.id}"`);
	// 													this.itemId.nextItem();
	// 													return quizItem;
	// 												}
	// 												break;
	// 											}
	// 										}
	// 									}
	// 									if (!found) {
	// 										this.informIncorrect(token, detailField.key);
	// 									}
	// 								}
	// 							}
	// 						} else {
	// 					        this.logSource.next(`Invalid key: "${shortcut}". Try "keys"`);		
	// 				    	}
	// 				    } else {
	// 				        this.logSource.next(`Invalid command: "${command}". Try "help"`);		
	// 				    }
	// 	    	}
	// 	    }
	// 		return quizItem;
	// 	})
	// 	.startWith(quizItem)
	// 	// .map(quizItem => {
	// 	).map((item) : DoneItem[] => {
 //            let done : DoneItem[] = [];
 //            for (var i = 0; i < DETAIL_FIELDS.length; i++) {
 //                const key = DETAIL_FIELDS[i].key;
 //                const items = item.details[key];
 //                if (items) {
 //                    const doneItems = [];
 //                    items.forEach(item => {
 //                        if (item.done) {
 //                            doneItems.push(item.text);
 //                        }
 //                    });
 //                    if (doneItems.length) {
 //                        done.push({key: key, items: doneItems});
 //                    }
 //                }
 //            }
 //            return done;
 //        });

	sendCommand(command: string) {
		if (command) {
			command = command.trim();
			if (command) {
				this.command.next(command);
			}
		}
	}

	private isAdequateLength(token){
		if (token.length <= 2) {
			this.logSource.next(`✘ Entry must be 3 or more characters: "${token}"`);
			return false;
		}
		return true;
	}

	private tokenMatches(token, label, answer) {
		const indexStart = answer.toLowerCase().indexOf(token.toLowerCase());
		if (indexStart != -1) {
			this.informCorrect(answer, indexStart, indexStart + token.length, label);
			return true;
		}
		return false;
	}

	private informCorrect(answer, indexStart, indexEnd, label){
		this.logSource.next(`✔ ${label}: ${answer.slice(0, indexStart) + answer.slice(indexStart, indexEnd).toUpperCase() + answer.slice(indexEnd, answer.length)}`);
	}

	private informIncorrect(token, label) {
		this.logSource.next(`✘ ${label}: ${token}`);
	}

	private printKeys(){
		for (let i = 0; i < DETAIL_FIELDS.length; i++) {
			const detailField = DETAIL_FIELDS[i];
			this.logSource.next(`${detailField.shortcut}: ${detailField.key}`);
		}
	}

    private printHelp(){
    	[
    		'<key> <guess>[,<guess>...]: Attempt answer(s) to current item for the specified key',
    		'skip: Skip current item',
    		'cheat: Display answer(s) to current item',
    		'keys: Display a list of keys',
    		'help: Display this message',
    	].forEach(line => this.logSource.next(line));
    }
}

function getDetailField(shortcut: string) : DetailField {
	for (var i = 0; i < DETAIL_FIELDS.length; i++) {
		const detailField = DETAIL_FIELDS[i];
		if (shortcut == detailField.shortcut){
			return detailField;
		}
	}
	return null;
}
