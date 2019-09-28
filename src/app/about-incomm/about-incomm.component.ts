import { Component, OnInit } from '@angular/core';
import { CmsService } from '../services/cms.service';
import { NavbarService } from '../navbar/navbar.service';

class AboutView {
  mainHeader: string;
  aboutItems: any;
}

@Component({
  selector: 'app-about-incomm',
  templateUrl: './about-incomm.component.html',
  styleUrls: ['./about-incomm.component.scss']
})
export class AboutIncommComponent implements OnInit {

  public view: AboutView;


  constructor(cms: CmsService, private nav: NavbarService) {

    cms.getContent('pageAboutIncomm', this.setAboutView.bind(this));
  }

  ngOnInit() {
    this.nav.visible = true;
  }

  setAboutView(cmsData: any) {
    this.view = cmsData.fields;
  }

}
