import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ForgotUsernameComponent } from './forgot-username.component';
import { Router } from '@angular/router';
import { CvsService } from '../services/cvs-services/cvs.services';
import { CmsService } from '../services/cms.service';
import { Observable } from 'rxjs';

import { NotifyComponent } from '../notify/notify.component';
import { NavbarService } from '../navbar/navbar.service';
import { NotifyService } from '../services/notification/notify.service';
import { UserService } from '../services/user.service';
import { NotifyEnum } from '../shared/enums/notify.enum';
import {Subject} from 'rxjs/Subject';


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

const MockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
const MockCmsService = jasmine.createSpyObj('CmsService', ['getContent']);
const MockNavbarService = jasmine.createSpyObj('NavbarService', ['show']);
const MockUserService = jasmine.createSpyObj('UserService', ['show']);

class MockCvsService {
  forgotUserName():Observable<any>{
    return Observable.of({body:{payload:{}}});
  }
  setUserInfo(){}  
};

fdescribe('ForgotUsernameComponent', () => {
  let component: ForgotUsernameComponent;
  let fixture: ComponentFixture<ForgotUsernameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[ReactiveFormsModule, FormsModule],
      declarations: [ ForgotUsernameComponent, NotifyComponent ],
      providers:[
        {provide: Router, useValue: MockRouter},
        {provide: CmsService, useValue: MockCmsService},
        {provide: CvsService, useClass: MockCvsService},
        {provide: NotifyService, useClass: MockNotifyService},
        {provide: NavbarService, useValue: MockNavbarService},
        {provide: UserService, useValue: MockUserService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call submit method', () => {
    component.onSubmit();
    expect(component).toBeTruthy();
  });

});
