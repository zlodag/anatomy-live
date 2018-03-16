interface FieldSpec {
    key: string;
    shortcut: string;
}

export const DETAIL_FIELDS: FieldSpec[] = [
  {key: 'Mnemonics', shortcut: 'mn'},
  {key: 'Introduction', shortcut: 'in'},
  {key: 'Structure', shortcut: 'st'},
  {key: 'Relations', shortcut: 're'},
  {key: 'Boundaries', shortcut: 'bo'},
  {key: 'Contents', shortcut: 'co'},
  {key: 'Articulations', shortcut: 'ar'},
  {key: 'Attachments', shortcut: 'at'},
  {key: 'Special structures', shortcut: 'ss'},
  {key: 'Nerve supply', shortcut: 'ns'},
  {key: 'Arterial supply', shortcut: 'as'},
  {key: 'Venous drainage', shortcut: 'vd'},
  {key: 'Lymphatic drainage', shortcut: 'ld'},
  {key: 'Variants', shortcut: 'va'},
];

export interface Entry {
  key: string;
  text: string;
}

export interface Field {
  key: string;
  entries: Entry[];
}

export interface EntryProgress {
  key: string;
  text: string;
  done: boolean;
}

export interface Progress {
  [key: string]: EntryProgress[];
}

export interface RestoreObject {
  regions: any;
  items: any;
  details: any;
}

export interface Node {
  key: string;
  name: string;
}

export interface LinkNode extends Node {
  timestamp: number;
}

