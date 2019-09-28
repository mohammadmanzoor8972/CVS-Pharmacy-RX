import { Component, OnInit } from '@angular/core';
import {NotificationService} from "../services/notification/Notification.service";
import {Notification, NotificationType} from "./notification.model";
import {Idle} from "@ng-idle/core";

@Component({
  selector: 'app-notification',
  templateUrl: 'notification.component.html',
  styleUrls: ['notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notifications: Notification [] = [];
  showMessage: boolean;

  timeoutMessage = '';
  constructor(private notificationService: NotificationService, private idle: Idle) { }

  ngOnInit() {

    //   this.notificationService.getNotification().subscribe((notification: Notification) => {
    //     if (!notification) {
    //       // clear alerts when an empty alert is received
    //       this.notifications = [];
    //       return;
    //     }

    //     // add alert to array
    //     this.notifications = [];
    //     this.notifications.push(notification);
    //     this.displayMessage(notification);
    //   });

    //  this.idle.onTimeoutWarning.subscribe( (countdown) => {
    //     this.timeoutMessage =  "You will timeout in " + countdown + " seconds";
    //   }
    // );

    //  this.idle.onTimeout.subscribe(() =>{
    //    this.timeoutMessage ='';
    //  })
    // this.idle.onIdleEnd.subscribe(() => this.timeoutMessage = '');
    }

  removeNotification(alert: Notification) {
    this.notifications = this.notifications.filter(x => x !== alert);
  }

  notificationCss(notification: Notification){

    if (!notification) {
      return;
    }

    // return amex dls css class based on alert type
    switch (notification.type) {
      case NotificationType.Success:
        return 'alert-positive';
      case NotificationType.Error:
        return 'alert-warn';
      case NotificationType.Warning:
        return 'alert-warn';
      case NotificationType.Neutral:
        return 'alert-neutral';
    }
  }

  notificationImageCss(notification: Notification){

    if (!notification) {
      return;
    }

    // return amex dls css class based on alert type
    switch (notification.type) {
      case NotificationType.Success:
        return 'dls-icon-success-filled';
      case NotificationType.Error:
        return 'dls-icon-warning-filled';
      case NotificationType.Warning:
        return 'dls-icon-warning-filled';
      case NotificationType.Neutral:
        return 'dls-icon-info-filled';
    }
  }

  displayMessage(notification: Notification){
    this.showMessage = true;

    let timeout = notification.timeout;
    setTimeout(function() {
      this.showMessage = false;
      this.removeNotification(notification);
    }.bind(this), timeout);

  }
}
