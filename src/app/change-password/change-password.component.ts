import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators, NgModel } from '@angular/forms';
import { Router, NavigationEnd } from "@angular/router";
import { NavbarService } from '../navbar/navbar.service';
import { CvsService } from '../services/cvs-services/cvs.services';
import { CmsService } from '../services/cms.service';
import { CmsHelpers } from '../cms-helpers';
import { NotificationService } from '../services/notification/Notification.service';
import { UserService } from '../services/user.service';
import { NotifyService } from '../services/notification/notify.service';
import { NotifyEnum } from '../shared/enums/notify.enum';
class View {
  authField: any;
  buttonLabel: string;
  confirmPasswordLabel: string;
  currentPasswordLabel: string;
  newPasswordLabel: string;
  passwordSideText: any;
  topLabel: string;
 }

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent extends CmsHelpers  implements OnInit, OnDestroy {
  view: View;
  navigationSubscription;
  changePasswordForm: FormGroup;
  errorMessageDisplay: boolean = false;
  errorMessage: string;
  errorFound: string;
  password_limits: Boolean = false;
  showMessage: Boolean = false;

  constructor(private router: Router, private cms: CmsService,
    private nav: NavbarService, private cvsService: CvsService,
    private notification: NotificationService, private userService: UserService, private notifyService: NotifyService) {
    super();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseValues();
      }
    });
    if (!this.userService.isLoggedIn()) {
      this.router.navigateByUrl('/sign-in');
    }
  }

  checkPasswords() {
   if (this.changePasswordForm.get('oldPassword').value !== '' && this.changePasswordForm.get('newPassword').value !== ''
      && this.changePasswordForm.get('newPassword').value === this.changePasswordForm.get('oldPassword').value) {
            this.changePasswordForm.setErrors({ 'invalid': true });
            return true;
          }
  }

  checkCurrentNewPasswords() {
    if (this.changePasswordForm.get('confirmPassword').value !== '' &&
    this.changePasswordForm.get('newPassword').value !== this.changePasswordForm.get('confirmPassword').value){
      this.changePasswordForm.setErrors({ 'invalid': true });
      return true;
    }
  }

  initialiseValues() {
    this.cms.getContent('changepassword', this.setView.bind(this));
    this.showMessage = false;
    this.notifyService.setMessage.next(NotifyEnum.HIDE);
    this.nav.show();
    this.changePasswordForm = new FormGroup({
      'oldPassword' :  new FormControl(null, Validators.required),
      'newPassword': new FormControl(null, Validators.required),
      'confirmPassword': new FormControl(null, Validators.required)
    });
  }

  ngOnInit() {
  }
  setView(cmsData: any) {
    console.log('CMS ChangePassword : ', cmsData.fields);
    this.view = cmsData.fields;
    }

      inputFocused() {
      this.password_limits = true;
     }
     looseFocus() {
      this.password_limits = false;
     }

  get oldPassword()  {
    return this.changePasswordForm.get('oldPassword');
  }
  get newPassword() {
    return this.changePasswordForm.get('newPassword');
  }
  get confirmPassword() {
    return this.changePasswordForm.get('confirmPassword');
  }

  
  NotAllowedSpecialCharacter(data:string){
    var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    if(format.test(data)){
      return true;
    } else {
      return false;
    }
  }

  onSubmit() {
    // this.errorFound = "";
    console.log(this.changePasswordForm.value, 'sign===');
    this.cvsService.changePassword(this.changePasswordForm.value).subscribe((data) => {
      this.showMessage = true;
      this.notifyService.setMessage.next(NotifyEnum.SUCCESS);
        }, 
        (errorResponse: Response) => {
          //console.log(errorResponse);
         // this.notifyService.setMessage.next(NotifyEnum.CHANGEPWD);
          // his.errorFound = "Current password does not match our records. Please try again."
          // alert(this.errorFound);
          if (errorResponse["error"]["code"] === "INVALID_DATA") {
          this.notifyService.setMessage.next(NotifyEnum.CHANGEPWD);
         } else if (errorResponse["error"]["code"] === "INVALID_PASSWORD") {
            this.notifyService.setMessage.next(NotifyEnum.INVALID_PASSWORD);
          }
          this.changePasswordForm.reset();
        }
      );
  }








  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseValues()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
  }
}