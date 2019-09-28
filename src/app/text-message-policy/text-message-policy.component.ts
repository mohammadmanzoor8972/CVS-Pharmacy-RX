import { Component, OnInit } from '@angular/core';
import { CmsService } from '../services/cms.service';
import { NavbarService } from '../navbar/navbar.service';

class TextPolicy {
  mainHeader: string;
  textLink: object;
  subHeader: any;
  sectionContent: any;
}

@Component({
  selector: 'app-text-message-policy',
  templateUrl: './text-message-policy.component.html',
  styleUrls: ['./text-message-policy.component.scss']
})
export class TextMessagePolicyComponent implements OnInit {
  public view: TextPolicy;
  constructor(cms: CmsService, private nav: NavbarService) {
    cms.getContent('pageTextMessagePolicy', this.setView.bind(this));
   }

  ngOnInit() {
    this.nav.show();
  }

  setView(cmsData: any) {
    this.view = cmsData.fields;
  }

}
