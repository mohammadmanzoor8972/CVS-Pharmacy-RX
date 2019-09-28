import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CheckBalanceComponent } from './check-balance.component';
import { CvsService } from '../services/cvs-services/cvs.services';
import { Observable } from 'rxjs/Observable';
import { NotifyComponent } from '../notify/notify.component';
import { NavbarService } from '../navbar/navbar.service';
import { NotifyService } from '../services/notification/notify.service';
import { UserService } from '../services/user.service';
import { NotifyEnum } from '../shared/enums/notify.enum';
import { Subject } from 'rxjs/Subject';
import { CmsService } from '../services/cms.service';

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

const MockNavbarService = jasmine.createSpyObj('NavbarService', ['show']);
// const MockUserService = jasmine.createSpyObj('UserService', ['isLoggedIn']);
const MockCmsService = jasmine.createSpyObj('CmsService', ['getContent']);

class MockUserService {
  isLoggedIn() {
    return true;
  }
}

fdescribe('CheckBalanceComponent', () => {
  let component: CheckBalanceComponent;
  let fixture: ComponentFixture<CheckBalanceComponent>;
  class CvsServiceStub {
    getUserInformation(): Observable<any> {
      return Observable.of({
        'body': {
          'firstname': 'avaise',
          'lastname': 'test'
        }
      });
    }
    cardBalanceInquiry(): Observable<any> {
      return Observable.of({
        "body": {
          "balance": 50.00
        }
      });
    }
    setUserInfo(data) {

    }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule],
      declarations: [CheckBalanceComponent, NotifyComponent],
      providers: [
        { provide: CvsService, useClass: CvsServiceStub },
        {provide: CmsService, useValue: MockCmsService},
        {provide: NotifyService, useClass: MockNotifyService},
        {provide: NavbarService, useValue: MockNavbarService},
        {provide: UserService, useClass: MockUserService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a `FormGroup` comprised of `FormControl`s', () => {
    component.ngOnInit();
    expect(component.checkBalanceForm instanceof FormGroup).toBe(true);
  });

  it('format card number ', () => {
    component.checkBalanceForm.controls['cardNumber'].setValue('1231321231231231');
    component.allowNumbers(component.checkBalanceForm.controls['cardNumber']);
    expect(component.checkBalanceForm.controls['cardNumber'].value).toEqual('1231 3212 3123 1231');
  });

  it('format cvv number ', () => {
    component.checkBalanceForm.controls['cardCVV'].setValue('123');
    expect(component.checkBalanceForm.controls['cardCVV'].value).toEqual('123');
  });

  it('call onCheckBalanceForm method ', async (done) => {
    let requestData = {
      "cardNumber": "1234123412341234",
      "cvv": '123'
    };
    var cvsService = TestBed.get(CvsService);
    component.onCheckBalanceForm();
    let data = {
      "balance": 50.00
    };
    let spy = spyOn(cvsService, 'cardBalanceInquiry').and.returnValue(data);
    cvsService.cardBalanceInquiry(requestData);
    fixture.detectChanges();
    done();
    expect(cvsService.cardBalanceInquiry).toHaveBeenCalledWith(requestData);
    expect(component.availableBalance).toBe(50);
    expect(component.showBalance).toBeTruthy();
  });
});
