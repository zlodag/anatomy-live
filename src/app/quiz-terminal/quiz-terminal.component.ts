import { Component, OnInit } from '@angular/core';
// import {TerminalService} from '../terminal.service';
// import {TerminalService} from 'primeng/components/terminal/terminalservice';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/switchMap';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Details } from '../models';

@Component({
  selector: 'app-quiz-terminal',
  templateUrl: './quiz-terminal.component.html',
  styleUrls: ['./quiz-terminal.component.css'],
  // providers: [TerminalService]
})
export class QuizTerminalComponent implements OnInit {

	constructor(private route: ActivatedRoute, private readonly afs: AngularFirestore) { }

	index = 0;
	itemIds: string[];
	currentId: Subject<string> = new Subject();
	currentDetails: Observable<Details>;

	// command: string;
	// commands = [
	// 	{ text: "Help to be a better terminal"},
	// 	{ text: "Help to be a better terminal"},
	// 	{ text: "Help to be a better terminal"},
	// 	{ text: "Help to be a better terminal"},
	// 	{ text: "Help to be a better terminal"},
	// 	{ text: "Help to be a better terminal"},
	// 	{ text: "Help to be a better terminal"},
	// 	{ text: "Help to be a better terminal"},
	// 	{ text: "Help to be a better terminal"},
	// 	{ text: "Help to be a better terminal"},
	// 	{ text: "Help to be a better terminal"},
	// 	{ text: "Help to be a better terminal"},
	// 	{ text: "Help to be a better terminal"},
	// 	{ text: "Help to be a better terminal"},
	// 	{ text: "Help to be a better terminal"},
	// 	{ text: "Help to be a better terminal"},
	// 	{ text: "Help to be a better terminal"},

	// ];

	// handleCommand(event: KeyboardEvent) {
 //        if(event.keyCode == 13) {
 //            this.commands.push({text: this.command});
 //            // this.terminalService.sendCommand(this.command);
 //            this.command = '';
 //        }
 //    }

	ngOnInit() {
		// let regionId = this.route.snapshot.paramMap.get('region');
		// console.log(`regionId: ${regionId}`);
		// console.log('Loading...');
		// // this.terminalService.sendResponse('Loading...');
		// this.afs.collection('/items', ref => regionId ? ref.where('region', '==', regionId) : ref).snapshotChanges().map(actions => shuffleAndReturn(actions.map(a => a.payload.doc.id))).first().subscribe(ids => {
		// 	this.itemIds = ids;
		// 	// this.terminalService.sendResponse('Loaded items: ' + this.itemIds.length);
		// 	console.log('Loaded items: ' + this.itemIds.length);
		// 	this.loadDetails();
		// });
		// this.currentDetails = this.currentId.switchMap(currentId => this.afs.collection('/details').doc<Details>(currentId).valueChanges().first());
		// combineLatest(this.currentDetails, this.terminalService.commandHandler).subscribe(([details, command]) => {
		// 	console.log(`Details: ` + JSON.stringify(details));
		// 	console.log(`Command: ` + JSON.stringify(command));
		// 	this.terminalService.sendResponse('Nice!');
		// 	this.terminalService.sendResponse('Nice afain!');
		// });
		// this.currentId.subscribe(id => console.log(JSON.stringify(id)));
		// this.currentDetails.subscribe(details => console.log(JSON.stringify(details)));
		// // this.terminalService.commandHandler.subscribe(command => {
		// // 	if (!this.itemIds) {
		// // 		return this.terminalService.sendResponse('Not yet loaded, please wait...');
		// // 	}
		// // 	if (this.index >= this.itemIds.length) {
		// // 		return this.terminalService.sendResponse('No more items!');
		// // 	}
		// // 	let itemId = 
		// // 	let response = (command === 'date') ? new Date().toDateString() : 'Unknown command: ' + command;
		// // 	this.terminalService.sendResponse(response);
		// // });
		// this.terminalService.
	}

	// loadDetails() {
	// 	// if (this.index < this.itemIds.length) {
	// 	// 	this.currentId.next(this.itemIds[this.index]);
	// 	// } else {
	// 	// 	this.terminalService.sendResponse('No more items!');
	// 	// }
	// }

}

// function shuffleAndReturn(array) {
//   for (let i = array.length - 1, j = 0, temp = null; i > 0; i -= 1) {
//     j = Math.floor(Math.random() * (i + 1))
//     temp = array[i]
//     array[i] = array[j]
//     array[j] = temp
//   }
//   return array;
// }