import { Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DETAIL_FIELDS } from '../models';

interface BackupObject {
  regions: any;
  items: any;
  details: any;
  images: any;
}

interface Node {
  key: string;
}

interface TextNode extends Node {
  text: string;
}

interface ImageNode extends Node {
  url: string;
  filename: string;
}

interface FieldNode extends Node {
  items: TextNode[]
}

interface ItemNode extends TextNode {
  details: FieldNode[];
  images: ImageNode[];
}

interface RegionNode extends TextNode {
  items: ItemNode[];
}

interface FileReaderEventTarget extends EventTarget {
    result: string;
}

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
})
export class RestoreComponent {

  constructor() { }

  selectedFile: File = null;

  backup: BackupObject;

  regions: RegionNode[];

  fileSelected(files: FileList) {
    this.selectedFile = files.length ? files[0] : null;
    if (this.selectedFile) {
      // this.auth.authState.first().subscribe(user => {
      // if (user) {
      const reader = new FileReader();
      reader.onload = event => {
        const json = (<FileReaderEventTarget>event.target).result;
        this.backup = JSON.parse(json);
        const regions: RegionNode[] = [];
        for (let regionKey in this.backup.regions) {
          const region: RegionNode = {
            key: regionKey,
            text: this.backup.regions[regionKey],
            items: [],
          };
          for (let itemKey in this.backup.items[regionKey]) {
            const item: ItemNode = {
              key: itemKey,
              text: this.backup.items[regionKey][itemKey],
              details: [],
              images: [],
            };
            DETAIL_FIELDS.forEach(detailField => {
              if (detailField.key in this.backup.details[regionKey][itemKey]) {
                const field: FieldNode = {
                  key: detailField.key,
                  items: [],
                };
                for (let entryKey in this.backup.details[regionKey][itemKey][detailField.key]) {
                  const entry: TextNode = {
                    key: entryKey,
                    text: this.backup.details[regionKey][itemKey][detailField.key][entryKey],
                  };
                  field.items.push(entry);
                }
                item.details.push(field);
              }
            });
            // for (let fieldKey in this.backup.details[regionKey][itemKey]){
            // for (let fieldKey in this.backup.details[regionKey][itemKey]){
            //   const field: FieldNode = {
            //     key: fieldKey,
            //     items: [],
            //   };
            //   for (let entryKey in this.backup.details[regionKey][itemKey][fieldKey]) {
            //     const entry: TextNode = {
            //       key: entryKey,
            //       text: this.backup.details[regionKey][itemKey][fieldKey][entryKey],
            //     };
            //     field.items.push(entry);
            //   }
            //   item.details.push(field);
            // }
            for (let imageKey in this.backup.images[regionKey][itemKey]){
              const image: ImageNode = {
                key: imageKey,
                url: this.backup.images[regionKey][itemKey][imageKey].url,
                filename: this.backup.images[regionKey][itemKey][imageKey].filename,
              };
              item.images.push(image);
            }
            region.items.push(item);
          }
          regions.push(region);
        }
        this.regions = regions;
        // if (confirm('All existing data will be deleted')) {
        //   const updateObject = {
        //   [`regions/${user.uid}`]: this.backup.regions,
        //   [`items/${user.uid}`]: this.backup.items,
        //   [`details/${user.uid}`]: this.backup.details,
        //   [`images/${user.uid}`]: this.backup.images,
        //   };
        //   this.db.database.ref().update(updateObject, error => {
        //   if (error) {
        //     // alert(error.message);
        //     console.error(error.message);
        //   } else {
        //     alert('Successfully restored from backup file');
        //   }
        //   });
        // }
      };
      reader.readAsText(this.selectedFile);
    }
  }

}
