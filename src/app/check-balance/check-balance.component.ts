import { Component, OnInit, Injectable } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CvsService } from "../services/cvs-services/cvs.services";
import { UserService } from "../services/user.service";
import { NavbarService } from "../navbar/navbar.service";
import { CmsService } from "../services/cms.service";
import { NotifyService } from "../services/notification/notify.service";
import { NotifyEnum } from "../shared/enums/notify.enum";
import { NotificationService } from "../services/notification/Notification.service";

class CmsView {
  authField: any;
  buttongText: string;
  availableBalanceText: string;
  finalThought: string;
  headerText: any;
  textPlaceHolder: any;
}

@Component({
  selector: "app-check-balance",
  templateUrl: "./check-balance.component.html",
  styleUrls: ["./check-balance.component.scss"]
})
export class CheckBalanceComponent implements OnInit {
  checkBalanceForm: FormGroup;
  availableBalance: number;
  showBalance: boolean;
  loggedInStatus: boolean;
  view: CmsView;
  showMessage: Boolean = false;

  constructor(
    private router: Router,
    private cvsService: CvsService,
    private nav: NavbarService,
    private userService: UserService,
    private notify:NotificationService,
    cms: CmsService,
    private notifyService: NotifyService
  ) {
    this.loggedInStatus = this.userService.isLoggedIn();
    cms.getContent("pageBalanceInqiry", this.setBalanceView.bind(this));
  }

  ngOnInit() {
    this.nav.show();
    if (this.loggedInStatus) {
      setTimeout(()=>{
      this.onCheckBalanceForm();
    },0)
      this.showBalance = true;
    }
    this.checkBalanceForm = new FormGroup({
      cardNumber: new FormControl("", [
        Validators.required,
        Validators.minLength(11)
      ]),
      cardCVV: new FormControl("", [
        Validators.required,
        Validators.minLength(3)
      ])
    });
    this.showMessage = false;
  }

  setBalanceView(content: any) {
    this.view = content.fields;
  }

  allowNumbers(cardNumber) {
    cardNumber.setValue(
      cardNumber.value
        .replace(/[^0-9]/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
    );
  }

  get cardNumber() {
    return this.checkBalanceForm.get("cardNumber");
  }

  get cardCVV() {
    return this.checkBalanceForm.get("cardCVV");
  }

  onCheckBalanceForm() {
    this.notify.loading = false;
    let checkBalanceConfig;
    if (this.userService.isLoggedIn()) {
      checkBalanceConfig = undefined;
    } else {
      checkBalanceConfig = this.checkBalanceForm.value;
      checkBalanceConfig.cardNumber = checkBalanceConfig.cardNumber.replace(
        /\s/g,
        ""
      );
      checkBalanceConfig.cvv = checkBalanceConfig.cardCVV;
      delete checkBalanceConfig.cardCVV;
    }
    this.cvsService.cardBalanceInquiry(checkBalanceConfig).subscribe(
      data => {
        this.availableBalance = data.body.balance;
        this.showBalance = true;
        this.showMessage = false;
        this.notify.loading = false;
      },
      (error: Response) => {
        this.notifyService.setMessage.next(NotifyEnum.INVALID_RX);
        this.showMessage = true;
        this.checkBalanceForm.reset();
        this.notify.loading = false;
      }
    );
  }
}
