import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  crumbs: {
  	label: string;
  	routerLink: string[];
  }[] = [];

  // @Input() regions: boolean = false;
  @Input() quiz: boolean = false;

  ngOnInit() {
  	// console.log('About to log routes');
  	// this.route.pathFromRoot.forEach(activatedRoute => console.log(activatedRoute.toString()));
  	this.crumbs.push({
  		label: 'Home',
  		routerLink: ['/']
  	})
    if (this.route.snapshot.paramMap.has('userId')) {
      const userId = this.route.snapshot.paramMap.get('userId');
      this.crumbs.push({
        label: this.route.snapshot.data.userName,
        routerLink: ['/', userId]
      });
    	if (this.route.snapshot.data.regions) {
    		this.crumbs.push({
    			label: 'Regions',
    			routerLink: ['/', userId, 'regions']
    		});
    		if (this.route.snapshot.paramMap.has('regionId')) {
    			const regionId = this.route.snapshot.paramMap.get('regionId');
    			this.crumbs.push({
    				label: regionId,
    				routerLink: ['/', userId, 'regions', regionId]
    			});
    			if (this.route.snapshot.paramMap.has('itemId')) {
  	  			const itemId = this.route.snapshot.paramMap.get('itemId');
    				this.crumbs.push({
  	  				label: itemId,
  	  				routerLink: ['/', userId, 'regions', regionId, itemId]
  	  			});
  	  			if (this.quiz) {
  			  		this.crumbs.push({
  			  			label: 'Quiz',
  			  			routerLink: ['/', userId, 'regions', regionId, itemId, 'quiz']
  			  		});
  			  	}
    			} else if (this.quiz) {
  		  		this.crumbs.push({
  		  			label: 'Quiz (all from region)',
  		  			routerLink: ['/', userId, 'regions', regionId, 'quiz']
  		  		});
    			}
    		}
    	} else if (this.quiz) {
    		this.crumbs.push({
    			label: 'Quiz (all)',
    			routerLink: ['/', userId, 'quiz']
    		});
    	}
    }
  }

}
