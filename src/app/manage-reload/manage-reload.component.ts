import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarService } from '../navbar/navbar.service';
import { UserService } from '../services/user.service';
import { CmsService } from '../services/cms.service';

class PageView {
  buttonLeftText: string;
  buttonRightText: string;
  disclaimer: string;
  mainHeader: string;
}

@Component({
  selector: 'app-manage-reload',
  templateUrl: './manage-reload.component.html',
  styleUrls: ['./manage-reload.component.scss']
})
export class ManageReloadComponent implements OnInit {

  public view: PageView;

  constructor(private router: Router, private nav: NavbarService, private userService: UserService, cms: CmsService) {
    if (!this.userService.isLoggedIn()) {
      this.router.navigateByUrl('/sign-in');
    }
    cms.getContent('pageManageAutomaticReload', this.setView.bind(this));
  }

  ngOnInit() {

    this.nav.show();

  }

  setView(info: any) {
    this.view = info.fields;
    console.log('MANAGE RELOAD INFORMATION -------->', this.view);
  }

  updateClick() {
    this.router.navigateByUrl('/auto-reload-update');
  }

  optOutClick() {
    this.router.navigateByUrl('/auto-reload-opt-out');
  }
}
