import { Component, OnInit } from '@angular/core';
import { CvsService } from '../services/cvs-services/cvs.services';
import { Router } from '@angular/router';
import { NavbarService } from '../navbar/navbar.service';
import { CmsService } from '../services/cms.service';
import { UserService } from '../services/user.service';
import { SelectLangService } from '../services/selectLang.service';
import { NotificationService } from '../services/notification/Notification.service';
// import {BalanceService} from "../services/balance-service";

class CmsView {
  availableBalance: string;
  bottomDescription: string;
  btnText: string;
  leftOfLinkText: string;
  linkText: string;
  pageLinks: any;
  tableHeader: string;
  tableLabel: any;
}

@Component({
  selector: 'app-transaction-landing-page',
  templateUrl: './transaction-landing-page.component.html',
  styleUrls: ['./transaction-landing-page.component.scss']
})
export class TransactionLandingPageComponent implements OnInit {
  transactionHistoryData = [];
  availableBalance: string;
  showFullHistory = false;
  view: CmsView;
  profile:any;

  constructor(private router: Router, private cvsService: CvsService,
    public notifify : NotificationService,
    private userService: UserService, private navbarService: NavbarService, cms: CmsService, public langService: SelectLangService) {
    cms.getContent('transactionHistory', this.setCmsView.bind(this));
    if (!this.userService.isLoggedIn()){
      this.router.navigateByUrl('/sign-in');
    }
    cvsService.getUserProfile().subscribe(
      (response) => {
        this.profile = response.body;
        this.notifify.loading = false;
        console.log(response.body.language);
        console.log(localStorage.getItem('userSetLocale'));
        this.changeLanguage(localStorage.getItem('userSetLocale'), response.body.language );
      },
      (error: Response) => {
        this.profile = {};
        console.log('ERROR: ', error);
      });

  }

  changeLanguage(langCheck: string, lang: string) {
    if (langCheck !== 'true') {
      if (lang === 'S') {
        this.langService.changeLang('es');
      }else if (lang === 'E') {
        this.langService.changeLang('en');
      }
    }else {
      return;
    }
  }

  onCheckBalanceForm() {
    this.cvsService.cardBalanceInquiry()
      .subscribe(
        (data) => {
          console.log(data.body, 'data===');
          this.availableBalance = data.body.balance;
        },
        (error: Response) => {
          console.log(error);
        }
      );
  }

  setCmsView (content: any) {
    this.view = content.fields;
  }

  ngOnInit() {
    this.navbarService.show();
    let cardData = localStorage.getItem('cardNumber');
    // this.transactionHistoryData = this.DummyData();
     this.onCheckBalanceForm();
     this.cvsService.getCardTransactionHistory(cardData).subscribe((data) => {
       console.log(data, 'data===');
       this.cvsService.setUserInfo(data, []);
       this.transactionHistoryData = data.body.sort((a, b) => new Date(b.createDatetime).getTime() - new Date(a.createDatetime).getTime())
      //  this.transactionHistoryData = this.DummyData();
       this.adjustHeight();
    });

  }


  showFullTransactionHistory($event) {
    $event.preventDefault();
    this.showFullHistory = false;
  }

  adjustHeight() {
      if (this.transactionHistoryData.length <= 0) {
        this.showFullHistory = false;
      } else {
        this.showFullHistory = true;
      }
  }

}
