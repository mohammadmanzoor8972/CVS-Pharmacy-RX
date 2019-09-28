import { Injectable } from '@angular/core';

@Injectable()
export class NavbarService {
  visible: boolean;
  loggedIn: boolean;

  constructor() {
    this.visible = false;
    if (this.checkUserSession()) {
      this.loggedIn = true;
    }else {
      this.loggedIn = false;
    }
  }

  checkUserSession() {
    return sessionStorage.getItem('Session') !== null;
  }

  hide() { this.visible = false; }

  show() { this.visible = true; }

  logIn () {this.loggedIn = true; }

  logOut() { this.loggedIn = false; }

}
