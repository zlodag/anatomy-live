import {NgModule,Component,OnInit, AfterViewInit,AfterViewChecked,OnDestroy,Input,Output,EventEmitter,ElementRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TerminalService} from './terminal.service';
import {Subscription}   from 'rxjs/Subscription';

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

    @Input() prompt: string;
        
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
        this.responseSubscription = this.terminalService.responseHandler.subscribe(response => {
            // this.lines[this.lines.length - 1].response = response;
            this.lines.push({text: response, command: false});
            this.scrollToBottom = true;
        });
        this.terminalService.testAll();
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
            this.lines.push({text: this.command, command: true});
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