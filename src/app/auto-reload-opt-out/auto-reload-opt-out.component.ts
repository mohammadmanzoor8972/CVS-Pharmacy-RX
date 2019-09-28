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


import { TemplateRef, ViewChild, ElementRef } from "@angular/core";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


class UpdateFundsView {
  amtReloadAuthField: string[];
  amtReloadInfo: string;
  amtReloadLabel: string;
  autoOptOutHeader: string;
  autoReloadLabel: string;
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
  autoReloadFlag: string;
}


@Component({
  selector: 'app-auto-reload-opt-out',
  templateUrl: './auto-reload-opt-out.component.html',
  styleUrls: ['./auto-reload-opt-out.component.scss']
})
export class AutoReloadOptOutComponent extends CmsHelpers implements OnInit, OnDestroy {
  public view: UpdateFundsView;
  navigationSubscription;
  showMessage: Boolean = false;
  autoReloadOptOutForm;
  reloadType = 'single';
  hideDropDown = true;
  otherAmount = '';
  enterBalAmount = '';
  isAmt;
  balanceThresholdAmount = 'Balance threshold reload';
  amountToReload = '$ amount to reload';
  hideBalDropDown = true;
  states = States.values;
  InAuthTID:any;
  modalRef: BsModalRef;
  isNo: Boolean = false;
  @ViewChild('template') template: TemplateRef<any>;

  public cardExpiryMask = [/\d/, /\d/, '/', /\d/, /\d/];
  public dollarMask = ['$', /\d/, /\d/, /\d/];
 constructor(private router: Router, private cvsService: CvsService, private cms: CmsService,
   private nav: NavbarService, private userService: UserService,
    private notifyService: NotifyService, private modalService: BsModalService) {
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

  initialiseValues() {
    this.showMessage = false;
    this.notifyService.setMessage.next(NotifyEnum.HIDE);
    this.nav.show();
    this.cms.getContent('pageAddFunds', this.setView.bind(this));
    this.autoReloadOptOutForm = new FormGroup({
      'cardNumber': new FormControl({value: '', disabled: true}, Validators.required),
      'amountToReload': new FormControl({value: '', disabled: true}, Validators.compose([Validators.required,
      Validators.max(250), Validators.min(2)])),
      'balanceThreshold': new FormControl({value: '', disabled: true}, Validators.compose([Validators.max(500), Validators.min(2)])),
      'dateForReload': new FormControl({value: '', disabled: true})
    });
  }

  setView(cmsData: any) {
    this.view = cmsData.fields;
    this.cvsService.getUserProfile().subscribe(
      (response) => {
          const resp = response.body.reloadPreferences;
          this.initializeForm(resp);
      },
      (error: Response) => {
        console.log('ERROR: ', error);
      });
  }

  initializeForm(response) {
    if (response.autoReloadFlag === 'Y') {
      this.autoReloadOptOutForm.controls['cardNumber'].setValue(response.cardNumber);
      this.allowNumbers(this.autoReloadOptOutForm.get('cardNumber'));
      this.autoReloadOptOutForm.controls['dateForReload'].setValue(response.day);
      this.autoReloadOptOutForm.controls['balanceThreshold'].setValue(response.lowBalanceThreshold);
      this.autoReloadOptOutForm.controls['amountToReload'].setValue(response.amountToReload);
      this.isNo = false;
    }else {
      this.isNo = true;
    }
    if (response.day === 'null' || response.day === "0") {
      this.autoReloadOptOutForm.controls['dateForReload'].setValue('');
    }
  }
  isValid() {
    return this.isNo;
  }

  ngOnInit() {
  }

  autoReloadRequired() {
    if (!this.autoReloadOptOutForm.get('dateForReload').value &&
    !this.autoReloadOptOutForm.get('balanceThreshold').value) {
      return 'required';
    }
    return null;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  confirm(): void {
    this.modalRef.hide();
    this.onFormSubmit();
  }

  decline(): void {
    this.modalRef.hide();
  }

  submit() {
    this.openModal(this.template);
  }

  // Calling the enroll service on submit data
  onFormSubmit() {
    const formData = this.autoReloadOptOutForm;
    var that =this;
    var d = new Date().getTime();
    this.InAuthTID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0; d = Math.floor(d / 16); return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    // console.log(formData.value, 'save');
    //  formData.value.creditCardNumber = formData.value.creditCardNumber.replace(/\s/g, '');
     formData.value.cardNumber = formData.value.cardNumber.replace(/\s/g, '');
    //  formData.value.InAuthTID = that.InAuthTID;
    //  delete formData.value.creditCardNumberTemp;
     window["_cc"].push(['ci', { 'sid': '80cbd8493227c6a3', 'tid': that.InAuthTID }]);
     window["_cc"].push(['csd', function () {
      that.cvsService. optOutReload(formData.value).subscribe((data: any) => {
      console.log(data);
      that.showMessage = true;
      that.notifyService.setMessage.next(NotifyEnum.SUCCESS);
      // Use this line to scroll top of the page
      window.scrollTo(0, 0);
    }, (error) => {
      console.log(error);
      that.showMessage = false;
      that.notifyService.setMessage.next(NotifyEnum.INVALID_RX);
      window.scrollTo(0, 0);
    });
    }]);
  }
  cancel() {
       this.router.navigateByUrl('/manage-automatic-reload');
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
    if (this.autoReloadOptOutForm.get('creditCardNumberTemp').hasError('required') ||
    this.autoReloadOptOutForm.get('creditCardNumberTemp').hasError('minlength')) {
      return false;
    }else {
      return true;
    }
  }


  allowCharacters(control) {
    control.setValue(control.value.replace(/[^a-zA-Z]/g, ''));
    }
  showDropdown() {
    console.log('in the dropdown');
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
    console.log(form);
  }

  get reloadPreference() {
    return this.autoReloadOptOutForm.get('reloadPreference');
  }

  get nameOnCard() {
    return this.autoReloadOptOutForm.get('nameOnCard');
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
    return this.autoReloadOptOutForm.get('creditCardNumber');
  }

  get cardExpiryDate() {
    return this.autoReloadOptOutForm.get('cardExpiryDate');
  }

  get creditCardCvv() {
    return this.autoReloadOptOutForm.get('creditCardCvv');
  }

  get monthlyReload() {
    return this.autoReloadOptOutForm.get('monthlyReload');
  }

  get billingAddress() {
    return this.autoReloadOptOutForm.get('billingAddress');
  }

  get city() {
    return this.autoReloadOptOutForm.get('city');
  }

  get state() {
    return this.autoReloadOptOutForm.get('state');
  }

  get zipCode() {
    return this.autoReloadOptOutForm.get('zipCode');
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