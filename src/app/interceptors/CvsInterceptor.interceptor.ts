import {Injectable, Injector} from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import {NotificationService} from '../services/notification/Notification.service';
import 'rxjs/add/operator/do';
import {UserService} from '../services/user.service';
import {tap} from "rxjs/operators";
@Injectable()
export class CvsInterceptor implements HttpInterceptor {

  userService: UserService;

  constructor(private notificationService: NotificationService, private injector: Injector) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.userService = this.injector.get(UserService);
    let authReq;
    const self = this;
    if (sessionStorage.getItem('Session')) {
      this.notificationService.loading = true;
      const sessionID = this.userService.getSessionId();
      authReq = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
         // 'x-auth-token': sessionID,
         'Accept': 'application/json, text/plain',
         'Authorization': sessionStorage.getItem('Session')
        }
      });
    }else {
      console.log('Not Logged In');
      authReq = req.clone({setHeaders: { 'Content-Type': 'application/json',
      // Authorization: 'Bearer ' + environment.gatewayToken
      }});
    }

    console.log('Request: ', authReq);
    return next
      .handle(authReq)
      .pipe( tap(event => {
        if (event instanceof HttpResponse) {
          this.notificationService.loading = false;
          if (event.body && event.body.respMessage) {
            if (event.body.respMessage !== 'SUCCESS') {
              this.notificationService.success(event.body.respMessage, false);
            }
          }

        }

      }, err => {
        this.notificationService.loading = false;
        console.log(err);

        let errorKey = '';

        if (err.status) {
          this.notificationService.error(err.error.message, true);
          return err;
        }
        this.notificationService.error(errorKey, true);
      }));
  }
}
