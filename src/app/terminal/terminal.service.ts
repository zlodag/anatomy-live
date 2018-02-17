import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { firestore } from 'firebase';
import { Details, DetailField, DETAIL_FIELDS, QuizItem, QuizDetail, QuizDetails } from '../models';
import { ItemId } from './item-id';

@Injectable()
export class TerminalService {
    
	constructor(private readonly afs: AngularFirestore) {}
    private logSource = new Subject<string>();
    command = new Subject<string>();
	private itemId = new ItemId(this.afs.firestore.collection('/items'));
    response: Observable<string> = this.logSource.asObservable();

	item: Observable<QuizItem> = this.itemId
		.switchMap(itemId => this.afs.firestore.collection('/details').doc(itemId).get())
		.do(
			snapshot => {
				if (!snapshot.exists) {
					console.log('Snapshot is empty, skipping...');
					this.itemId.nextItem();
				}
			},
			error => {
				console.error('There was an error: ' + error);
			},
			() => {
				this.subscription.unsubscribe();
				this.logSource.next('You have reached the end!');
			}
		)
		.filter(snapshot => snapshot.exists)
		.map(snapshot => {
			const quizDetails : QuizDetails = {};
			const data = snapshot.data();
			let remainder = 0;
			for (let key in data) {
				if (data[key].length) {
					const fieldDetails: QuizDetail[] = [];
					for (let j = 0; j < data[key].length; j++) {
						const text: string = data[key][j];
						fieldDetails.push({text: text, done: false});
						remainder++;
					}
					quizDetails[key] = fieldDetails;
				}
			}
			return {
				id: snapshot.id,
				details: quizDetails,
				remainder: remainder
			};
		});

	private subscription = this.command
	    .withLatestFrom(this.item)
	    .subscribe(([command, item] : [string, QuizItem]) : void => {
	    	this.logSource.next(`${item.id} > ${command}`);
	    	command = command.trim();
	    	if (command.length) {
		    	switch (command) {
		    		case 'help':
		    			this.printHelp();
		    			return;
	    			case 'keys':
	    				this.printKeys();
	    				return;
		    	 	case 'skip':
			 	    	this.logSource.next(`Skipping ${item.id}`);
		    			this.itemId.nextItem();
		    	 		return;
	    	 		case 'cheat':
						for (let i = 0; i < DETAIL_FIELDS.length; i++) {
							const detailField = DETAIL_FIELDS[i];
							if (detailField.key in item.details){
								const subItems = item.details[detailField.key];
								for (let j = 0; j < subItems.length; j++) {
									const subItem = subItems[j];
									if (!subItem.done) {
										this.logSource.next(detailField.key);
										this.logSource.next(`- ${subItem.text}`);
									}
								}
							}
						}
	    	 			return;
		    	 	default:
						const match = command.match(/^(\w{2})\s+(.+)$/);
					    if (match) {
					    	const shortcut = match[1].toLowerCase();
					    	const detailField = getDetailField(shortcut);
					    	if (detailField) {
								const itemField = item.details[detailField.key];
					    		const tokens = match[2].split(',');
								for (var i = 0; i < tokens.length; i++) {
									const token = tokens[i].trim();
									if (this.isAdequateLength(token)){
										let found = false;
										if (itemField) {
											for (let j = itemField.length - 1; j >= 0; j--) {
												const subItem = itemField[j];
												if (!subItem.done && this.tokenMatches(token, detailField.key, subItem.text)){
													found = subItem.done = true;
													item.remainder--;
													if (item.remainder <= 0) {
														this.logSource.next(`Completed "${item.id}"`);
														this.itemId.nextItem();
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
							} else {
						        this.logSource.next(`Invalid key: "${shortcut}". Try "keys"`);		
					    	}
					    } else {
					        this.logSource.next(`Invalid command: "${command}". Try "help"`);		
					    }
		    	 		return;
		    	}
		    }
	    });

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
    		'Usage:',
    		'<key> <guess>[,<guess>...]',
    		'\tAttempt answer(s) to current item for the specified key',
    		'skip',
    		'\tSkip current item',
    		'cheat',
    		'\tDisplay answer(s) to current item',
    		'keys',
    		'\tDisplay a list of keys',
    		'help',
    		'\tDisplay this message',
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
