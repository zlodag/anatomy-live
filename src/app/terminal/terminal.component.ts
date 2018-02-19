import { NgModule, Component, OnInit, AfterViewInit, AfterViewChecked, OnDestroy, ElementRef } from '@angular/core';
import { TerminalService } from './terminal.service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
    selector: 'app-terminal',
	templateUrl: './terminal.component.html',
	styleUrls: ['./terminal.component.css'],
	providers: [TerminalService]
})
export class TerminalComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

    lines: string[] = [];

    command: string;

    container: Element;

    scrollToBottom: boolean;

    responseSubscription: Subscription;
    itemSubscription: Subscription;

    constructor(public el: ElementRef, public terminalService: TerminalService) {
        this.terminalService.progress.connect();
    }

    itemId: string = null;

    ngOnInit() {
        this.responseSubscription = this.terminalService.output.subscribe(text => {
            this.lines.push(text);
            this.scrollToBottom = true;
        });
        this.itemSubscription = this.terminalService.itemId.subscribe(
            id => this.itemId = id,
            error => {},
            () => {
                this.responseSubscription.unsubscribe();
                this.itemId = null;
                this.lines.push('Finished!');
            }
        );
    }

    ngAfterViewInit() {
        this.container = this.el.nativeElement.querySelector('#anatomy-terminal');
    }

    ngAfterViewChecked() {
        if (this.scrollToBottom) {
            this.container.scrollTop = this.container.scrollHeight;
            this.scrollToBottom = false;
        }
    }

    handleCommand(event: KeyboardEvent) {
        if (event.keyCode == 13) {
            this.terminalService.sendCommand(this.command);
            this.command = '';
        }
    }

    focus(element: HTMLElement) {
        element.focus();
    }

    ngOnDestroy() {
        if (this.responseSubscription) {
            this.responseSubscription.unsubscribe();
        }
        if (this.itemSubscription) {
            this.itemSubscription.unsubscribe();
        }
    }

}
