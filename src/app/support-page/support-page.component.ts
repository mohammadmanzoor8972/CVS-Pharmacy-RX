import { Component, OnInit, OnDestroy  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationEnd  } from '@angular/router';
import { CmsService } from '../services/cms.service';
import { CvsService } from '../services/cvs-services/cvs.services';
import {EmailValidator} from '../shared/validators/email.validator';
import { NotifyService } from '../services/notification/notify.service';
import { NotifyEnum } from '../shared/enums/notify.enum';
class SupportView {
    authField: any;
    buttonText: string;
    descriptionText: string;
    formDescription: string;
    inputPlaceHolder: any;
    mainHeader: string;
}

@Component({
    selector: 'app-support-page',
    templateUrl: './support-page.component.html',
    styleUrls: ['./support-page.component.scss']
})
export class SupportPageComponent implements OnInit, OnDestroy {

    navigationSubscription;
    public supportInfo: SupportView;
    public defaultValues = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        dateBirth: ''
      };
      showMessage: boolean = false;

    public SupportForm: any;
    public unformatPhone: any;
    todayDate = new Date();

  minDate: Date = new Date(this.todayDate.getFullYear() - 100, this.todayDate.getMonth(), this.todayDate.getDate());

    constructor(public cms: CmsService, private cvsService: CvsService, private notifyService: NotifyService, public router: Router) {
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
              this.initialiseValues();
            }
          });
    }

    initialiseValues() {
        this.cms.getContent( 'pageSupport', this.setView.bind(this));
        this.initializeForm(this.defaultValues);
        this.notifyService.setMessage.next(NotifyEnum.HIDE);
        this.showMessage = false;
    }

    ngOnInit() {
    }

    formatDate(dateofBirth) {
        let date;
       if (typeof(dateofBirth) === 'object') {
          date = dateofBirth.toISOString().slice(0, 10);
       } else {
         date = dateofBirth;
       }
       console.log(date);
       return date;
      }

    setView(cmsData: any) {
        this.supportInfo = cmsData.fields;
        console.log(this.supportInfo);
    }

    cardTransform(cardNumber) {
        cardNumber.setValue(cardNumber.value.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim());
    }

    get cardNumber() {
        return this.SupportForm.get('cardNumber');
    }

    get dateBirth() {
        return this.SupportForm.get('dateBirth');
    }

    get phone() {
        return this.SupportForm.get('phone');
    }

    get email() {
        return this.SupportForm.get('email');
    }

    // Restricting the number inputs in the fields.
    allowCharacters(control) {
        control.setValue(control.value.replace(/[^a-zA-Z]/g, ''));
        }

    Phone(control) {
        control.setValue(this.formatPhone(control.value));
    }

    // Formatting the phone Number to the US format
    // Example - (123) 456 -7890
    formatPhone(obj) {
        const numbers = obj.replace(/\D/g, ''),
        char = { 0: '(', 3: ') ', 6: ' - ' };
        this.unformatPhone = numbers;
        obj = '';
        for (let i = 0; i < numbers.length; i++) {
        obj += (char[i] || '') + numbers[i];
        }
        return obj;
    }

    
  validateDate(control:any){
    let month =  parseInt(control.value.split("/")[0])-1;
    if(control.value.split("/").length==3 && month==new Date(control.value).getMonth()){
      control.invalid = false;
    } else {
      control.invalid = true;
    }
  }
  
    initializeForm(response) {
          this.SupportForm = new FormGroup({
          'firstName': new FormControl(response.firstName,
            [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
          'lastName': new FormControl(response.lastName,
          [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
          'email': new FormControl("", [Validators.required, Validators.email, EmailValidator.email]),
          'dateBirth': new FormControl(response.dateBirth, Validators.required),
          'phone': new FormControl(response.phone, [Validators.required, Validators.minLength(16)]),
          'message': new FormControl(response.language),
          'cardNumber': new FormControl('', [Validators.required, Validators.minLength(11)]),

        });
      }


      onFormSubmit(formData) {
        formData.dateBirth = this.formatDate(formData.dateBirth);
        console.log(formData, 'save');
        formData.cardNumber = formData.cardNumber.replace(/\s/g, '');
        this.cvsService.support(formData).subscribe((data: any) => {
          console.log(data);
          this.notifyService.setMessage.next(NotifyEnum.SUCCESS);
          this.showMessage = true;
        },
        (error: Response) => {
            console.log('ERROR: ', error);
       if (error['error']['code'] === 'CARD_NOT_FOUND') {
            this.notifyService.setMessage.next(NotifyEnum.CARD_NOT_FOUND);
        }
        else if (error['error']['code'] === 'WRONG_EMAIL') {
            this.notifyService.setMessage.next(NotifyEnum.WRONG_EMAIL);
         } 
        this.SupportForm.reset();
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