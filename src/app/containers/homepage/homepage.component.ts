import { Component, OnInit, Input } from '@angular/core';
import {CmsService} from '../../services/cms.service';
import {CmsHelpers} from '../../cms-helpers';
import {Title, Meta} from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { NavbarService } from '../../navbar/navbar.service';

class HomeView {
  listItems: string[];
  subHeader: object;
  signUp: object;
  }

@Component({
  selector: 'app-homepage',
  templateUrl: 'homepage.component.html',
  styleUrls: ['homepage.component.scss']
})
export class HomepageComponent extends CmsHelpers implements OnInit {

  homeView: HomeView;

  ngOnInit() {
     this.nav.hide();
  }

  constructor(cms: CmsService, private titleService: Title, private metaService: Meta, public nav: NavbarService, public userService:UserService) {
    super();
   cms.getContent('pageHome', this.setView.bind(this));
  }

  setView(cmsData: any) {
    this.homeView = cmsData.fields;
    console.log('THIS IS THE HOMEPAGE CMS : ', this.homeView);
  }
}
