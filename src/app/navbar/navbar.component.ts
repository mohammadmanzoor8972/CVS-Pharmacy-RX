import { Component, OnInit } from '@angular/core';
import { NavbarService } from './navbar.service';
import { CmsService } from '../services/cms.service';
import { UserService } from '../services/user.service';

class CmsView {
  navLinks: any;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public view: CmsView;
  public testStuff = true;

  constructor(public nav: NavbarService, public cms: CmsService,  private userService: UserService) {
    this.cms.getContent('componentNavBar', this.setNavView.bind(this));
   }

   ngOnInit() {
   this.userService.notifyLoginLogout.subscribe( data => {
     console.log('notifyLoginLogout in NavbarService ', data);
      this.nav.loggedIn = data;
   });
 }

setNavView (content: any) {
  this.view = content.fields;
}

}
