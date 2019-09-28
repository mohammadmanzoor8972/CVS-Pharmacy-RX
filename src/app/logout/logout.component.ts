import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import { NavbarService } from '../navbar/navbar.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private userService: UserService, private router: Router, private nav:NavbarService) { }

  ngOnInit() {
    this.userService.logout();
    this.nav.hide();
    this.router.navigate(['/']);
  }

}
