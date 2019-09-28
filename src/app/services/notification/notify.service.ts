import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import { Router } from '@angular/router';
import { NotifyEnum } from '../../shared/enums/notify.enum';

@Injectable()
export class NotifyService {
  public setMessage = new Subject<NotifyEnum>();
  public messageType: NotifyEnum;
  public autoLoggedOff: Boolean = false;
  public completedPersonalInfo: Boolean = false;

  constructor(private router: Router) {
    this.autoLoggedOff = false;
    this.completedPersonalInfo = false;
  }
}
