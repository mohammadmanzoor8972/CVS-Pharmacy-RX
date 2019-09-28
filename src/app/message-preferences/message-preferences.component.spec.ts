import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagePreferencesComponent } from './message-preferences.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { CmsService } from '../services/cms.service';
import { CvsService } from '../services/cvs-services/cvs.services';
import { NotifyService } from '../services/notification/notify.service';
import { NavbarService } from '../navbar/navbar.service';
import { UserService } from '../services/user.service';
import { Observable, Subject } from 'rxjs';
import { NotifyEnum } from '../shared/enums/notify.enum';
import { TimeOutService } from '../services/notification/timeOut.service';
import { Idle, IdleExpiry } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { HttpClient } from 'selenium-webdriver/http';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from '../services/notification/Notification.service';


//const MockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
const MockCmsService = jasmine.createSpyObj('CmsService', ['getContent']);
const MockNavbarService = jasmine.createSpyObj('NavbarService', ['show']);
//const MockUserService = jasmine.createSpyObj('UserService', ['show']);

class MockCvsService {  
  getUserInfo(){
    return {get:function(){}}
  } 
  
  enroll():Observable<any>{
    return Observable.of({body:{status:'SUCCESS'}});
  }
};

class MockNotifyService {
  public setMessage = new Subject<NotifyEnum>();
  public messageType: NotifyEnum;
  public autoLoggedOff: Boolean = false;
  public completedPersonalInfo: Boolean = false;

  constructor() {
    this.autoLoggedOff = false;
    this.completedPersonalInfo = false;
  }
}


class RouterStub {
  navigateByUrl(url: string) { return url; }
}

export class MockExpiry extends IdleExpiry {
  public lastDate: Date;
  public mockNow: Date;

  last(value?: Date): Date {
    if (value !== void 0) {
      this.lastDate = value;
    }

    return this.lastDate;
  }

  now(): Date {
    return this.mockNow || new Date();
  }
}
class MockUserService {
  isLoggedIn() {
    return true;
  }
  navigationSubscription() : Observable<any> {
    return Observable.of({
    });
  }
}

class MockRouter {
  public ne = new NavigationEnd(0, 'http://localhost:4200/login', 'http://localhost:4200/login');
  public events = new Observable(observer => {
    observer.next(this.ne);
    observer.complete();
  });
}

describe('MessagePreferencesComponent', () => {
  let component: MessagePreferencesComponent;
  let fixture: ComponentFixture<MessagePreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      declarations: [ MessagePreferencesComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers:[
        {provide: Router, useClass: MockRouter},
        {provide: TimeOutService, useClass: TimeOutService},
        {provide: Idle, useClass: Idle},
        {provide: IdleExpiry, useClass: MockExpiry},
        {provide: Keepalive, useClass: Keepalive},
        {provide: CmsService, useValue: MockCmsService},
        {provide: CvsService, useClass: MockCvsService},
        {provide: NotifyService, useClass: MockNotifyService},
        {provide: NavbarService, useValue: MockNavbarService},
        {provide: NotificationService, useValue: NotificationService},
        {provide: UserService, useClass: MockUserService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagePreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
   expect(component).toBeTruthy();
  });
});
