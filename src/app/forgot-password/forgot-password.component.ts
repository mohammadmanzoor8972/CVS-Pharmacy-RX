import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CmsService } from "../services/cms.service";
import { CmsHelpers } from "../cms-helpers";
import { NotifyService } from "../services/notification/notify.service";
import { NotifyEnum } from "../shared/enums/notify.enum";
import { CvsService } from "../services/cvs-services/cvs.services";
import { NavbarService } from "../navbar/navbar.service";
import { EmailValidator } from "../shared/validators/email.validator";

class View {
  topLabel: string;
  emailLabel: string;
  emailReqError: string;
  incorrectEmailError: string;
  submitButtonText: string;
}
@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent extends CmsHelpers implements OnInit {
  view: View;
  forgotPasswordForm: FormGroup;
  showMessage: Boolean = false;

  constructor(
    private router: Router,
    private cms: CmsService,
    private nav: NavbarService,
    private cvsService: CvsService,
    private notifyService: NotifyService
  ) {
    super();

    cms.getContent("pageForgotPassword", this.setView.bind(this));
    this.nav.show();
  }

  ngOnInit() {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.email,
        EmailValidator.email
      ])
    });
    this.showMessage = false;
  }
  setView(cmsData: any) {
    this.view = cmsData.fields;
  }
  get email() {
    return this.forgotPasswordForm.get("email");
  }

  onSubmit() {
    this.cvsService.forgotPassword(this.forgotPasswordForm.value).subscribe(
      data => {
        // this.cvsService.setUserInfo(data.body.payload);
        this.showMessage = true;
        this.notifyService.setMessage.next(NotifyEnum.USERNAME_PASSWORD);
        this.forgotPasswordForm.reset();

        // this.router.navigateByUrl('/sign-in');
      },
      error => {
        this.showMessage = false;
        this.notifyService.setMessage.next(NotifyEnum.WRONG_EMAIL);
        this.forgotPasswordForm.reset();
      }
    );
  }
}
