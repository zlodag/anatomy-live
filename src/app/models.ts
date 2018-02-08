export interface Region {
	name: string;
}

export interface Item {

  	introduction: string[];
  	structure: string[];

  	superiorRelations: string[];
  	inferiorRelations: string[];
  	anteriorRelations: string[];
  	posteriorRelations: string[];
  	medialRelations: string[];
  	lateralRelations: string[];

  	superiorBoundary: string[];
  	inferiorBoundary: string[];
  	anteriorBoundary: string[];
  	posteriorBoundary: string[];
  	medialBoundary: string[];
  	lateralBoundary: string[];

  	contents: string[];
  	articulations: string[];
  	attachments: string[];
  	specialStructures: string[];

  	nerveSupply: string[];
  	arterialSupply: string[];
  	venousDrainage: string[];
  	lymphaticDrainage: string[];

  	variants: string[];
}