import { Component, OnInit } from '@angular/core';
import { CmsHelpers } from '../../cms-helpers';
import { CmsService } from '../../services/cms.service';
import { Title, Meta } from '@angular/platform-browser';
import { NavbarService } from '../../navbar/navbar.service';

class FaqView {
  mainHeader: any;
  faqItems: any;
}

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['help-page.component.scss']
})
export class HelpPageComponent extends CmsHelpers implements OnInit {

  public faqView: FaqView;

  ngOnInit() {
    this.nav.show();
  }

  constructor(cms: CmsService, private titleService: Title, private metaService: Meta,
    private nav: NavbarService) {
    super();
    cms.getContent('componentFaq', this.setView.bind(this));
  }

  setView(cmsData: any) {
    this.faqView = cmsData.fields;
  }
}
