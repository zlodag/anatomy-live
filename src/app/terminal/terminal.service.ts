import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/publish';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';

import { AngularFirestore } from 'angularfire2/firestore';
import { DETAIL_FIELDS, QuizItem, QuizDetail, QuizDetails, Guess, PrintField } from '../models';
import { ItemId } from './item-id';

function getProgress(quizItem: QuizItem, done: boolean): PrintField[] {
	const fields: PrintField[] = [];
    for (let i = 0; i < DETAIL_FIELDS.length; i++) {
        const key = DETAIL_FIELDS[i].key;
        if (key in quizItem.details) {
            const items: string[] = [];
            quizItem.details[key].forEach(item => {
            	if (item.done == done) {
            		items.push(item.text);
            	}
            });
            if (items.length) {
                fields.push({key: key, items: items});
            }
        }
    }
    return fields;
}

@Injectable()
export class TerminalService {

	constructor(private readonly afs: AngularFirestore) {
	}
	private input = new Subject<string>();
    output = new Subject<string>();
	itemId = new ItemId(this.afs.firestore.collection('/items'));
	progress = this.itemId
		.switchMap(itemId => this.afs.firestore.collection('/details').doc(itemId).get())
		.do(snapshot => {
			if (!snapshot.exists) {
	 	    	this.output.next(`Skipping ${snapshot.id} (no data)`);
				this.itemId.nextItem();
			}
		})
		.filter(snapshot => snapshot.exists)
		.map(snapshot => {
			const quizDetails: QuizDetails = {};
			const data = snapshot.data();
			let count = 0;
			for (const key in data) {
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
	 	    	this.output.next(`Skipping ${quizItem.id} (no data)`);
				this.itemId.nextItem();
			}
		})
		.filter(quizItem => quizItem.total > 0)
		.switchMap(quizItem => this.input
			.filter(command => {
				this.output.next(`${quizItem.id} > ${command}`);
				switch (command) {
		    		case 'help':
		    			this.printHelp();
		    			return false;
	    			case 'keys':
	    				this.printKeys();
		    			return false;
		    	 	case 'skip':
			 	    	this.output.next(`Skipping ${quizItem.id}`);
		    			this.itemId.nextItem();
		    			return false;
	    	 		case 'cheat':
	    	 			this.cheat(quizItem);
		    			return false;
	    			default:
	    				return true;
	    		}
			})
			.map((command): RegExpMatchArray => {
				const match = command.match(/^([A-Za-z]{2})\s+(.+)$/);
				if (!match) {
			        this.output.next(`Invalid command: "${command}". Try "help"`);
				}
				return match;
			})
			.filter(match => !!match)
			.map((match): Guess => {
				const shortcut = match[1].toLowerCase();
				for (let i = 0; i < DETAIL_FIELDS.length; i++) {
					const detailField = DETAIL_FIELDS[i];
					if (shortcut == detailField.shortcut) {
						return {
							detailField: detailField,
							tokens: match[2].split(',')
						};
					}
				}
	        	this.output.next(`Invalid key: "${shortcut}". Try "keys"`);
				return null;
			})
			.filter(guess => guess != null)
			.map(guess => {
				for (let i = 0; i < guess.tokens.length; i++) {
					const token = guess.tokens[i].trim();
					if (this.isAdequateLength(token)) {
						let found = false;
						if (guess.detailField.key in quizItem.details) {
							const subItems = quizItem.details[guess.detailField.key];
							for (let j = 0; j < subItems.length; j++) {
								const subItem = subItems[j];
								if (!subItem.done && this.tokenMatches(token, guess.detailField.key, subItem.text)) {
									found = subItem.done = true;
									quizItem.remainder--;
									if (quizItem.remainder == 0) {
										this.output.next(`Completed "${quizItem.id}"`);
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
		.map(quizItem => ({
			id: quizItem.id,
			completed: getProgress(quizItem, true)
		}))
		.publish()
		;

	sendCommand(command: string) {
		if (command) {
			command = command.trim();
			if (command) {
				this.input.next(command);
			}
		}
	}

	private isAdequateLength(token) {
		if (token.length <= 2) {
			this.output.next(`✘ Entry must be 3 or more characters: "${token}"`);
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

	private informCorrect(answer, indexStart, indexEnd, label) {
		this.output.next(`✔ ${label}: ${answer.slice(0, indexStart) + answer.slice(indexStart, indexEnd).toUpperCase() + answer.slice(indexEnd, answer.length)}`);
	}

	private informIncorrect(token, label) {
		this.output.next(`✘ ${label}: ${token}`);
	}

	private printKeys() {
		for (let i = 0; i < DETAIL_FIELDS.length; i++) {
			const detailField = DETAIL_FIELDS[i];
			this.output.next(`${detailField.shortcut}: ${detailField.key}`);
		}
	}

    private printHelp() {
    	[
    		'<key> <guess>[,<guess>...]: Attempt answer(s) to current item for the specified key',
    		'skip: Skip current item',
    		'cheat: Display answer(s) to current item',
    		'keys: Display a list of keys',
    		'help: Display this message',
    	].forEach(line => this.output.next(line));
    }

    private cheat(quizItem: QuizItem){
		const remaining = getProgress(quizItem, false);
		for (let i = 0; i < remaining.length; i++) {
			const field = remaining[i];
			this.output.next(`${field.key} (${field.items.length})`);
			for (let j = 0; j < field.items.length; j++) {
				this.output.next(`- ${field.items[j]}`);
			}
		}
	}
}
