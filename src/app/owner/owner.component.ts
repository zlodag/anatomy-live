import { Component } from '@angular/core';
import { OwnerService } from '../owner.service';

@Component({
  template: '<router-outlet></router-outlet>',
  providers: [OwnerService]
})
export class OwnerComponent {
}
