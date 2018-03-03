import { NgModule, Component, OnInit, AfterViewInit, AfterContentInit, AfterViewChecked, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { Subscription }   from 'rxjs/Subscription';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/publish';
import 'rxjs/add/observable/fromPromise';

import { AngularFireDatabase } from 'angularfire2/database';
import { database } from 'firebase';
import { Field, FieldSpec, DETAIL_FIELDS, EntryProgress, Progress } from '../models';
import { IdSubject, ItemSubject } from './item-id';

@Component({
    selector: 'app-quiz',
	templateUrl: './quiz.component.html',
	styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

    constructor(private route: ActivatedRoute, private readonly db: AngularFireDatabase, public el: ElementRef) {
    }

    command: string;
    lines: string[] = [];
    scrollToBottom: boolean;
    terminal: Element;
    private input = new Subject<string>();

    userId = this.route.snapshot.paramMap.get('userId');
    userRef = this.db.database.ref('details').child(this.userId);
    item: IdSubject = new ItemSubject(this.db,
        this.userId,
        this.route.snapshot.paramMap.get('regionId'),
        this.route.snapshot.paramMap.get('itemId')
    );
    progress: Subject<Progress> = new Subject();
    progressSubscription = this.item
        .do(
            item => {},
            error => {},
            () => {
                this.log('Finished!');
                this.commandSubscription.unsubscribe();
                // this.progressSubscription.unsubscribe();
            }
        )
        .switchMap(item => this.userRef.child(item.regionKey).child(item.itemKey).once('value'))
        .map((detailsSnap: database.DataSnapshot) => {
            const progress: Progress = {};
            detailsSnap.forEach(fieldSnap => {
                const entries: EntryProgress[] = [];
                fieldSnap.forEach(entrySnap => {
                    entries.push({
                        key: entrySnap.key,
                        text: entrySnap.val(),
                        done: false
                    });
                    return false;
                });
                progress[fieldSnap.key] = entries;
                return false;
            });
            return progress;
        })
        .subscribe(progress => this.progress.next(progress));

    commandSubscription = this.input.withLatestFrom(this.progress).subscribe(([input, progress]) => {
        console.log('New command: ' + input, progress);
    });

    fields: Observable<Field[]> = this.progress
        .map(progress => getFields(progress, true));

    ngOnInit() {
    }
    ngAfterViewInit() {
        this.terminal = this.el.nativeElement.querySelector('#terminal');
        // this.terminal.querySelector('input').focus();
    }
    ngAfterViewChecked() {
        if (this.scrollToBottom) {
            this.terminal.scrollTop = this.terminal.scrollHeight;
            this.scrollToBottom = false;
        }
    }
    ngOnDestroy() {
        if (this.progressSubscription) {
            this.progressSubscription.unsubscribe();
        }
        if (this.commandSubscription) {
            this.commandSubscription.unsubscribe();
        }
    }
    handleCommand(currentItemName: string, event: KeyboardEvent) {
        if (event.keyCode == 13) {
            this.command = this.command ? this.command.trim() : '';
            this.log(`${currentItemName} > ${this.command}`);
            if (this.command.length) {
                switch (this.command) {
                    case 'help':
                        this.printHelp();
                        break;
                    case 'keys':
                        this.printKeys();
                        break;
                    case 'skip':
                        this.log(`Skipping ${currentItemName}`);
                        this.item.nextItem();
                        break;
                    //  case 'cheat':
                    //      this.cheat(quizItem);
                    //     return;
                    default:
                        this.input.next(this.command);
                        break;
                }
            }
            this.command = '';
        }
    }
    log(text: string) {
        this.lines.push(text);
        this.scrollToBottom = true;
    }
    focus(element: HTMLElement) {
        element.focus();
    }

    private printHelp() {
        [
            '<key> <guess>[,<guess>...]: Attempt answer(s) to current item for the specified key',
            'skip: Skip current item',
            'cheat: Display answer(s) to current item',
            'keys: Display a list of keys',
            'help: Display this message',
        ].forEach(line => this.log(line));
    }

    private printKeys() {
        DETAIL_FIELDS.forEach(detailField => {
            this.log(`${detailField.shortcut}: ${detailField.key}`);
        });
    }

}

function getFields(progress: Progress, done: boolean): Field[] {
    const fields: Field[] = [];
    DETAIL_FIELDS.forEach(detailField => {
        if (detailField.key in progress) {
            const field: Field = {
                key: detailField.key,
                entries: progress[detailField.key].filter(entry => entry.done == done).map(entry => ({
                    key: entry.key,
                    text: entry.text,
                }))
            };
            if (field.entries.length) {
                fields.push(field);
            }
        }
    });
    return fields;
}

function itemRef(db: AngularFireDatabase, user: string, regionKey: string, itemKey: string) {
    return db.database.ref('details').child(user).child(regionKey).child(itemKey);
}

// export class QuizComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {


//     command: string;



//     itemSubscription: Subscription;

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