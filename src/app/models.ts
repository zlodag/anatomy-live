import * as firebase from 'firebase';

export interface Region {
  ts: Date | firebase.firestore.FieldValue;
}

export interface Item {
  ts: Date | firebase.firestore.FieldValue;
  region: string;
}

export const DETAIL_FIELDS = [
  'Introduction',
  'Structure',
  'Superior relations',
  'Inferior relations',
  'Anterior relations',
  'Posterior relations',
  'Medial relations',
  'Lateral relations',

  'Superior boundary',
  'Inferior boundary',
  'Anterior boundary',
  'Posterior boundary',
  'Medial boundary',
  'Lateral boundary',
  'Contents',
  'Articulations',
  'Attachments',
  'Special structures',
  'Nerve supply',
  'Arterial supply',
  'Venous drainage',
  'Lymphatic drainage',
  'Variants'
];

export interface Details {

    Introduction?: string[];
    Structure?: string[];

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

    Contents?: string[];
    Articulations?: string[];
    Attachments?: string[];
    'Special structures'?: string[];

    'Nerve supply'?: string[];
    'Arterial supply'?: string[];
    'Venous drainage'?: string[];
    'Lymphatic drainage'?: string[];

    Variants?: string[];
}
