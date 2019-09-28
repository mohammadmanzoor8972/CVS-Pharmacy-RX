import { async, ComponentFixture, TestBed, inject} from '@angular/core/testing';

import { SigninComponent } from './signin.component';
import {Observable} from 'rxjs/Observable';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CvsService} from '../services/cvs-services/cvs.services';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';
import { CmsService } from '../services/cms.service';
import {SelectLangService} from '../services/selectLang.service';
import { NavbarService } from '../navbar/navbar.service';

import {
  Http,
  RequestOptions,
  Response,
  URLSearchParams,
  HttpModule
} from '@angular/http';
import { TimeOutService } from '../services/notification/timeOut.service';
import { Idle, IdleExpiry } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { NotifyService } from '../services/notification/notify.service';
import { NotificationService } from '../services/notification/Notification.service';

class CvsServiceStub {
  getUserInformation(): Observable<any> {
    return Observable.of({
      'body': {
        'username': 'Testuser100',
        'lastname': 'Testuser105'
      }
    });
  }
  login(): Observable<any> {
    return Observable.of({
    });
  }
  setUserInfo (data) {

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



fdescribe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  // tslint:disable-next-line:prefer-const
  let mockRouter = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigninComponent ],
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule, HttpClientModule, HttpModule],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        {provide: CvsService, useClass: CvsServiceStub},
        {provide: UserService, useClass: UserService},
        {provide: CmsService, useClass: CmsService},
        {provide: SelectLangService, useClass: SelectLangService},
        {provide: NavbarService, useClass: NavbarService},
        {provide: TimeOutService, useClass: TimeOutService},
        {provide: Idle, useClass: Idle},
        {provide: IdleExpiry, useClass: MockExpiry},
        {provide: Keepalive, useClass: Keepalive},
        {provide: NotificationService, useClass: NotificationService},
        {provide: NotifyService, useClass: NotifyService}
       
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a `FormGroup` comprised of `FormControl`s', () => {
    component.ngOnInit();
    expect(component.signInForm instanceof FormGroup).toBe(true);
  });


  it('onSignIn', () => {
    component.signInForm.controls['username'].setValue( 'Testuser100');
    component.signInForm.controls['password'].setValue('Testuser105');
    
    console.log('component', component);
    const cvsService = TestBed.get(CvsService);
    const spy = spyOn(cvsService, 'login').and.returnValue({ subscribe: () => {} });
    component.onSignIn(component.signInForm);
  });

  it('get the username', () => {
    component.signInForm.controls['username'].setValue( 'Testuser100');
    expect(component.signInForm.get('username').value).toEqual('Testuser100');
  });

  it('get the password', () => {
    component.signInForm.controls['password'].setValue('Testuser105');
    expect(component.signInForm.get('password').value).toEqual('Testuser105');
  });

  it('should retrieve UserInformation', async(done => {
    inject([Router], (router: Router) => {
      // tslint:disable-next-line:prefer-const
      let cvsService = TestBed.get(CvsService);
      // tslint:disable-next-line:prefer-const
      let data = {
        body: {
          'username': 'Testuser100',
          'password': 'Testuser105'
        }
      };
      const spy = spyOn(cvsService, 'getUserInformation').and.returnValue(data);
      const spyurl = spyOn(router, 'navigateByUrl');
      fixture.detectChanges();
      done();
      expect(cvsService.setUserInfo).toHaveBeenCalledWith(data.body);
    });
  }));

describe('SigninComponent', () => {
  // tslint:disable-next-line:no-shadowed-variable
  let component: SigninComponent;
  // tslint:disable-next-line:no-shadowed-variable
  let fixture: ComponentFixture<SigninComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
});