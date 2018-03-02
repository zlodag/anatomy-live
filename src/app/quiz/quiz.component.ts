import { NgModule, Component, OnInit, AfterViewInit, AfterViewChecked, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription }   from 'rxjs/Subscription';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/observable/fromPromise';

import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';
import { DETAIL_FIELDS } from '../models';
import { ItemId } from './item-id';

@Component({
    selector: 'app-quiz',
	templateUrl: './quiz.component.html',
	styleUrls: ['./quiz.component.css'],
})
export class QuizComponent {}
// export class QuizComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

//     lines: string[] = [];

//     command: string;

//     terminal: Element;

//     scrollToBottom: boolean;

//     itemSubscription: Subscription;
//     commandSubscription: Subscription;

//     constructor(private route: ActivatedRoute, private readonly afs: AngularFirestore, public el: ElementRef) {
//     }

//     itemId: string = null;

//     ngOnInit() {
        
        // this.itemSubscription = this.itemIdObservable.subscribe(
        //     id => this.itemId = id,
        //     error => {},
        //     () => {
        //         this.commandSubscription.unsubscribe();
        //         this.itemId = null;
        //         this.lines.push('Finished!');
        //     }
        // );
        // this.commandSubscription = this.input
        //     .withLatestFrom(this.quizItem)
        //     .subscribe(([command, quizItem]) => {
        //         this.log(`${quizItem.id} > ${command}`);
        //         switch (command) {
        //             case 'help':
        //                 this.printHelp();
        //                 return;
        //             case 'keys':
        //                 this.printKeys();
        //                 return;
        //              case 'skip':
        //                  this.log(`Skipping ${quizItem.id}`);
        //                 this.itemIdObservable.nextItem();
        //                 return;
        //              case 'cheat':
        //                  this.cheat(quizItem);
        //                 return;
        //         }
        //         const match = command.match(/^([A-Za-z]{2})\s+(.+)$/);
        //         if (!match) {
        //             this.log(`Invalid command: "${command}". Try "help"`);
        //             return;
        //         }
        //         const shortcut = match[1].toLowerCase();
        //         for (let i = 0; i < DETAIL_FIELDS.length; i++) {
        //             const detailField = DETAIL_FIELDS[i];
        //             if (shortcut == detailField.shortcut) {
        //                 const tokens = match[2].split(',');
        //                 const initialRemainder = quizItem.remainder;
        //                 for (let j = 0; j < tokens.length; j++) {
        //                     const token = tokens[j].trim();
        //                     if (token.length) {
        //                         let found = false;
        //                         if (detailField.key in quizItem.details) {
        //                             const subItems = quizItem.details[detailField.key];
        //                             for (let k = 0; k < subItems.length; k++) {
        //                                 const subItem = subItems[k];
        //                                 if (!subItem.done && this.tokenMatches(token, detailField.key, subItem.text)) {
        //                                     found = subItem.done = true;
        //                                     quizItem.remainder--;
        //                                     if (quizItem.remainder == 0) {
        //                                         this.log(`Completed "${quizItem.id}"`);
        //                                         this.itemIdObservable.nextItem();
        //                                         this.progress.next([]);
        //                                         return;
        //                                     }
        //                                     break;
        //                                 }
        //                             }
        //                         }
        //                         if (!found) {
        //                             this.informIncorrect(token, detailField.key);
        //                         }
        //                     }
        //                 }
        //                 if (initialRemainder != quizItem.remainder) {
        //                     this.progress.next(getProgress(quizItem, true));
        //                 }
        //                 return;
        //             }
        //         }
        //         this.log(`Invalid key: "${shortcut}". Try "keys"`);
        //     });
    // }

    // progress = new BehaviorSubject<PrintField[]>([]);
    // private input = new Subject<string>();
    // itemIdObservable = new ItemId(
    //     this.route.snapshot.paramMap.has('itemId') ?
    //     [this.route.snapshot.paramMap.get('itemId')] :
    //     this.route.snapshot.paramMap.has('regionId') ?
    //     this.afs.firestore.collection('users').doc(this.route.snapshot.paramMap.get('userId')).collection('items').where('region', '==', this.route.snapshot.paramMap.get('regionId')) :
    //     this.afs.firestore.collection('users').doc(this.route.snapshot.paramMap.get('userId')).collection('items')
    // );
    // private quizItem = this.itemIdObservable
    //     .filter(itemId => itemId !== null)
    //     .do(itemId => this.progress.next([]))
    //     .switchMap(itemId => Observable
    //         .fromPromise(this.afs.firestore.collection('users').doc(this.route.snapshot.paramMap.get('userId')).collection('/details').doc(itemId).get())
    //         .do(snapshot => {
    //             if (!snapshot.exists) {
    //                 this.log(`Skipping ${snapshot.id} (no data)`);
    //                 this.itemIdObservable.nextItem();
    //             }
    //         })
    //         .filter(snapshot => snapshot.exists)
    //         .map(snapshot => {
    //             const quizDetails: QuizDetails = {};
    //             const data = snapshot.data();
    //             let count = 0;
    //             for (const key in data) {
    //                 if (data[key].length) {
    //                     const fieldDetails: QuizDetail[] = [];
    //                     for (let j = 0; j < data[key].length; j++) {
    //                         const text: string = data[key][j];
    //                         fieldDetails.push({text: text, done: false});
    //                         count++;
    //                     }
    //                     quizDetails[key] = fieldDetails;
    //                 }
    //             }
    //             return {
    //                 id: snapshot.id,
    //                 details: quizDetails,
    //                 total: count,
    //                 remainder: count
    //             };
    //         })
    //         .do(quizItem => {
    //             if (quizItem.total == 0) {
    //                 this.log(`Skipping ${quizItem.id} (no data)`);
    //                 this.itemIdObservable.nextItem();
    //             }
    //         })
    //         .filter(quizItem => quizItem.total > 0)
    //     );

    // log(text: string) {
    //     this.lines.push(text);
    //     this.scrollToBottom = true;
    // }

    // private tokenMatches(token, label, answer) {
    //     const indexStart = answer.toLowerCase().indexOf(token.toLowerCase());
    //     if (indexStart != -1) {
    //         this.informCorrect(answer, indexStart, indexStart + token.length, label);
    //         return true;
    //     }
    //     return false;
    // }

    // private informCorrect(answer, indexStart, indexEnd, label) {
    //     this.log(`✔ ${label}: ${answer.slice(0, indexStart) + answer.slice(indexStart, indexEnd).toUpperCase() + answer.slice(indexEnd, answer.length)}`);
    // }

    // private informIncorrect(token, label) {
    //     this.log(`✘ ${label}: ${token}`);
    // }

    // private printKeys() {
    //     for (let i = 0; i < DETAIL_FIELDS.length; i++) {
    //         const detailField = DETAIL_FIELDS[i];
    //         this.log(`${detailField.shortcut}: ${detailField.key}`);
    //     }
    // }

    // private printHelp() {
    //     [
    //         '<key> <guess>[,<guess>...]: Attempt answer(s) to current item for the specified key',
    //         'skip: Skip current item',
    //         'cheat: Display answer(s) to current item',
    //         'keys: Display a list of keys',
    //         'help: Display this message',
    //     ].forEach(line => this.log(line));
    // }

    // private cheat(quizItem: QuizItem){
    //     const remaining = getProgress(quizItem, false);
    //     for (let i = 0; i < remaining.length; i++) {
    //         const field = remaining[i];
    //         this.log(`${field.key} (${field.items.length})`);
    //         for (let j = 0; j < field.items.length; j++) {
    //             this.log(`- ${field.items[j]}`);
    //         }
    //     }
    // }

    // ngAfterViewInit() {
    //     this.terminal = this.el.nativeElement.querySelector('#terminal');
    //     this.terminal.querySelector('input').focus();
    // }

    // ngAfterViewChecked() {
    //     if (this.scrollToBottom) {
    //         this.terminal.scrollTop = this.terminal.scrollHeight;
    //         this.scrollToBottom = false;
    //     }
    // }

    // handleCommand(event: KeyboardEvent) {
    //     if (event.keyCode == 13 && this.command) {
    //         this.command = this.command.trim();
    //         if (this.command) {
    //             this.input.next(this.command);
    //             this.command = '';
    //         }
    //     }
    // }
    // sendCommand(command: string) {
    //     if (command) {
    //         command = command.trim();
    //         if (command) {
    //             this.input.next(command);
    //         }
    //     }
    // }
    // focus(element: HTMLElement) {
    //     element.focus();
    // }

//     ngOnDestroy() {
//         if (this.itemSubscription) {
//             this.itemSubscription.unsubscribe();
//         }
//         if (this.commandSubscription) {
//             this.commandSubscription.unsubscribe();
//         }
//     }

// }

// function getProgress(quizItem: QuizItem, done: boolean): PrintField[] {
//     const fields: PrintField[] = [];
//     for (let i = 0; i < DETAIL_FIELDS.length; i++) {
//         const key = DETAIL_FIELDS[i].key;
//         if (key in quizItem.details) {
//             const items: string[] = [];
//             quizItem.details[key].forEach(item => {
//                 if (item.done == done) {
//                     items.push(item.text);
//                 }
//             });
//             if (items.length) {
//                 fields.push({key: key, items: items});
//             }
//         }
//     }
//     return fields;
// }