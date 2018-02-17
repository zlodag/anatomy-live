import {NgModule,Component,OnInit, AfterViewInit,AfterViewChecked,OnDestroy,Input,Output,EventEmitter,ElementRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TerminalService} from './terminal.service';
import {Subscription}   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { QuizItem, Details, DETAIL_FIELDS } from '../models';

interface Line {
	text: string;
	command: boolean;
}

@Component({
    selector: 'anatomy-terminal',
	templateUrl: './terminal.component.html',
	styleUrls: ['./terminal.component.css'],
	providers: [TerminalService]
})
export class TerminalComponent implements OnInit,AfterViewInit,AfterViewChecked,OnDestroy {
            
    lines: string[] = [];
    
    command: string;
    
    container: Element;
    
    scrollToBottom: boolean;
    
    responseSubscription: Subscription;
    itemSubscription: Subscription;
    
    constructor(public el: ElementRef, public terminalService: TerminalService) {
    }

    item: QuizItem = null;
    done: {
        key: string;
        items: string[];
    }[] = [];

    ngOnInit(){
        this.responseSubscription = this.terminalService.response.subscribe(text => {
            this.lines.push(text);
            this.scrollToBottom = true;
        });
        this.itemSubscription = this.terminalService.quizItem.subscribe(
            quizItem => {
                this.item = quizItem;
                // console.log(JSON.stringify(quizItem));
                this.done = [];
                for (var i = 0; i < DETAIL_FIELDS.length; i++) {
                    const key = DETAIL_FIELDS[i].key;
                    const items = quizItem.details[key];
                    if (items) {
                        const doneItems = [];
                        items.forEach(item => {
                            if (item.done) {
                                doneItems.push(item.text);
                            }
                        });
                        if (doneItems.length) {
                            this.done.push({key: key, items: doneItems});
                        }
                    }
                }
            },
            error => {},
            () => {
                console.log('finished');
                this.done = [];
                this.item = null;
            }
        );
        // this.terminalService.item.subscribe(item => item.remainder)
        // this.itemSubscription = this.terminalService.item.subscribe(item => this.item = item, error => {}, () => this.item = null);
    }

    ngAfterViewInit() {
        this.container = this.el.nativeElement.querySelector('#anatomy-terminal');
    }
    
    ngAfterViewChecked() {
        if(this.scrollToBottom) {
            this.container.scrollTop = this.container.scrollHeight;
            this.scrollToBottom = false;
        }
    }

    handleCommand(event: KeyboardEvent) {
        if(event.keyCode == 13) {
            this.terminalService.command.next(this.command || '');
            this.command = '';
        }
    }
    
    focus(element: HTMLElement) {
        element.focus();
    }
    
    ngOnDestroy() {
        if(this.responseSubscription) {
            this.responseSubscription.unsubscribe();
        }
        if(this.itemSubscription) {
            this.itemSubscription.unsubscribe();
        }
    }
    
}
