import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CvsService } from '../services/cvs-services/cvs.services';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { SignupComponent } from './signup.component';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { TimeOutService } from '../services/notification/timeOut.service';
import { Idle, IdleExpiry } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { NotificationService } from '../services/notification/Notification.service';
import { NotifyService } from '../services/notification/notify.service';
import { CmsService } from '../services/cms.service';
import { SelectLangService } from '../services/selectLang.service';
import { NavbarService } from '../navbar/navbar.service';


class CvsServiceStub {
  getUserInformation(): Observable<any> {
    return Observable.of({
      'body': {
        'firstname': 'avaise',
        'lastname': 'test'
      }
    });
  }
  setUserInfo(data) {

  }
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
class RouterStub {
  navigateByUrl(url: string) { return url; }
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockRouter = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule, HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        // {provide: Router, useClass: RouterStub},
        { provide: CvsService, useClass: CvsServiceStub },
        {provide: CmsService, useClass: CmsService},
        {provide: SelectLangService, useClass: SelectLangService},
        { provide: UserService, useClass: UserService },
        {provide: TimeOutService, useClass: TimeOutService},
        {provide: NavbarService, useClass: NavbarService},
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
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a `FormGroup` comprised of `FormControl`s', () => {
    component.ngOnInit();
    expect(component.cardInfoForm instanceof FormGroup).toBe(true);
  });

  it('format card number ', () => {
    component.cardInfoForm.controls['cardNumber'].setValue('1231321231231231');
    component.cardTransform(component.cardInfoForm.controls['cardNumber']);
    expect(component.cardInfoForm.controls['cardNumber'].value).toEqual('1231 3212 3123 1231');
  });

  it('format date from dateobject', () =>  {
    expect(component.formatDate('12/11/2012')).toEqual('12/11/2012');
  });


  it('onSignUp', () => {
    component.cardInfoForm.controls['cardNumber'].setValue('1231321231231231');
    component.cardInfoForm.controls['dateOfBirth'].setValue('2012-12-11');

    component.onSignUp(component.cardInfoForm);
  });

  it('should retrieve UserInformation', async(done => {
    inject([Router], (router: Router) => {
      var cvsService = TestBed.get(CvsService);
      var data = {
        body: {
          'firstname': 'test',
          'lastname': 'test'
        }
      };
      let spy = spyOn(cvsService, 'getUserInformation').and.returnValue(data);
      const spyurl = spyOn(router, 'navigateByUrl');
      fixture.detectChanges();
      done();
      expect(cvsService.setUserInfo).toHaveBeenCalledWith(data.body);

    });
  }));
});
