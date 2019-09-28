import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password.component';
import { Router } from '@angular/router';
import { CmsService } from '../services/cms.service';
import { CvsService } from '../services/cvs-services/cvs.services';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import { NotifyComponent } from '../notify/notify.component';
import { NavbarService } from '../navbar/navbar.service';
import { NotifyService } from '../services/notification/notify.service';
import { UserService } from '../services/user.service';
import { NotifyEnum } from '../shared/enums/notify.enum';
import {Subject} from 'rxjs/Subject';

const MockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
const MockCmsService = jasmine.createSpyObj('CmsService', ['getContent']);
const MockNavbarService = jasmine.createSpyObj('NavbarService', ['show']);
const MockUserService = jasmine.createSpyObj('UserService', ['show']);

class MockCvsService {
  forgotPassword(): Observable<any> {
    return Observable.of({body: {payload: {}}});
  }
  setUserInfo() {}
}

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

fdescribe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ ForgotPasswordComponent, NotifyComponent ],
      providers: [
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
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(MockCmsService.getContent).toHaveBeenCalled();
  });

  it('should call submit method', () => {
    expect(MockCmsService.getContent).toHaveBeenCalled();
    component.onSubmit();
    expect(component).toBeTruthy();
  });

  it('should call setView method', () => {
    component.setView({fields: {}});
    expect(component.view).toBeDefined();
  });
});
