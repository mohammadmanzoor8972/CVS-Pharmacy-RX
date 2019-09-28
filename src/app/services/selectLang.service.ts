import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SelectLangService {

    private languageSource = new BehaviorSubject<string>('default');
    currentLanguage = this.languageSource.asObservable();

    constructor() { }

    changeLang(value: string) {
        this.languageSource.next(value);
    }
}
