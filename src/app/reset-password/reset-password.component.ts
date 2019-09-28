import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CvsService } from '../services/cvs-services/cvs.services';
import { NotifyService } from '../services/notification/notify.service';
import { NotifyEnum } from '../shared/enums/notify.enum';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public token: string;
  public resetPasswordForm: FormGroup;
  public showMessage: Boolean = false;
  public password_limits: Boolean = false;
  passwordSideText = [
    'Minimum of eight characters',
    'Contain at least one uppercase, one lowercase letter and one number',
    'Not contain special characters'
  ];

  constructor(private activatedRoute: ActivatedRoute,  private cvsService: CvsService, private notifyService: NotifyService) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['resetToken'];
      console.log(this.token);
  });
  }

  ngOnInit() {
    this.resetPasswordForm = new FormGroup({
      'newPassword': new FormControl(null, Validators.required),
      'confirmPassword': new FormControl(null, Validators.required)
    });

    this.showMessage = false;
  }

  inputFocused() {
    this.password_limits = true;
   }

  looseFocus() {
  this.password_limits = false;
  //this.checkPassword();
  }
  checkPassword() {
  if (this.resetPasswordForm.get('confirmPassword').value !== '' &&
       (this.resetPasswordForm.get('newPassword').value !== this.resetPasswordForm.get('confirmPassword').value)) {
      // this.resetPasswordForm.controls['confirmPassword'].setErrors({'incorrect': true});
      return false;
      } else {
       // this.resetPasswordForm.controls['confirmPassword'].setErrors({});
       return true
      }
    }
    
  NotAllowedSpecialCharacter(data: string) {
    const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (format.test(data)) {
      return true;
    } else {
      return false;
    }
  }

  get newPassword() {
    return this.resetPasswordForm.get('newPassword');
  }
  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }

  onSubmit() {
    const formData = this.resetPasswordForm.value;
    formData.token = this.token;
    this.cvsService.resetPassword(formData).subscribe((data) => {
      console.log(data, 'data===');
      this.showMessage = true;
      this.notifyService.setMessage.next(NotifyEnum.SUCCESS);
    }, 
    (errorResponse: Response) => {
      //console.log(error);
      //this.showMessage = false;
     if (errorResponse['error']['code'] === 'RESET_TOKEN_ALREADY_USED') {
        this.notifyService.setMessage.next(NotifyEnum.RESET_TOKEN_ALREADY_USED);
     } 
     else if (errorResponse['error']['code'] === 'INVALID_PASSWORD') {
          this.notifyService.setMessage.next(NotifyEnum.INVALID_PASSWORD);
      }
      this.resetPasswordForm.reset();
    });
  }

}
