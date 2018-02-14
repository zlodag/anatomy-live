import {NgModule,Component,OnInit, AfterViewInit,AfterViewChecked,OnDestroy,Input,Output,EventEmitter,ElementRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TerminalService} from './terminal.service';
import {Subscription}   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

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

    @Input() welcomeMessage: string;

    prompt: Observable<string>;

    @Input() style: any;
        
    @Input() styleClass: string;
            
    lines: Line[] = [];
    
    command: string;
    
    container: Element;
    
    scrollToBottom: boolean;
    
    responseSubscription: Subscription;
    
    constructor(public el: ElementRef, public terminalService: TerminalService) {
    }

    ngOnInit(){
        // this.prompt = this.terminalService.currentId;
        // this.prompt.subscribe(s => console.log(s));
        this.responseSubscription = this.terminalService.responseHandler.subscribe(text => {
            // this.lines[this.lines.length - 1].response = response;
            // for (var i = 0; i < lines.length; i++) {
            //     this.lines.push({text: lines[i], command: false});
            // }
            this.lines.push({text: text, command: false});
            this.scrollToBottom = true;
        });
        // this.terminalService.testAll();
    }

    ngAfterViewInit() {
        // this.container = this.domHandler.find(this.el.nativeElement, '.ui-terminal')[0];
        this.container = this.el.nativeElement.querySelectorAll('.anatomy-terminal')[0];
    }
    
    ngAfterViewChecked() {
        if(this.scrollToBottom) {
            this.container.scrollTop = this.container.scrollHeight;
            this.scrollToBottom = false;
        }
    }

    handleCommand(event: KeyboardEvent) {
        if(event.keyCode == 13) {
            // this.lines.push({text: this.command, command: true});
            this.terminalService.sendCommand(this.command);
            // this.terminalService.sendResponse('You said ' + this.command);
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
    }
    
}

// @NgModule({
//     imports: [CommonModule,FormsModule],
//     exports: [TerminalComponent],
//     declarations: [TerminalComponent]
// })
// export class TerminalModule { }