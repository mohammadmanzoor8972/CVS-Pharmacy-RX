import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
export class CreditCardValidator {
   static creditCard(control: AbstractControl): {[key: string]: any} {
    const pattern: RegExp = /\S+@\S+\.\S+/;
    // ax -> American Express
    // mc - master card
    // vi -> Visa
    // di -> discover
    const cards = {
        'mc': '^5|2[1-5][0-9]{14}|2[1-5][0-9]{14}',
        'vi': '4(?:[0-9]{12}|[0-9]{15}|[0-9]{18})',
        'ax': '3[47][0-9]{13}',
        'di': '6011(?:[0-9]{12}|[0-9]{15})'
        };

    const value = String(control.value).replace(/[- ]/g, ''); // ignore dashes and whitespaces
    const results = [];

    for (const p in cards) {
        if (value.match('^' + cards[p] + '$')) {
            results.push(p);
        }
    }
    if (results.length) {
        return null;
    }else {
        return {'creditCard': {'text': 'Invalid Card'}};
    }

  }
}
