import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CvsService } from '../services/cvs-services/cvs.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavbarService } from '../navbar/navbar.service';
import {States} from '../shared/state-static';
import { NotifyService } from '../services/notification/notify.service';
import { NotifyEnum } from '../shared/enums/notify.enum';
import {CmsService} from '../services/cms.service';
import {CmsHelpers} from '../cms-helpers';
import { UserService } from '../services/user.service';
import {CreditCardValidator} from '../shared/validators/creditcard-validator';


class UpdateFundsView {
  amtReloadAuthField: string[];
  amtReloadInfo: string;
  amtReloadLabel: string;
  autoReloadLabel: string;
  autoUpdateHeader: string;
  balanceThresholdAuthField: string[];
  balanceThresholdLabel: string[];
  billAddressAuthField: string[];
  billingAddressLabel: string;
  buttonLabel: string;
  cardNumberAuthField: string[];
  cardNumberLabel: string;
  cityAuth: string;
  cityText: string;
  creditCardAuthField: string[];
  creditcardCvvAuthField: string[];
  creditcardCvvLabel: string;
  creditcardNumLabel: string;
  cvvAuthField: string[];
  cvvLabel: string;
  dayValue: string[];
  firstNameAuthField: string[];
  firstNameLabel: string;
  lastNameAuthField: string[];
  lastNameLabel: string;
  monthDropDownLabel: string;
  monthYearAuthField: string[];
  monthYearLabel: string;
  monthlyReloadAuthField: string[];
  monthlyReloadLabel: string;
  singleReloadLabel: string;
  stateAuth: string;
  stateText: string;
  topLabel: string;
  zipCodeAuthField: string;
  zipCodeLabel: string;
}


@Component({
  selector: 'app-auto-reload-update',
  templateUrl: './auto-reload-update.component.html',
  styleUrls: ['./auto-reload-update.component.scss']
})
export class AutoReloadUpdateComponent extends CmsHelpers implements OnInit, OnDestroy {
  public view: UpdateFundsView;  navigationSubscription;
  showMessage: Boolean = false;
  autoReloadUpdateForm;
  reloadType = 'autoreload';
  hideDropDown = true;
  otherAmount = '';
  enterBalAmount = '';
  isAmt;
  balanceThresholdAmount = 'Balance threshold reload';
  amountToReload = '$ amount to reload';
  hideBalDropDown = true;
  states = States.values;
  inAuthTID:any;

  public cardExpiryMask = [/\d/, /\d/, '/', /\d/, /\d/];
  public dollarMask = ['$', /\d/, /\d/, /\d/];
 constructor(private router: Router, private cvsService: CvsService, private cms: CmsService,
   private nav: NavbarService, private userService: UserService,
    private notifyService: NotifyService) {
    super();
    if (!this.userService.isLoggedIn()) {
      this.router.navigateByUrl('/sign-in');
    }
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseValues();
      }
    });
  }
  initializeForm(response) {
    if (response.autoReloadFlag === 'Y') {
      this.autoReloadUpdateForm.controls['reloadType'].setValue('autoreload');
      this.autoReloadUpdateForm.controls['cardNumber'].setValue(response.cardNumber);
      this.allowNumbers(this.autoReloadUpdateForm.get('cardNumber'));
      this.autoReloadUpdateForm.controls['balanceThreshold'].setValue(response.lowBalanceThreshold);
      this.autoReloadUpdateForm.controls['amountToReload'].setValue(response.amountToReload);
      this.autoReloadUpdateForm.controls['dateForReload'].setValue(response.day);
    }
    if (response.day === 'null' || response.day === "0") {
      this.autoReloadUpdateForm.controls['dateForReload'].setValue('');
    }
  }

  autoReloadRequired(value) {
    if (value) {
      if (!this.autoReloadUpdateForm.get("dateForReload").value
      && !this.autoReloadUpdateForm.get("balanceThreshold").value) {
        this.autoReloadUpdateForm.controls['dateForReload'].setValidators([Validators.required]);
        this.autoReloadUpdateForm.controls['balanceThreshold'].setValidators([Validators.required]);
        this.updateValueandValidity();
      }
    }else {
      this.autoReloadUpdateForm.controls['dateForReload'].clearValidators();
      this.autoReloadUpdateForm.controls['balanceThreshold'].clearValidators();
      this.updateValueandValidity();
    }
  }

  updateValueandValidity() {
    this.autoReloadUpdateForm.controls['dateForReload'].updateValueAndValidity();
    this.autoReloadUpdateForm.controls['balanceThreshold'].updateValueAndValidity();
  }

  checkRequired(event) {
    if (event.target.value) {
      this.autoReloadRequired(false);
    }else {
      this.autoReloadRequired(true);
    }
  }
  initialiseValues() {
    this.showMessage = false;
    this.notifyService.setMessage.next(NotifyEnum.HIDE);
    this.nav.show();
    this.cms.getContent('pageAddFunds', this.setView.bind(this));
    this.autoReloadUpdateForm = new FormGroup({
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
      'balanceThreshold': new FormControl('', Validators.compose([Validators.max(500), Validators.min(2)])),
      'dateForReload': new FormControl(''),
      'reloadType': new FormControl('autoreload')
    });
  }
  setView(cmsData: any) {
    this.view = cmsData.fields;
    console.log('CMS pageAddFunds:   ', this.view);
    this.cvsService.getUserProfile().subscribe(
        (response) => {
          const resp = response.body.reloadPreferences;
          this.initializeForm(resp);
          },
         (error: Response) => {
           console.log('ERROR: ', error);
         });
  }

  ngOnInit() {
  }

  // Calling the enroll service on submit data
  onFormSubmit(formData) {
    var that =this;
    var d = new Date().getTime();
    this.inAuthTID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0; d = Math.floor(d / 16); return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    console.log(formData.value, 'save');
     formData.value.creditCardNumber = formData.value.creditCardNumber.replace(/\s/g, '');
     formData.value.cardNumber = formData.value.cardNumber.replace(/\s/g, '');
     formData.value.inAuthTID = that.inAuthTID;
     delete formData.value.creditCardNumberTemp;
     window["_cc"].push(['ci', { 'sid': '80cbd8493227c6a3', 'tid': that.inAuthTID }]);
     window["_cc"].push(['csd', function () {
       
      that.cvsService.addFunds(formData.value).subscribe((data: any) => {
      console.log(data);
      that.showMessage = true;
      that.notifyService.setMessage.next(NotifyEnum.SUCCESS);
      window.scrollTo(0, 0);

    }, (error) => {
      console.log(error);
      that.notifyService.setMessage.next(NotifyEnum.INVALID_RX);
      that.showMessage = false;
      window.scrollTo(0, 0);

    });
    }]);
  }

  resetFormValue(formData){
    formData.markAsPristine();
    formData.markAsUntouched();
    formData.updateValueAndValidity();
  }

  allowNumbers(control) {
    control.setValue(control.value.replace(/[^0-9]/g, "").replace(/(.{4})/g, '$1 ').trim());
  }
  allowNumber(control) {
    control.setValue(control.value.replace(/[^0-9]/g, ''));
  }

  maskCardNumber(control) {
    if (control.value && control.value.length > 14) {
      control.setValue(control.value.replace(/\d{4}(?= \d{4})/g, '****').trim());
    }
  }

  checkOtherErrors() {
    if (this.autoReloadUpdateForm.get('creditCardNumberTemp').hasError('required') ||
    this.autoReloadUpdateForm.get('creditCardNumberTemp').hasError('minlength')) {
      return false;
    }else {
      return true;
    }
  }


  allowCharacters(control) {
    control.setValue(control.value.replace(/[^a-zA-Z]/g, ''));
    }
  showDropdown() {
    this.hideDropDown = !this.hideDropDown;
  }

  amountReload(event, otherAmount) {
    if (event.keyCode === 13) {
      this.toggleData(otherAmount);
    }
  }

  balAmountRelaod(event, otherAmount) {
    if (event.keyCode === 13) {
      this.toggleBalData(otherAmount);
    }
  }

  toggleData(val) {
    this.amountToReload = val.length > 0 ? val : this.amountToReload;
    if (val.length > 0) {
      this.otherAmount = '';
      this.hideDropDown = true;
    }
  }

  toggleBalData(val) {
    this.balanceThresholdAmount = val.length > 0 ? val : this.balanceThresholdAmount;
    if (val.length > 0) {
      this.hideBalDropDown = true;
      this.enterBalAmount = '';
    }
  }

  reloadTypeRadio(e) {
    this.reloadType = e;
  }

  submitReloadForm(form) {
  }

  get reloadPreference() {
    return this.autoReloadUpdateForm.get('reloadPreference');
  }

  get nameOnCard() {
    return this.autoReloadUpdateForm.get('nameOnCard');
  }

  creditCardNumbers(creditCardNumberTemp, creditCardNumber) {
    if (creditCardNumberTemp.value.indexOf('*') > -1 ) {
      creditCardNumberTemp.setValue('');
      creditCardNumber.setValue('');
    }
    creditCardNumberTemp.setValue(creditCardNumberTemp.value.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim());
    creditCardNumber.setValue(creditCardNumberTemp.value);
  }

  get creditCardNumber() {
    return this.autoReloadUpdateForm.get('creditCardNumber');
  }

  get cardExpiryDate() {
    return this.autoReloadUpdateForm.get('cardExpiryDate');
  }

  get creditCardCvv() {
    return this.autoReloadUpdateForm.get('creditCardCvv');
  }

  get monthlyReload() {
    return this.autoReloadUpdateForm.get('monthlyReload');
  }

  get billingAddress() {
    return this.autoReloadUpdateForm.get('billingAddress');
  }

  get city() {
    return this.autoReloadUpdateForm.get('city');
  }

  get state() {
    return this.autoReloadUpdateForm.get('state');
  }

  get zipCode() {
    return this.autoReloadUpdateForm.get('zipCode');
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