import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { SelectLangService } from '../services/selectLang.service';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})

export class SubHeaderComponent implements OnInit {

  public englishBtnActive: boolean;
  public spanishBtnActive: boolean;

  @Input() view: any;

  constructor( public langService: SelectLangService, private router: Router) { }

  ngOnInit() {
    this.setLangBtn_Css(localStorage.getItem('btnCss'));
  }

  setLangBtn_Css(value: string) {
    if (value === 'en' || value === null) {
      this.englishBtnActive = true;
      this.spanishBtnActive = false;
    } else if (value === 'es') {
      this.spanishBtnActive = true;
      this.englishBtnActive = false;
    }
  }

  selectLang(value: string) {
    this.langService.changeLang(value);
  }

  checkBalanceInquiry() {
    this.router.navigateByUrl('/check-balance');
  }

  reportLostCard() {
    this.router.navigateByUrl('/report-lost-or-damaged-card');
  }

}
