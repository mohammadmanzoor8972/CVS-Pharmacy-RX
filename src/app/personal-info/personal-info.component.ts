import { Component, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormGroup, FormControl, Validators, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CvsService } from '../services/cvs-services/cvs.services';
import { NavbarService } from '../navbar/navbar.service';
import { CmsService } from '../services/cms.service';
import { CmsHelpers } from '../cms-helpers';
import { ActivatedRoute } from '@angular/router';
import { EmailValidator } from '../shared/validators/email.validator';
import { NotifyService } from '../services/notification/notify.service';
import { NotifyEnum } from '../shared/enums/notify.enum';

class PersonalInfoView {
  topLabel: string;
  firstNameLabel: string;
  firstNameAuthField: string[];
  lastNameLabel: string;
  lastNameAuthField: string[];
  emailLabel: string;
  emailAuthField: string[];
  userNameLabel: string;
  passwordLabel: string;
  passAuthField: string[];
  confirmPasswordLabel: string;
  passConfirmAuth: string[];
  passwordSideText: any;
  buttonLabel: string;
  phoneLabel: string;
  phoneAuthField: string[];
  languageLabel: string;
  languageTextEnglish: string;
  languageTextSpanish: string;
  }

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})

export class PersonalInfoComponent extends CmsHelpers implements OnInit {
  view: PersonalInfoView;
  personalInfoForm;
  newValues;
  languageSelected = true;
  cardNumber;
  unformatPhone;
  defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    language: 'E'
  };
  password_limits = false;

  constructor(private router: Router, private cvs: CvsService, private cms: CmsService, private nav: NavbarService,
    private route: ActivatedRoute, private notifyService: NotifyService, private userService: UserService) {
        super();
        
        cms.getContent('PersonalInfo', this.setView.bind(this));

    // Checking for the User Information & Defaulting the values
    this.cardNumber = this.cvs.getUserInfo().get('cardNumber');
    this.newValues = this.cvs.getUserInfo().get('data') ? this.cvs.getUserInfo().get('data') : this.defaultValues;
    this.newValues.language = this.newValues.language ? this.newValues.language : this.defaultValues.language;
    this.newValues.phone = this.newValues.phone ? this.formatPhone(this.newValues.phone) : this.defaultValues.phone;
  }

  setView(cmsData: any) {
        console.log('CMS PersonalInfo : ', cmsData.fields);
        this.view = cmsData.fields;
    }
  ngOnInit() {


    // Code that is commented out should be modified to keep users from going to this page until either 
    // 1. Logged in
    // 2. Going through sign-up process
    // if (!this.nav.loggedIn) {
    //   location.assign('/sign-up');
    // }else {
      this.nav.show();
      // Adding the form validations from the Personal Info form
      this.personalInfoForm = new FormGroup({
        'firstName': new FormControl(this.newValues.firstName, [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]),
        'lastName': new FormControl(this.newValues.lastName, [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]),
        'email': new FormControl("", [Validators.required, Validators.email, EmailValidator.email]),
        'username': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.pattern('[a-zA-Z0-9]+')]),
        'phone' : new FormControl(this.newValues.phone, [Validators.required, Validators.minLength(16)]),
        'password': new FormControl(null, [Validators.required]),
        'confirmPassword': new FormControl(null, Validators.required),
        'language': new FormControl('E')
      });
  // }
  }

  onFormSubmit(formData) {
    let data = formData.value;
    data.phone = this.unformatPhone;
    data.language = data.language;
    data.cardNumber = this.cardNumber;
    if (formData.value.username === formData.value.password) {
      this.notifyService.setMessage.next(NotifyEnum.SAME_USER_PASSWORD);
      return;
    }

    this.cvs.enroll(data).subscribe((response) => {
      if (response['statusText'] === 'OK') {
        console.log('Enrollment successfully completed');
        this.notifyService.completedPersonalInfo = true;
        this.router.navigateByUrl('/sign-in');
        this.notifyService.setMessage.next(NotifyEnum.HIDE);
      }
    },
      (error) => {
        console.log('ERROR: ', error);
        // based on Error type send msg here
        // based on error from backend write condition for SAME_USER_PASSWORD or USER_EMAIL_EXITS exits
        // for now enabling SAME_USER_PASSWORD error
        if (error['error']['code'] === 'USERNAME_EXISTS') {
                  this.notifyService.setMessage.next(NotifyEnum.USER_NAME_EXISTS);
                }
              if (error['error']['code'] === 'EMAIL_ALREADY_EXISTS') {
                  this.notifyService.setMessage.next(NotifyEnum.USER_EMAIL_EXISTS);
             }
      });
  }
  inputFocused() {
   this.password_limits = true;
  }
  looseFocus() {
   this.password_limits = false;
  }

  // Restricting the number inputs in the fields.
  allowCharacters(control) {
    control.setValue(control.value.replace(/[^a-zA-Z]/g, ''));
    }

  
  // allowNonNumbers(control) {
  //   control.setValue(control.value.replace(/[^A-Za-z ]*$/, ''));
  // }

  // Formatting the phone Number to the US format
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
    return this.personalInfoForm.get('firstname');
  }

  get lastName() {
    return this.personalInfoForm.get('lastname');
  }

  get email() {
    return this.personalInfoForm.get('email');
  }
  
  get phone() {
    return this.personalInfoForm.get('phone');
  }
  get username() {
    return this.personalInfoForm.get('username');
  }
  get password() {
    return this.personalInfoForm.get('password');
  }
  get confirmPassword() {
    return this.personalInfoForm.get('confirmPassword');
  }
  get language() {
    return this.personalInfoForm.get('language');
  }

}
