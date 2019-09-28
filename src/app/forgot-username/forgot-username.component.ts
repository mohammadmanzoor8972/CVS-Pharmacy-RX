import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NotifyService } from "../services/notification/notify.service";
import { NotifyEnum } from "../shared/enums/notify.enum";
import { CvsService } from "../services/cvs-services/cvs.services";
import { NavbarService } from "../navbar/navbar.service";
import { EmailValidator } from "../shared/validators/email.validator";

@Component({
  selector: "app-forgot-username",
  templateUrl: "./forgot-username.component.html",
  styleUrls: ["./forgot-username.component.scss"]
})
export class ForgotUsernameComponent implements OnInit {
  forgotUserNameForm: FormGroup;
  showMessage: Boolean = false;

  constructor(
    private router: Router,
    private cvsService: CvsService,
    private nav: NavbarService,
    private notifyService: NotifyService
  ) {
    this.nav.show();
  }

  ngOnInit() {
    this.forgotUserNameForm = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.email,
        EmailValidator.email
      ])
    });
    this.showMessage = false;
  }

  get email() {
    return this.forgotUserNameForm.get("email");
  }

  onSubmit() {
    this.cvsService.forgotUserName(this.forgotUserNameForm.value).subscribe(
      data => {
        this.showMessage = true;
        this.notifyService.setMessage.next(NotifyEnum.USERNAME_EMAIL);
        this.forgotUserNameForm.reset();
      },
      error => {
        this.showMessage = false;
        this.notifyService.setMessage.next(NotifyEnum.WRONG_EMAIL);
        this.forgotUserNameForm.reset();
      }
    );
  }
}
