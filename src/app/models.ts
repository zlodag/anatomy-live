import { firestore } from 'firebase';

export interface Region {
  ts: Date | firestore.FieldValue;
}

export interface Item {
  ts: Date | firestore.FieldValue;
  region: string;
}

export interface DetailField {
    key: string;
    shortcut: string;
}

export const DETAIL_FIELDS: DetailField[] = [
  {key: 'Introduction', shortcut: 'in'},
  {key: 'Structure', shortcut: 'st'},

  {key: 'Superior relations', shortcut: 'sr'},
  {key: 'Inferior relations', shortcut: 'ir'},
  {key: 'Anterior relations', shortcut: 'ar'},
  {key: 'Posterior relations', shortcut: 'pr'},
  {key: 'Medial relations', shortcut: 'mr'},
  {key: 'Lateral relations', shortcut: 'lr'},

  {key: 'Superior boundary', shortcut: 'sb'},
  {key: 'Inferior boundary', shortcut: 'ib'},
  {key: 'Anterior boundary', shortcut: 'ab'},
  {key: 'Posterior boundary', shortcut: 'pb'},
  {key: 'Medial boundary', shortcut: 'mb'},
  {key: 'Lateral boundary', shortcut: 'lb'},

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

export interface Details {

    'Introduction'?: string[];
    'Structure'?: string[];

    'Superior relations'?: string[];
    'Inferior relations'?: string[];
    'Anterior relations'?: string[];
    'Posterior relations'?: string[];
    'Medial relations'?: string[];
    'Lateral relations'?: string[];

    'Superior boundary'?: string[];
    'Inferior boundary'?: string[];
    'Anterior boundary'?: string[];
    'Posterior boundary'?: string[];
    'Medial boundary'?: string[];
    'Lateral boundary'?: string[];

    'Contents'?: string[];
    'Articulations'?: string[];
    'Attachments'?: string[];
    'Special structures'?: string[];

    'Nerve supply'?: string[];
    'Arterial supply'?: string[];
    'Venous drainage'?: string[];
    'Lymphatic drainage'?: string[];

    'Variants'?: string[];
}

export interface QuizDetail {
    text: string;
    done: boolean;
}

export interface QuizDetails {
    [key: string]: QuizDetail[];
}

export interface QuizItem {
    id: string;
    details: QuizDetails;
    total: number;
    remainder: number;
}

export interface PrintField {
    key: string;
    items: string[];
}

export interface Progress {
    id: string; 
    completed: PrintField[];
    remaining: PrintField[];
}