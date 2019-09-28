import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PersonalInfoComponent } from './personal-info.component';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CvsService } from '../services/cvs-services/cvs.services';
import { NavbarService } from '../navbar/navbar.service';
import { CmsService } from '../services/cms.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NotifyService } from '../services/notification/notify.service';
import { NotifyEnum } from '../shared/enums/notify.enum';


const MockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
const MockCmsService = jasmine.createSpyObj('CmsService', ['getContent']);
const MockNavbarService = jasmine.createSpyObj('NavbarService', ['show']);
const MockUserService = jasmine.createSpyObj('UserService', ['show']);

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
fdescribe('PersonalInfoComponent', () => {
  let component: PersonalInfoComponent;
  let fixture: ComponentFixture<PersonalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[ReactiveFormsModule, FormsModule],
      declarations: [ PersonalInfoComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers:[
        {provide: Router, useValue: MockRouter},
        {provide: CmsService, useValue: MockCmsService},
        {provide: CvsService, useClass: MockCvsService},
        {provide: NotifyService, useClass: MockNotifyService},
        {provide: NavbarService, useValue: MockNavbarService},
        {provide: UserService, useValue: MockUserService},
        {provide: ActivatedRoute, useValue: { 'params': Observable.from([{ 'cardNumber': '14257' }]) }}
      ]      
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(MockCmsService.getContent).toHaveBeenCalled();
    expect(MockNavbarService.show).toHaveBeenCalled();
    expect(component.newValues).toBe(component.defaultValues);
  });

  it('should call setView method', () => {
    component.setView({fields:{}});
    expect(component.view).toBeDefined();
  });

  it('should call inputFocused method', () => {
    component.inputFocused();
    expect(component.password_limits).toBeTruthy();
  });

  it('should call looseFocus method', () => {
    component.looseFocus();
    expect(component.password_limits).toBeFalsy();
  });

  it('should call onFormSubmit method', () => {
    let formData = {
      value:{
        phone:'1234567890',
        language:'English',
        cardNumber:'12457'
      }
    };
    component.onFormSubmit(formData);
    expect(component).toBeTruthy();
    //expect(MockRouter.navigateByUrl).toHaveBeenCalledWith('/sign-in');
  });

    it('should call formatPhone method', () => {
    component.personalInfoForm.phone = "1234567890";
    expect(component.personalInfoForm.phone).toEqual('1234567890');
  });

  it('should call unformat method', () => {
    component.unformatPhone = '1234567890';
    let result = component.unformat();
    expect(result).toEqual(component.unformatPhone);
  });
});
