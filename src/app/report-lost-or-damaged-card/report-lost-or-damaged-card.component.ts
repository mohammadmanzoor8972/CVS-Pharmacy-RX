
import { Component, OnInit, OnDestroy  } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormGroup, FormControl, Validators, NgModel } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from '../services/user.service';
import { CvsService } from '../services/cvs-services/cvs.services'
import { NavbarService } from '../navbar/navbar.service';
import {CmsService} from "../services/cms.service";
import {CmsHelpers} from "../cms-helpers";
import { NotifyService } from '../services/notification/notify.service';
import { NotifyEnum } from '../shared/enums/notify.enum';
import {EmailValidator} from '../shared/validators/email.validator';
class ReportInfoView {
  titleLabel: string;
  firstNameLabel:string;
  lastNameLabel:string;
  datebirthLabel:string;
  phoneLabel:string;
  balanceLabel:string;
  cardNumberLabel:string;
  businessInfo:string;
  emailLabel: string;
  buttonLabel: string;
 }
@Component({
  selector: 'app-report-lost-or-damaged-card',
  templateUrl: './report-lost-or-damaged-card.component.html',
  styleUrls: ['./report-lost-or-damaged-card.component.scss']
})

export class ReportLostOrDamagedCardComponent extends CmsHelpers implements OnInit, OnDestroy {
  view: ReportInfoView;
  navigationSubscription;
  reportLostDamagedForm: FormGroup;
  todayDate : Date = new Date();
  minDate: Date = new Date(this.todayDate.getFullYear() - 100, this.todayDate.getMonth(), this.todayDate.getDate());
  public dollarMask = ["$", /\d/, /\d/, /\d/];
  unformatPhone;

  password_limits = false;
  showMessage: Boolean = false;


  constructor(private router: Router, private cvs: CvsService,
    private cms: CmsService, private notifyService: NotifyService, private nav: NavbarService) {
    super(); 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseValues();
      }
    });
  }

  initialiseValues() {
    this.initialiseForm();
    this.notifyService.setMessage.next(NotifyEnum.HIDE);
    this.showMessage = false;

  }

  setView(cmsData: any) {
    console.log("CMS pageReportLostDamagedCard : ", cmsData.fields);
    this.view = cmsData.fields;
}
  ngOnInit() {

    this.nav.show();
    // Adding the form validations for the Personal Info form
     this.initialiseValues();
  }

  // Calling the enroll service on submit data
  onFormSubmit(formData) {
    console.log(formData, 'save');
    formData.phone = this.unformatPhone;
    if (formData.cardNumber) {
      formData.cardNumber = formData.cardNumber.replace(/\s/g, '');
    }
    this.cvs.reportLostDamagedCard(formData).subscribe(
      (response) => {
        console.log('Update Response', response);
        this.notifyService.setMessage.next(NotifyEnum.SUCCESS);
        this.showMessage = true;
      },
      (error: Response) => {
        console.log('ERROR: ', error);
        if (error['error']['code'] === 'WRONG_EMAIL') {
          this.notifyService.setMessage.next(NotifyEnum.WRONG_EMAIL);
       } 
       else if (error['error']['code'] === 'CARD_NOT_FOUND') {
            this.notifyService.setMessage.next(NotifyEnum.CARD_NOT_FOUND);
        }
        this.reportLostDamagedForm.reset();
      });
  }

  initialiseForm() {
    this.cms.getContent("pageReportLostDamagedCard", this.setView.bind(this));
    this.reportLostDamagedForm = new FormGroup({
      'firstName': new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]),
      'lastName': new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]),
      'email': new FormControl("", [Validators.required, Validators.email, EmailValidator.email]),
      'dateOfBirth': new FormControl("", Validators.required),
      'phone': new FormControl("", [Validators.required, Validators.minLength(16)]),
      'cardNumber': new FormControl("", [Validators.minLength(16)]),
      'lastKnownAmount': new FormControl(
        "",
        Validators.compose([
          Validators.max(500),
          Validators.min(0)
        ])
      ),

    });
  }

  // Restricting the number inputs in the fields.
  allowCharacters(control) {
    control.setValue(control.value.replace(/[^a-zA-Z]/g, ''));
    }

  allowNumbers(control) {
    control.setValue(control.value.replace(/[^0-9]/g, "").replace(/(.{4})/g, '$1 ').trim());
  }


  allowNumber(control) {
    control.setValue(
      control.value
        .replace(/[^0-9]/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
    );
  }



  allowDecimalNumbers(control){
     control.setValue(control.value.replace(/(([1-9]*)|(([1-9]*)\.([0-9]*)))$/, ""));
  }

  notAllowSpace(control){
    control.setValue(control.value.replace(/[^0-9^A-Za-z&*%$#@/s]$/g, ''));
  }

  //Formatting the phone Number to the US format 
  // Example - (123) 456 -7890
  formatPhone(obj) {
    let numbers = obj.replace(/\D/g, ''),
      char = { 0: '(', 3: ') ', 6: ' - ' };
    this.unformatPhone = numbers;
    obj = '';
    for (var i = 0; i < numbers.length; i++) {
      obj += (char[i] || '') + numbers[i];
    }
    return obj;
  }

  updatePhone(control) {
    control.setValue(this.formatPhone(control.value));
  }

  unformat() {
    return this.unformatPhone;
  }

  get firstName() {
    return this.reportLostDamagedForm.get('firstname');
  }

  get lastName() {
    return this.reportLostDamagedForm.get('lastname');
  }

  get email() {
    return this.reportLostDamagedForm.get('email');
  }
  get phone() {
    return this.reportLostDamagedForm.get('phone');
  }
  get cardNumber() {
    return this.reportLostDamagedForm.get('cardNumber');
  }
  get dateOfBirth() {
    return this.reportLostDamagedForm.get('dateOfBirth');
  }
  get lastKnownAmount() {
    return this.reportLostDamagedForm.get('lastKnownAmount');
  }

  validateDate(control:any){
    let month =  parseInt(control.value.split("/")[0])-1;
    if(control.value.split("/").length==3 && month==new Date(control.value).getMonth()){
      control.invalid = false;
    } else {
      control.invalid = true;
    }
  }

  onInputBalance(control) {
    var filter = control.value.replace(/[^0-9]\./g, "");
    let val:number =  parseFloat(filter);
    control.value = (val >= 0 && val <= 500) ? '$' + val.toFixed(2) : '';
    if(val >= 0 && val <= 500){
      control.invalid = false;
    } else {
      control.value = "";
      control.invalid = true;
    }
   }
   ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseValues()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
  }
}
