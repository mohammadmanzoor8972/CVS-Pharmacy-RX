import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
export class EmailValidator {
  static email(control: AbstractControl): {[key: string]: any} {
    const value = control.value;
    // tslint:disable-next-line:max-line-length
    const emailRegx: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value === '') {
      return null;
    }
    
    return !emailRegx.test(value) ? { 'patternInvalid': {'text': 'Invalid email format'  } } : null;
  }
}
