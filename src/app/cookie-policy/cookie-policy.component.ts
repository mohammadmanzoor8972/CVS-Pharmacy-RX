import { Component, OnInit } from '@angular/core';
import { CmsService } from '../services/cms.service';
import { NavbarService } from '../navbar/navbar.service';

class CookiePolicy {
  mainHeader: string;
  textLink: object;
  subHeader: any;
  sectionContent: any;
}

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.scss']
})
export class CookiePolicyComponent implements OnInit {
  public cookieView: CookiePolicy;
  constructor(cms: CmsService, private nav: NavbarService) {
    cms.getContent('pageCookiePolicy', this.setView.bind(this));
   }

  ngOnInit() {
    this.nav.show();
  }

  setView(cmsData: any) {
    console.log(cmsData);
    this.cookieView = cmsData.fields;
  }

}
