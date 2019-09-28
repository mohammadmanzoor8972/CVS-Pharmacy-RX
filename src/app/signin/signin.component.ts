import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CmsService } from '../services/cms.service';

import { CvsService } from '../services/cvs-services/cvs.services';
import { NavbarService } from '../navbar/navbar.service';
import { UserService } from '../services/user.service';

class CmsView {
  listItems: string[];
  subHeader: object;
  signIn: any;

}

@Component({
  selector: 'app-signin',
  moduleId: module.id,
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  setSpanish = localStorage.getItem('btnCss');
  signInForm: FormGroup;
  signInInfo;
  public view: CmsView;
  errorMsg: string;
  // disableSignin: boolean;
  model: any = {};
  loading = false;
  error = '';
  alphaNumeric = /^[0-9a-zA-Z]+$/;
  showLoginAttemptsError: boolean;

  constructor(private router: Router,
    private cms: CmsService, private cvs: CvsService, private nav: NavbarService,
    private userService: UserService) {

    if (this.userService.isLoggedIn()) {
      this.router.navigate(['/transaction-landing-page']);
    }

    cms.getContent('pageHome', this.setView.bind(this));
  }

  // getSignUpDetails
  ngOnInit() {
    // reset login status
    this.nav.hide();
    this.signInForm = new FormGroup({
      'username': new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern(this.alphaNumeric)]),
      'password': new FormControl('', [Validators.required, Validators.minLength(8)]),
      'recaptcha' : new FormControl('', [Validators.required])
    });
    // if (sessionStorage.getItem('loginStatus') === 'disabled') {
    //   this.disableSignin = true;
    // }
    // this.userService.notifyDisableLogin.subscribe((value) => {
    //   this.disableSignin = value;
    //   console.log('This is desable Signin', this.disableSignin);
    // });
  }
  setView(cmsData: any) {
    this.view = cmsData.fields;
    console.log(this.view);
  }

  get username() {
    return this.signInInfo.get('username');
  }

  get password() {
    return this.signInInfo.get('password');
  }

  NotAllowedSpecialCharacter(data: string) {
    const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (format.test(data)) {
      return true;
    } else {
      return false;
    }
  }
  onSignIn(signInForm) {
    this.userService.login('signin', this.signInForm.value);
    // this.disableSignin = this.userService.disableSignin;
    this.signInForm.reset();
  }
}
