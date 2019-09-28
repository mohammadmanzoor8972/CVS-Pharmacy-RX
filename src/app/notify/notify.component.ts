import {
  Component,
  OnInit,
  OnDestroy,
  Input
} from '@angular/core';
import { NotifyService } from '../services/notification/notify.service';
import { NotifyEnum } from '../shared/enums/notify.enum';
import { UserService } from '../services/user.service';
import 'rxjs/add/operator/takeWhile';

const SIGNIN = 'You have entered an invalid credentials. Please try again';
const SIGNUP = 'You have entered an Invalid RxReload card number and DOB combination. Please try again.';
const  CHANGEPWD = 'Current password does not match our records. Please try again.';
// tslint:disable-next-line:max-line-length
const DISABLESIGIN = 'You have too many failed login attempts. Your profile has been locked. Please wait 30 minutes and try again. If you forgot your password, you can reset it';
const SUCCESS = 'Success!';
const USERNAME_EMAIL = "An email has been sent to retrieve your username. Please check your spam folder if you don’t see it in your inbox";
const USERNAME_PASSWORD = "An email has been sent to reset your password. Please check your spam folder if you don’t see it in your inbox.";
const LOGOUT = 'You have been logged out due to inactivity. ';
const INVALID_RX = 'You have entered an invalid RxReload card number and CVV combination. Please try again.';
const PERSONAL_INFO = 'Your online profile was successfully activated.';
const WRONG_EMAIL = 'The email address you entered does not match our records. Please enter your registered email address';
const SAME_USER_PASSWORD ='Username and Password should not be same';
const USER_EMAIL_EXISTS = 'User email already exists';
const USER_NAME_EXISTS = 'User name already exists';
const ALREADY_ENROLLED = 'The profile for the RxReload card number you provided is already active. Please login using the username and password you created or enter a different RxReload card number';
const SINGLE_RELOAD_EXCEEDED = 'The reloads per day should not be more than 4, you have exceeded your limits per day';
const INVALID_PASSWORD = 'The password should not be same as username';
const CARD_NOT_FOUND = 'Please enter the valid Rxreload card number';
const RESET_TOKEN_ALREADY_USED = 'Your password has already been reset.';
const ERROR_ADD_FOUNDS = 'Your gift card could not be reloaded.  Please check your information, contact the number on the back of your card, or try again.';
@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})

export class NotifyComponent implements OnInit, OnDestroy  {

  public message: string;
  public messageType: NotifyEnum;
  @Input() inputMessage?: any;
  public messagesList = {
    'SIGNIN': SIGNIN,
    'HIDE': '',
    'SIGNUP' : SIGNUP,
    'CHANGEPWD' : CHANGEPWD,
    'DISABLESIGIN': DISABLESIGIN,
    'SUCCESS': SUCCESS,
    'USERNAME_EMAIL': USERNAME_EMAIL,
    'USERNAME_PASSWORD': USERNAME_PASSWORD,
    'LOGOUT': LOGOUT,
    'INVALID_RX': INVALID_RX,
    'PERSONAL_INFO': PERSONAL_INFO,
    'WRONG_EMAIL': WRONG_EMAIL,
    'SAME_USER_PASSWORD': SAME_USER_PASSWORD,
    'USER_EMAIL_EXISTS': USER_EMAIL_EXISTS,
    'USER_NAME_EXISTS': USER_NAME_EXISTS,
    'ALREADY_ENROLLED': ALREADY_ENROLLED,
    'SINGLE_RELOAD_EXCEEDED' : SINGLE_RELOAD_EXCEEDED,
    'INVALID_PASSWORD' : INVALID_PASSWORD,
    'CARD_NOT_FOUND'    : CARD_NOT_FOUND,
    'RESET_TOKEN_ALREADY_USED' : RESET_TOKEN_ALREADY_USED,
    'ERROR_ADD_FOUNDS'  : ERROR_ADD_FOUNDS,
  };
  alive = true;

  constructor(private notifyService: NotifyService, private userService: UserService) {
    this.message = '';
    this.messageType = NotifyEnum.HIDE;
    if (this.notifyService.autoLoggedOff) {
      this.messageType = NotifyEnum.LOGOUT;
      this.message = LOGOUT;
      this.notifyService.autoLoggedOff = false;
    }

    if (this.notifyService.completedPersonalInfo) {
      this.messageType = NotifyEnum.PERSONAL_INFO;
      this.message = PERSONAL_INFO;
      this.notifyService.completedPersonalInfo = false;
    }

    // console.log('inputMessage', this.temp , this.messageType, this.message, this.notifyService.autoLoggedOff);
    this.notifyService.setMessage
      .takeWhile(() => this.alive)
      .subscribe(data => {
        this.messageType = data;
        this.message = this.messagesList[data];
        console.log('!!!!!!!!!!!!!!!!!!!', this.messageType, this.message);
      });
   }

  ngOnInit() {
    if (this.inputMessage) {
      this.messageType = this.inputMessage;
      this.message = this.messagesList[this.inputMessage];
      console.log('inputMessage', this.inputMessage, this.message);
    }
  }

  showErrorMessage() {
    return this.messageType === 'SIGNIN' || this.messageType === 'DISABLESIGIN' || this.messageType === 'LOGOUT'
      || this.messageType === 'INVALID_RX' || this.messageType === 'SIGNUP' || this.messageType === 'CHANGEPWD'
      || this.messageType === 'SAME_USER_PASSWORD' || this.messageType === 'USER_EMAIL_EXISTS' || this.messageType === 'ALREADY_ENROLLED'
      || this.messageType === 'USER_NAME_EXISTS' || this.messageType === 'SINGLE_RELOAD_EXCEEDED' || this.messageType === 'INVALID_PASSWORD' || this.messageType === 'CARD_NOT_FOUND'  ||  this.messageType === 'RESET_TOKEN_ALREADY_USED' || this.messageType === 'ERROR_ADD_FOUNDS';
  }

  showSuccessMessage() {
    return this.messageType === 'SUCCESS' || this.messageType === 'USERNAME_EMAIL' || this.messageType === 'USERNAME_PASSWORD';
  }

  showInvalidEmail() {
  return this.messageType === 'WRONG_EMAIL';
  }

  showPersonalInfo() {
    return this.messageType === 'PERSONAL_INFO';
  }


  ngOnDestroy() {
    console.log('___________________ngOnDestory in notify_____________________');
    this.alive = false;
  }
}
