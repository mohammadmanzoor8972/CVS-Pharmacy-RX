import {Injectable} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

import {Notification, NotificationType} from '../../notification/notification.model';
import {CmsService} from '../cms.service';
import {ConfigurationCmsModel} from "./configuration-cms-model";
import { observable } from 'mobx-angular';

@Injectable()
export class NotificationService {
  private subject = new Subject<Notification>();
  private keepAfterRouteChange = false;
  private configurationCmsModel: ConfigurationCmsModel;
  private notificationTimeout = 10000;
  private value = true;
  @observable loading = false;

  constructor(private router: Router, cms: CmsService) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          // only keep for a single route change
          this.keepAfterRouteChange = false;
        } else {
          // clear alert messages
          this.clear();
        }
      }
    });
  }

  getNotification(): Observable<any> {
    return this.subject.asObservable();
    // return null;
  }

  success(messageKey: string, keepAfterRouteChange = false) {
    let message = this.getMessage(messageKey, "Success");

    console.log("Success Messge being created: ", message);
    this.alert(NotificationType.Success, message, keepAfterRouteChange);
  }

  error(messageKey: string, keepAfterRouteChange = false) {
    let message = this.getMessage(messageKey, "Error") ? this.getMessage(messageKey, "Error") : messageKey;
    this.alert(NotificationType.Error, message, keepAfterRouteChange);
  }

  warning(message: string, keepAfterRouteChange = false, timeout: number) {
    if (this.value) {
      return;
    }
    this.alert(NotificationType.Warning, message, keepAfterRouteChange, timeout);
  }

  neutral(message: string, keepAfterRouteChange = false, timeout: number) {
    if (this.value) {
      return;
    }
    this.alert(NotificationType.Neutral, message, keepAfterRouteChange, timeout);
  }

  //timeout(message: string, keepAfterRouteChange = false, )


  alert(type: NotificationType, message: string, keepAfterRouteChange = false, timeout = this.notificationTimeout) {
    // if (this.value) {
    //   return;
    // }
    this.keepAfterRouteChange = keepAfterRouteChange;
    if (message) {
      this.subject.next(<Notification>{type: type, message: message, timeout: timeout});
    }
  }

  getTimeoutValue(){
    return this.notificationTimeout;
  }

  clear() {
    this.subject.next();
  }

  public getMessage(messageKey: string, type: string): string {
    this.loading = false;
    if ( this.configurationCmsModel) {
      let message = '';
    if (type === "Error") {
      console.log("Error messages cms : ", 
      //this.configurationCmsModel.errorMessages
    );
      let messageObject = this.configurationCmsModel.errorMessages.filter(el => el.code === messageKey)[0];
      if (messageObject) {
        return messageObject.message;
      }
      else {
        return null;
      }
    }
    else if (type === "Success") {
      let messageObject = this.configurationCmsModel.successMessages.filter(el => el.code === messageKey)[0];
      if (messageObject) {
        return messageObject.message;
      }
      else {
        return message;
      }
    }
    else if (type === "Neutral") {
      let messageObject = this.configurationCmsModel.neutralMessages.filter(el => el.code === messageKey)[0];
      if (messageObject) {
        return messageObject.message;
      }
      else {
        return;
      }
    }

    return null;
    }
  }



}
