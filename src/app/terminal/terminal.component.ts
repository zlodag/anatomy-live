import {NgModule,Component,AfterViewInit,AfterViewChecked,OnDestroy,Input,Output,EventEmitter,ElementRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TerminalService} from './terminal.service';
import {Subscription}   from 'rxjs/Subscription';

@Component({
    selector: 'anatomy-terminal',
	templateUrl: './terminal.component.html',
	styleUrls: ['./terminal.component.css'],
	providers: [TerminalService]
})
export class TerminalComponent implements AfterViewInit,AfterViewChecked,OnDestroy {

    @Input() welcomeMessage: string;

    @Input() prompt: string;
        
    @Input() style: any;
        
    @Input() styleClass: string;
            
    lines: any[] = [];
    
    command: string;
    
    container: Element;
    
    commandProcessed: boolean;
    
    subscription: Subscription;
    
    constructor(public el: ElementRef, public terminalService: TerminalService) {
        this.subscription = terminalService.responseHandler.subscribe(response => {
            // this.lines[this.lines.length - 1].response = response;
            this.lines.push({text: response});
            this.commandProcessed = true;
        });
    }

    ngAfterViewInit() {
        // this.container = this.domHandler.find(this.el.nativeElement, '.ui-terminal')[0];
        this.container = this.el.nativeElement.querySelectorAll('.anatomy-terminal')[0];
    }
    
    ngAfterViewChecked() {
        if(this.commandProcessed) {
            this.container.scrollTop = this.container.scrollHeight;
            this.commandProcessed = false;
        }
    }

    // @Input()
    // set response(value: string) {
    //     if(value) {
    //         this.lines[this.lines.length - 1].response = value;
    //         this.commandProcessed = true;
    //     }
    // }
    
    handleCommand(event: KeyboardEvent) {
        if(event.keyCode == 13) {
            this.lines.push({text: this.command});
            this.terminalService.sendCommand(this.command);
            this.command = '';
        }
    }
    
    focus(element: HTMLElement) {
        element.focus();
    }
    
    ngOnDestroy() {
        if(this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    
}

// @NgModule({
//     imports: [CommonModule,FormsModule],
//     exports: [TerminalComponent],
//     declarations: [TerminalComponent]
// })
// export class TerminalModule { }