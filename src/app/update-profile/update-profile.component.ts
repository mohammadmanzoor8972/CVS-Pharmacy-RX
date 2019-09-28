import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormGroup, FormControl, Validators, NgModel } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from '../services/user.service';
import { CvsService } from '../services/cvs-services/cvs.services';
import { NavbarService } from '../navbar/navbar.service';
import { EmailValidator } from '../shared/validators/email.validator';
import { NotifyService } from '../services/notification/notify.service';
import { NotifyEnum } from '../shared/enums/notify.enum';
import { CmsService } from '../services/cms.service';
import { NotificationService } from "../services/notification/Notification.service";

class UpdateView {
  authField: any;
  buttonText: string;
  languageTextEnglish: string;
  languageTextSpanish: string;
  mainHeader: string;
  placeHolderField: any;
}

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
// Step 1 add OnDestroy
export class UpdateProfileComponent implements OnInit, OnDestroy {
  updateProfileForm;
  // Step 2
  navigationSubscription;
  newValues;
  todayDate: Date = new Date();
  minDate: Date = new Date(this.todayDate.getFullYear() - 100, this.todayDate.getMonth(), this.todayDate.getDate());
  languageSelected = true;
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
  showMessage: Boolean = false;
  public view: UpdateView;
  public userLanguage: string;

  constructor(private router: Router, private cvs: CvsService, private nav: NavbarService,
    public notify:NotificationService,
    private userService: UserService, private notifyService: NotifyService, public cms: CmsService) {
    // Step 3
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseValues();
      }
    });

    if (!this.userService.isLoggedIn()) {
      this.router.navigateByUrl('/sign-in');
    }
  }

  // Step 4
  initialiseValues() {
    // This is the FIRST check to see if the success message should be shown or not
    this.cms.getContent('pageUpdateProfile', this.setView.bind(this));
    if (localStorage.getItem('showMessage') === 'true') {
      this.notifyService.setMessage.next(NotifyEnum.SUCCESS);
      this.showMessage = true;
    } else {
      this.initializeForm(this.defaultValues);
      this.notifyService.setMessage.next(NotifyEnum.HIDE);
    }
  }

  ngOnInit() {

  }
  setView(info: any) {
    this.view = info.fields;
    console.log('THIS IS THE UPDATE PROFILE VIEW: ', this.view);
    this.nav.show();
    this.cvs.getUserProfile().subscribe(
      (response) => {
        console.log('Update Response', response);
        console.log('Got the User Profile Data', response.body);
        this.newValues = response.body ? response.body : this.defaultValues;
        // this.newValues.language = response.body.language;
        this.newValues.phone = this.newValues.phone ? this.formatPhone(this.newValues.phone) : this.defaultValues.phone;
        this.newValues.dateOfBirth = new Date(this.dateFormat(this.newValues.dateOfBirth));
        // Adding the form validations for the Personal Info form
        this.initializeForm(this.newValues);

        // This is the SECOND check to see if the success message should be shown or not
        if (localStorage.getItem('showMessage') !== 'true') {
          this.showMessage = false;
        }
        localStorage.setItem('showMessage', 'false');
      },
      (error: Response) => {
        console.log('ERROR: ', error);
      });
  }

  // Calling the enroll service on submit data
  onFormSubmit(formData) {
    console.log(formData, this.newValues, 'save');

      if (formData.language === 'E') {
        this.userLanguage = 'en-US';
        localStorage.setItem('btnCss', 'en');
      } else {
        this.userLanguage = 'es';
        localStorage.setItem('btnCss', 'es');
      }
      localStorage.setItem('newLocation', this.userLanguage);

    formData.phone = this.unformatPhone;
    formData.dateOfBirth = this.formatDate(formData.dateOfBirth);
    this.cvs.updateProfile(formData).subscribe(
      (response) => {
        setTimeout(() => {
          location.replace('/update-profile');
          localStorage.setItem('showMessage', 'true');
        }, 100);
        console.log('Update Response', response);
      },
      (error: Response) => {
        console.log('ERROR: ', error);
        this.notifyService.setMessage.next(NotifyEnum.USER_EMAIL_EXISTS);
        this.showMessage = false;
      });
  }

  initializeForm(response) {
    this.notify.loading = false;
    this.updateProfileForm = new FormGroup({
      'firstName': new FormControl(response.firstName, [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]),
      'lastName': new FormControl(response.lastName, [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]),
      'email': new FormControl(response.email, [Validators.required, Validators.email, EmailValidator.email]),
      'dateOfBirth': new FormControl(response.dateOfBirth, Validators.required),
      'phone': new FormControl(response.phone, [Validators.required, Validators.minLength(16)]),
      'language': new FormControl(response.language)
    });
  }

  // Restricting the number inputs in the fields.
  allowCharacters(control) {
    control.setValue(control.value.replace(/[^a-zA-Z]/g, ''));
  }

  // Formatting the date from  yyyy-mm-dd to mm/dd/yyyy
  // Bug in Angular date-picker for yyyy-mm-dd gives one day less
  dateFormat(obj) {
    var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    return obj.replace(pattern, '$2/$3/$1');
  }

  formatDate(dateofBirth) {
    var d = new Date(dateofBirth),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

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

  // updatePhone(number) {
  //   this.updateProfileForm.phone = this.formatPhone(number);
  // }

  updatePhone(control) {
    control.setValue(this.formatPhone(control.value));
  }
  unformat() {
    return this.unformatPhone;
  }

  get firstName() {
    return this.updateProfileForm.get('firstname');
  }

  get lastName() {
    return this.updateProfileForm.get('lastname');
  }

  get email() {
    return this.updateProfileForm.get('email');
  }
  get phone() {
    return this.updateProfileForm.get('phone');
  }
  get language() {
    return this.updateProfileForm.get('language');
  }
  get dateOfBirth() {
    return this.updateProfileForm.get('dateOfBirth');
  }

  validateDate(control:any){
    let month =  parseInt(control.value.split("/")[0])-1;
    if(control.value.split("/").length==3 && month==new Date(control.value).getMonth()){
      control.invalid = false;
    } else {
      control.invalid = true;
    }
  }
  
  // Step 5
  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseValues()
    // method on every navigationEnd event. we need to change the date here
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

}
