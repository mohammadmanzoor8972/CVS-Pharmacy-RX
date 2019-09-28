import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder
} from "@angular/forms";
import { RouterTestingModule } from '@angular/router/testing';
import { AddFundsToCardComponent } from './add-funds-to-card.component';
import { Router } from '@angular/router';
import { CvsService } from '../services/cvs-services/cvs.services';
import { NotifyComponent } from '../notify/notify.component';
import { NavbarService } from '../navbar/navbar.service';
import { NotifyService } from '../services/notification/notify.service';
import { UserService } from '../services/user.service';
import { NotifyEnum } from '../shared/enums/notify.enum';
import { Subject } from 'rxjs/Subject';
import { CmsService } from '../services/cms.service';
import { Observable } from 'rxjs/Observable';
import { TextMaskModule } from "angular2-text-mask";
import { CreditCardValidator } from "../shared/validators/creditcard-validator";

class CvsServiceStub {
  addFunds(): Observable<any> {
    return Observable.of({
      "body": {
        "balance": 50.00
      }
    });
  }
  setUserInfo(data) {

  }
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

const MockNavbarService = jasmine.createSpyObj('NavbarService', ['show']);
const MockCmsService = jasmine.createSpyObj('CmsService', ['getContent']);

class MockUserService {
  isLoggedIn() {
    return true;
  }
}
const formBuilder: FormBuilder = new FormBuilder();

fdescribe('AddFundsToCardComponent', () => {
  let component: AddFundsToCardComponent;
  let fixture: ComponentFixture<AddFundsToCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, TextMaskModule],
      declarations: [AddFundsToCardComponent, NotifyComponent],
      providers: [
        { provide: CvsService, useClass: CvsServiceStub },
        {provide: CmsService, useValue: MockCmsService},
        {provide: NotifyService, useClass: MockNotifyService},
        {provide: NavbarService, useValue: MockNavbarService},
        {provide: UserService, useClass: MockUserService},
        { provide: FormBuilder, useValue: formBuilder }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFundsToCardComponent);
    component = fixture.componentInstance;
    component.addFundsToCardInitailizeForm = formBuilder.group({
      'cardNumber': new FormControl('', Validators.required),
      'cvv': new FormControl('', Validators.required),
      'firstName': new FormControl('', Validators.required),
      'lastName': new FormControl('', Validators.required),
      'billingAddress': new FormControl('', Validators.required),
      'city': new FormControl('', Validators.required),
      'state': new FormControl('', Validators.required),
      'zipCode': new FormControl('', Validators.required),
      'creditCardNumber': new FormControl('', [Validators.required, CreditCardValidator.creditCard]),
      'creditCardNumberTemp': new FormControl('', {
        validators: Validators.required
     }),
      'expiration': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$')])),
      'creditCardCvv': new FormControl('', Validators.required),
      'amountToReload': new FormControl('', Validators.compose([Validators.required,
      Validators.max(250), Validators.min(2)])),
      'balanceThreshold': new FormControl('', Validators.compose([Validators.max(250), Validators.min(2)])),
      'dateForReload': new FormControl(''),
      'reloadType': new FormControl('single')
  });
    fixture.detectChanges();
  });

  it('should create', () => {
    // component.ngOnInit();
    // component.initialiseValues();
    expect(component).toBeTruthy();
  });

  it('should create a `FormGroup` comprised of `FormControl`s', () => {
    expect(component.addFundsToCardInitailizeForm instanceof FormGroup).toBe(true);
  });

});
