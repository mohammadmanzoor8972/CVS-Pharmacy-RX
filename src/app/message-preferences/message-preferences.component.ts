import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Form } from '@angular/forms';
import { Router, NavigationEnd } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  NgModel,
  FormBuilder,
  NgForm
} from "@angular/forms";
import { CvsService } from '../services/cvs-services/cvs.services';
import { NavbarService } from '../navbar/navbar.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CmsService } from '../services/cms.service';
import { CmsHelpers } from '../cms-helpers';
import { UserService } from '../services/user.service';
import { NotifyService } from '../services/notification/notify.service';
import { NotifyEnum } from '../shared/enums/notify.enum';
import { NotificationService } from "../services/notification/Notification.service";


class MessagePref {
  bottomDescriptionP1: string;
  bottomDescriptionP2: string;
  buttonLabel: string;
  description: string;
  dropdown1: string;
  dropdown2: string;
  dropdown3: string;
  inputField: any;
  authField = [];
  receiveAlerts: string;
  optYesDescription: string;
  optOutAlerts: string;
  topLabel: string;
}

@Component({
  selector: 'app-message-preferences',
  templateUrl: './message-preferences.component.html',
  styleUrls: ['./message-preferences.component.scss']
})
export class MessagePreferencesComponent extends CmsHelpers implements OnInit, OnDestroy {
  alertOptions: boolean;
  navigationSubscription;
  messagePreferenceForm: Form;
  alertFrequencys: string;
  isRange: Boolean = false;
  @ViewChild('messagePreferenceForm') currentForm: NgForm;
  defaultAlertFrequency: string = '';
  lowBalanceAlertAmount: any;
  view: MessagePref;
  showMessage: Boolean = false;
  constructor(private router: Router, private fb: FormBuilder,
    private notify : NotificationService,
    private cvsService: CvsService, private navbar: NavbarService, public cms: CmsService, private userService: UserService,
    private notifyService: NotifyService) {
      super();
      if (!this.userService.isLoggedIn())  {
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
    this.alertOptions = true;
    this.alertFrequencys =  this.defaultAlertFrequency;
    this.cms.getContent('MessagePreferences', this.setView.bind(this));
    this.showMessage = false;
    this.notifyService.setMessage.next(NotifyEnum.HIDE);
  }

  initializeForm(response) {
    this.notify.loading = false;
    if (response.alertOption === 'DO' || response.alertOption === 'DW') {
      this.currentForm.form.controls['alertOption'].setValue(false);
    }else {
      this.currentForm.form.controls['alertOption'].setValue(true);
      this.currentForm.form.controls['lowBalanceAlert'].setValue('$' + response.lowBalanceAlert);

      // message prefernece mapping based on alertfrequency
      if (response.alertFrequency === null || response.alertFrequency === '1') {
        this.currentForm.form.controls['alertFrequency'].setValue('');
      }else {
        this.currentForm.form.controls['alertFrequency'].setValue(response.alertFrequency);
      }
    }
  }

  setView(cmsData: any) {
    this.view = cmsData.fields;
    this.cvsService.getUserProfile().subscribe(
      (response) => {
          const resp = response.body.messagePreferences;
          this.initializeForm(resp);
      },
      (error: Response) => {
        console.log('ERROR: ', error);
      });
  }

  ngOnInit() {
    this.navbar.show();
    this.showMessage = false;
   }

  onChangeFrequency(e) {
    this.alertFrequencys = e === this.defaultAlertFrequency ? this.defaultAlertFrequency : e;
  }
  allowNumbers(control: HTMLInputElement) {
        const filter = control.value.replace(/[^0-9]/g, "");
        const val =  parseInt(filter,10);
        if (!isNaN(val)) {
          this.lowBalanceAlertAmount = '$' + val;
          this.currentForm.form.controls['lowBalanceAlert'].setValue('$' + val);
        }else {
         this.lowBalanceAlertAmount = '$';
         this.currentForm.form.controls['lowBalanceAlert'].setValue('$');
        }
      }

  onInputBalance(control:HTMLInputElement) {
    var filter = control.value.replace(/[^0-9]/g, "");
    let val:number =  parseInt(filter);
    this.lowBalanceAlertAmount = (val >= 2 && val <= 250) ? '$' + val : '';
    if (val >= 2 && val <= 250) {
      this.isRange = false;
    } else {
      this.isRange = true;
    }
   }


  onFormSubmit(formData) {
      formData.alertFrequency = (formData.alertFrequency === this.defaultAlertFrequency) ? undefined : formData.alertFrequency;
      formData.lowBalanceAlert = formData.lowBalanceAlert ? parseInt(formData.lowBalanceAlert.toString().replace('$', ''), 10) : undefined;
      if (!formData.alertOption) {
        formData.lowBalanceAlert = undefined;
        formData.alertFrequency = undefined;
      }
      this.cvsService.updateMessagePreferences(formData).subscribe((response) => {
        this.notifyService.setMessage.next(NotifyEnum.SUCCESS);

        this.notify.loading = false;
        this.showMessage = true;
         this.currentForm.reset();

      }, (error) => {
        console.log('Error in login service:', error);
      });

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



