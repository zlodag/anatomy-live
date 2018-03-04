interface FieldSpec {
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

interface Entry {
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
