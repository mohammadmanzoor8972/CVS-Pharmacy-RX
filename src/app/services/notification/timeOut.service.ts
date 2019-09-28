import { Injectable, OnDestroy } from '@angular/core';
import {DEFAULT_INTERRUPTSOURCES, Idle} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import { NotifyService } from './notify.service';
import { NotifyEnum } from '../../shared/enums/notify.enum';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class TimeOutService {
  constructor( public idle: Idle, private keepalive: Keepalive, private notifyService: NotifyService) {
    this.setIdle();
  }

  private unsubscribe = new Subject<void>();

  setIdle() {
     // sets an idle timeout which is 7 minutes
     this.idle.setIdle(420);

     // sets a timeout period of 60 seconds. after 8 minutes(Idle time + warning time),the user will be considered timed out.
     this.idle.setTimeout(60);

     // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
     this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

     this.idle.onIdleEnd.subscribe(() => {
      console.log('No longer idle.');
     });

     // On Timeout of 60 seconds, required action will take place here
     this.idle.onTimeout.subscribe(() => {
       if (this.checkUserSession()) {
        this.notifyService.setMessage.next(NotifyEnum.LOGOUT);
        this.notifyService.autoLoggedOff = true;
       }
     });

     // On Timeout of 7 minutes, required action will take place here
     this.idle.onIdleStart.subscribe(() => {
      if (this.checkUserSession()) {
      this.notifyService.setMessage.next(NotifyEnum.TIMEOUT);
      }
     });

      // On Timeout of 7 minutes, count down begins here
     this.idle.onTimeoutWarning.subscribe((countdown) => {
      if (this.checkUserSession()) {
      }
     });

     this.stop();
  }

  reset() {
    this.idle.watch();
  }

  stop() {
    this.idle.stop();
  }

  checkUserSession() {
    return sessionStorage.getItem('Session') !== null;
  }
}
