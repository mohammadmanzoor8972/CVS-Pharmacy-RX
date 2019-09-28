import { Component, OnInit } from '@angular/core';
import {CmsService} from '../services/cms.service';
import {CmsHelpers} from '../cms-helpers';

class View {
  footerLinks: any;
  footerLogo: any;
  inCommUrl: string; 
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends CmsHelpers implements OnInit {

  view: View;

  constructor(cms: CmsService) {
    super();
     cms.getContent('footerPage', this.setView.bind(this));
  }


  ngOnInit() {
  }


  setView(cmsData: any) {
     this.view = cmsData.fields;
     console.log(this.view);
   }
}
