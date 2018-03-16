import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDragDropUpload]'
})
export class DragDropUploadDirective {

  @HostBinding('style.background') private background = '#eee';

  constructor() { }

  @HostListener('dragover', ['$event']) onDragOver(evt){
    evt.preventDefault();
    evt.stopPropagation();
    evt.dataTransfer.dropEffect = 'copy';
    // console.log("dragOver: dropEffect = " + evt.dataTransfer.dropEffect + " ; effectAllowed = " + evt.dataTransfer.effectAllowed);
    // console.log(JSON.stringify(evt.dataTransfer.types));
    this.background = '#999';

    let files = evt.dataTransfer.files;
    if(files.length > 0){
      //do some stuff here
    }
    let items = evt.dataTransfer.items;
    if(items.length > 0){
      for (var i = 0; i < items.length; i++) {
      	console.log(i + ': ' + items[i].type);
      }
    }
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt){
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';

    //do some stuff
  }

  @HostListener('drop', ['$event']) public onDrop(evt){
    evt.preventDefault();
    evt.stopPropagation();
    console.log("drop: dropEffect = " + evt.dataTransfer.dropEffect + " ; effectAllowed = " + evt.dataTransfer.effectAllowed);

    let files = evt.dataTransfer.files;
    if(files.length > 0){
    	for (var i = 0; i < files.length; i++) {
    		console.log(files[i].name);
    	}
      //do some stuff
    }
  }

}
