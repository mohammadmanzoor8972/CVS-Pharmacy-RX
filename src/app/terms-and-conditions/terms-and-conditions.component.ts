import { Component, OnInit } from '@angular/core';
import { CmsService } from '../services/cms.service';
import { NavbarService } from '../navbar/navbar.service';

class TermsView {
  mainHeader: any;
  termsItems: any;
}

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {

  public termsInfo: TermsView;

  constructor( cms: CmsService, private nav: NavbarService ) {
    cms.getContent('componentTermsAndConditions', this.setView.bind(this));
  }

  ngOnInit() {
    this.nav.show();
  }

  setView(cmsData: any) {
    this.termsInfo = cmsData.fields;
  }

}
