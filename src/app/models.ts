// export interface Region {
// 	ts: Date;
// }

// export interface Item {
//   ts: Date;
//   region: string;
// }

// export interface Details {

//     introduction: string[];
//     structure: string[];

//     superiorRelations: string[];
//     inferiorRelations: string[];
//     anteriorRelations: string[];
//     posteriorRelations: string[];
//     medialRelations: string[];
//     lateralRelations: string[];

//     superiorBoundary: string[];
//     inferiorBoundary: string[];
//     anteriorBoundary: string[];
//     posteriorBoundary: string[];
//     medialBoundary: string[];
//     lateralBoundary: string[];

//     contents: string[];
//     articulations: string[];
//     attachments: string[];
//     specialStructures: string[];

//     nerveSupply: string[];
//     arterialSupply: string[];
//     venousDrainage: string[];
//     lymphaticDrainage: string[];

//     variants: string[];
// }

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