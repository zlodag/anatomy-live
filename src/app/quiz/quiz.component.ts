import { NgModule, Component, OnInit, AfterViewInit, AfterContentInit, AfterViewChecked, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription }   from 'rxjs/Subscription';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/withLatestFrom';

import { AngularFireDatabase } from 'angularfire2/database';
import { database } from 'firebase';
import { Field, DETAIL_FIELDS, EntryProgress, Progress } from '../models';
import { IdSubject, ItemSubject, RegionSubject, AllRegionsSubject } from './item-id';

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
    private scrollToBottom: boolean;
    private terminal: Element;
    private input = new Subject<string>();
    private userId = this.route.snapshot.paramMap.get('userId');
    private regionId = this.route.snapshot.paramMap.get('regionId');
    private itemId = this.route.snapshot.paramMap.get('itemId');
    private userRef = this.db.database.ref('details').child(this.userId);
    item: IdSubject =
        this.itemId ? new ItemSubject(this.db, this.userId, this.regionId, this.itemId) :
        this.regionId ? new RegionSubject(this.db, this.userId, this.regionId) :
        new AllRegionsSubject(this.db, this.userId);
    private progress: Subject<Progress> = new Subject();
    fields: Observable<Field[]> = this.progress
        .map(progress => getFields(progress, true));
    private progressSubscription = this.item
        .do(
            item => {
                this.log(`New item: ${item.itemName}`);
            },
            error => {},
            () => {
                this.log('Finished!');
                this.commandSubscription.unsubscribe();
            }
        )
        .switchMap(item => this.userRef.child(item.regionKey).child(item.itemKey).once('value'))
        .do(item => this.focusOnInput())
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

    private commandSubscription = this.input.withLatestFrom(this.progress.do(progress => {
        if (!getFields(progress, false).length) {
            this.log(`Item complete`);
            this.item.nextItem();
        }
    })).subscribe(([input, progress]) => {
        if (input.toLowerCase() == 'cheat') {
            getFields(progress, false).forEach(field => {
                this.log(`${field.key} (${field.entries.length})`);
                field.entries.forEach(entry => {
                    this.log(`- ${entry.text}`);
                });
            });
            return;
        }
        let match = input.match(/^cheat ([a-z]{2})$/i);
        if (match) {
            const shortcut = match[1].toLowerCase();
            for (let i = 0; i < DETAIL_FIELDS.length; i++) {
                const detailField = DETAIL_FIELDS[i];
                if (shortcut == detailField.shortcut) {
                    const field: Field = {
                        key: detailField.key,
                        entries: detailField.key in progress ? 
                            progress[detailField.key].filter(entry => !entry.done).map(entry => ({
                                key: entry.key,
                                text: entry.text,
                            })) : []
                    };
                    this.log(`${field.key} (${field.entries.length})`);
                    field.entries.forEach(entry => {
                        this.log(`- ${entry.text}`);
                    });
                    return;
                }
            }
            this.log(`Invalid key: "${shortcut}". Try "keys"`);
            return;
        }
        match = input.match(/^([a-z]{2})\s+(.+)$/i);
        if (match) {
            const shortcut = match[1].toLowerCase();
            for (let i = 0; i < DETAIL_FIELDS.length; i++) {
                const detailField = DETAIL_FIELDS[i];
                if (shortcut == detailField.shortcut) {
                    const tokens = match[2].split(',');
                    let changed = false;
                    for (let j = 0; j < tokens.length; j++) {
                        const token = tokens[j].trim();
                        if (token.length) {
                            let found = false;
                            if (detailField.key in progress) {
                                const field = progress[detailField.key];
                                for (let k = 0; k < field.length; k++) {
                                    const entry = field[k];
                                    if (!entry.done && this.tokenMatches(token, detailField.key, entry.text)) {
                                        changed = found = entry.done = true;
                                        break;
                                    }
                                }
                            }
                            if (!found) {
                                this.informIncorrect(token, detailField.key);
                            }
                        }
                    }
                    if (changed) {
                        this.progress.next(progress);
                    }
                    return;
                }
            }
            this.log(`Invalid key: "${shortcut}". Try "keys"`);
            return;
        }
        this.log(`Invalid command: "${input}". Try "help"`);
    });

    ngOnInit() {
    }
    ngAfterViewInit() {
        this.terminal = this.el.nativeElement.querySelector('#terminal');
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
                    default:
                        this.input.next(this.command);
                        break;
                }
            }
            this.command = '';
        }
    }
    private log(text: string) {
        this.lines.push(text);
        this.scrollToBottom = true;
    }
    focusOnInput() {
        (<HTMLElement>this.terminal.querySelector("#command_prompt")).focus();
    }

    private tokenMatches(token: string, label: string, answer: string) {
        const indexStart = answer.toLowerCase().indexOf(token.toLowerCase());
        if (indexStart != -1) {
            this.informCorrect(answer, indexStart, indexStart + token.length, label);
            return true;
        }
        return false;
    }

    private informCorrect(answer: string, indexStart: number, indexEnd: number, label: string) {
        this.log(`✔ ${label}: ${answer.slice(0, indexStart) + answer.slice(indexStart, indexEnd).toUpperCase() + answer.slice(indexEnd, answer.length)}`);
    }

    private informIncorrect(token: string, label: string) {
        this.log(`✘ ${label}: ${token}`);
    }

    private printHelp() {
        [
            '<key> <guess>[,<guess>...]: Attempt answer(s) to current item for the specified key',
            'skip: Skip current item',
            'cheat: Display answer(s) to current item',
            'cheat <key>: Display answer(s) to current item for the specified key',
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