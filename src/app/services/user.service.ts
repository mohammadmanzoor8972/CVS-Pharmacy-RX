import { Injectable, OnDestroy } from "@angular/core";
import {Router} from '@angular/router';
import {NotificationService} from './notification/Notification.service';
import {environment} from '../../environments/environment';
import {NavbarService} from '../navbar/navbar.service';
import {action, computed, observable} from 'mobx-angular';
import {Subject} from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeUntil';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpHeaders} from '@angular/common/http';
import {HttpRequest} from '@angular/common/http';
import {CvsService} from './cvs-services/cvs.services';
import { NotifyService } from './notification/notify.service';
import { NotifyEnum } from '../shared/enums/notify.enum';
import { TimeOutService } from './notification/timeOut.service';

@Injectable()
export class UserService implements OnDestroy{
    intRefreshInterval: any;
    private _status: boolean;
    private _sessionUser: any;
    private _sessionId: string;
    private _apptoken: string;
    public showLogout: Boolean;
    public notifyLoginLogout = new Subject<boolean>();
    // public notifyDisableLogin = new Subject<boolean>();
    public formSubmitted = new BehaviorSubject<boolean>(false);
    private SESSION_ID_NAME = 'Authorization';
    private firstIterval: boolean = true;
    public langValue: string;
    public btnCssValue: string;
    public refreshToken: Subscription;

    @observable loggedIn = false;
    @observable loading = false;
    @observable emailLoading = false;

    timer: Observable<any> = Observable.interval(1000);
    value: any;
    check: number;
    private ngUnSubscribe: Subject<void> = new Subject<void>();

  // public token: string;
  public refToken: string;
  loginAttempts = 0;
  // disableSignin: boolean;
  constructor(private router: Router, private cvsRest: CvsService, private timeOutService: TimeOutService,
    private notifications: NotificationService, private navbarService: NavbarService, private notifyService: NotifyService) {
    if (sessionStorage.getItem('Session') !== null) {
      this._status = true;
      this.timeOutService.reset();
    } else {
      console.log('Not logged in ');
      localStorage.removeItem('prevTimer');
      localStorage.removeItem('timer');
    }

    window.onbeforeunload = () => {
      const timer = this.check;
      console.log(timer);
      if (sessionStorage.getItem('Session')) {
        localStorage.setItem('prevTimer', timer.toString());
      }
    };
  }

  logout() {
    this._status = false;
      // Next 2 lines saves your language selection and css that needs to persist past logout
      this.langValue = localStorage.getItem('newLocation');
      this.btnCssValue = localStorage.getItem('btnCss');
      clearInterval(this.intRefreshInterval);
      window.localStorage.clear();
      window.sessionStorage.clear();
      // Next 3 lines make sure 1. User language selection is saved 2. css needed for home page persists
      // 3. A check to make sure user language selection is applied correctly
      localStorage.setItem('newLocation', this.langValue);
      localStorage.setItem('btnCss', this.btnCssValue);
      localStorage.setItem('userSetLocale', 'true');
      this.router.navigate(['/sign-in']);
      this.timeOutService.stop();
      this.stopRefreshToken();
      this.notifyLoginLogout.next(false);
      window.localStorage.setItem('logged_in', 'false');
    }

  reset() {
    this.refreshSession();
    this.timeOutService.reset();
     }

  login(type: string, loginRequest: any) {
    this.notifications.loading = true;
    this.cvsRest.login(loginRequest).subscribe((response) => {
      console.log('Data', response);
      this.setSession(response);
      this.notifications.loading= false;
      },
      err => {
        this.notifications.loading= false;
        console.log(err);
        this.loginAttempts++;
        console.log('$$$$ before disable $$$$', this.loginAttempts);
        this.disableLogin(err);
        return false;
      }
      );
  }

  showAllert() {
    alert();
  }

  // Need clear requirements around this.
  disableLogin(err) {
    console.log(err);
    // Error for disabling user for 30minz
    if (err['error']['message'] === 'ACCESS_BLOCKED') {
      this.notifyService.setMessage.next(NotifyEnum.DISABLESIGIN);
    } else {
      this.notifyService.setMessage.next(NotifyEnum.SIGNIN);
    }   
  }
  
  
  setSession(response, authenticated = true, isRefreshToken = true) {
    console.log('SetSession Response ', response);
    console.log('header ', response.headers.get(this.SESSION_ID_NAME));
    const sessionID = response.headers.get(this.SESSION_ID_NAME);
    this.notifyService.setMessage.next(NotifyEnum.HIDE);
    if (sessionID) {
      this._sessionId = sessionID;
      console.log('setting session to local storage ', this._sessionId);
      sessionStorage.setItem('Session', sessionID);
      this._status = authenticated;
      if (isRefreshToken) {
      this.timeOutService.reset();
      this.router.navigateByUrl('/transaction-landing-page');

      }
      this.notifyLoginLogout.next(true);
      this.startRefreshToken();
    } else {
      this._status = false;
      this.logout();
      this.router.navigate(['/sign-in']);
    }
  }

  startRefreshToken() {
    // if (!this.refreshToken && sessionStorage.getItem('Session')) {
    //     // make a call every 7 minutes 30 secs
    //     this.refreshToken = Observable.interval((1000 * 60 * 7.5)).subscribe(refresh => {
    //            if (this.isLoggedIn()) {
    //               this.refreshSession();
    //            }
    //   });
    // }
    if (sessionStorage.getItem('Session')) {
        this.getTime();
    }
  }

  stopRefreshToken() {
    // if (this.refreshToken) {
    //   this.refreshToken.unsubscribe();
    // }
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }

  getTime() {
    // this.subscription
    this.timer.takeUntil(this.ngUnSubscribe).subscribe((val) => {
      const value = val + 1;
      console.log(value, this.timer);
      localStorage.setItem('timer', value);
      const prevTimer = localStorage.getItem('prevTimer') ? localStorage.getItem('prevTimer'): 0;
      this.check = Number(prevTimer) + value;
      if (this.check >= 410) {
        this.ngUnSubscribe.next();
        this.refreshSession();
        // this.subscription.unsubscribe();
        localStorage.setItem('prevTimer', '0');
        this.resetTimer();
      }
   });
  }

  resetTimer() {
    this.getTime();
  }

  getSessionId(): string {
    return sessionStorage.getItem('Session');
  }

  refreshSession() {
    this.cvsRest.getRefreshToken().subscribe((response) => {
        console.log('Data', response);
      this.setSession(response, true, false);
      },
      err => {
        console.log(err);
        console.log('Get refresh call Failed');
         this.logout();
      }
      );
  }

  submitFormState(): Observable<boolean> {
    return this.formSubmitted.asObservable();
  }

  getCurrentSessionId() {
    return this._sessionId;
  }

  isLoggedIn() {
    const currentUser = sessionStorage.getItem('Session');
    this._status = currentUser ? true : false;
    this.showLogout = this._status;
    return this._status;
  }

  getAppTocken() {
    this._apptoken = sessionStorage.getItem('app-jwt-token');
    return this._apptoken;
  }

  ngOnDestroy() {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
  // ngInit(); Add ngInit

}
