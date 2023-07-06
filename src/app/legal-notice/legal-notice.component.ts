import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-legal-notice',
  templateUrl: './legal-notice.component.html',
  styleUrls: ['./legal-notice.component.scss']
})
export class LegalNoticeComponent {

  constructor(private location: Location) { }

  goBack(): void {
    this.location.back(); // Method 1: using Location service
    // OR
    // this.router.navigate(['/previous-component']); // Method 2: using Router service
  }

}
