import { Component, OnInit } from '@angular/core';
import { CmsService } from '../services/cms.service';
import { NavbarService } from '../navbar/navbar.service';

class PrivacyView {
  mainHeader: any;
  textLink: any;
}

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  public privacyInfo: PrivacyView;

  constructor(cms:CmsService, private nav: NavbarService) { 
    cms.getContent('privacyPolicy', this.setView.bind(this));

  }

  ngOnInit() {
    this.nav.show();
  }
  setView(cmsData: any) {
    this.privacyInfo = cmsData.fields;
  }

}
