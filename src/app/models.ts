// import { firestore } from 'firebase';

// export interface Region {
//   ts: Date | firestore.FieldValue;
// }

// export interface Item {
//   ts: Date | firestore.FieldValue;
//   region: string;
// }

export interface FieldSpec {
    key: string;
    shortcut: string;
}

export const DETAIL_FIELDS: FieldSpec[] = [
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

export interface Entry {
  key: string;
  text: string;
}

export interface Field {
  key: string;
  entries: Entry[];
}

// export interface Details {

//     'Introduction'?: Entry[];
//     'Structure'?: Entry[];

//     'Superior relations'?: Entry[];
//     'Inferior relations'?: Entry[];
//     'Anterior relations'?: Entry[];
//     'Posterior relations'?: Entry[];
//     'Medial relations'?: Entry[];
//     'Lateral relations'?: Entry[];

//     'Superior boundary'?: Entry[];
//     'Inferior boundary'?: Entry[];
//     'Anterior boundary'?: Entry[];
//     'Posterior boundary'?: Entry[];
//     'Medial boundary'?: Entry[];
//     'Lateral boundary'?: Entry[];

//     'Contents'?: Entry[];
//     'Articulations'?: Entry[];
//     'Attachments'?: Entry[];
//     'Special structures'?: Entry[];

//     'Nerve supply'?: Entry[];
//     'Arterial supply'?: Entry[];
//     'Venous drainage'?: Entry[];
//     'Lymphatic drainage'?: Entry[];

//     'Variants'?: Entry[];

// }

// export interface Details {

//     'Introduction'?: Entry[];
//     'Structure'?: Entry[];

//     'Superior relations'?: Entry[];
//     'Inferior relations'?: Entry[];
//     'Anterior relations'?: Entry[];
//     'Posterior relations'?: Entry[];
//     'Medial relations'?: Entry[];
//     'Lateral relations'?: Entry[];

//     'Superior boundary'?: Entry[];
//     'Inferior boundary'?: Entry[];
//     'Anterior boundary'?: Entry[];
//     'Posterior boundary'?: Entry[];
//     'Medial boundary'?: Entry[];
//     'Lateral boundary'?: Entry[];

//     'Contents'?: Entry[];
//     'Articulations'?: Entry[];
//     'Attachments'?: Entry[];
//     'Special structures'?: Entry[];

//     'Nerve supply'?: Entry[];
//     'Arterial supply'?: Entry[];
//     'Venous drainage'?: Entry[];
//     'Lymphatic drainage'?: Entry[];

//     'Variants'?: Entry[];

// }

// export interface QuizDetail {
//     text: string;
//     done: boolean;
// }

// export interface QuizDetails {
//     [key: string]: QuizDetail[];
// }

// export interface QuizItem {
//     id: string;
//     details: QuizDetails;
//     total: number;
//     remainder: number;
// }

// export interface PrintField {
//     key: string;
//     entries: {
//       key: string;
//       name: string;
//     }[];
// }