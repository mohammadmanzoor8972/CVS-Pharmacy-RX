import { Component, OnInit, Injectable, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { Router } from "@angular/router";
import { CvsService } from "../services/cvs-services/cvs.services";
import { UserService } from "../services/user.service";
import { NotifyService } from "../services/notification/notify.service";
import { NotifyEnum } from "../shared/enums/notify.enum";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit {
  setSpanish = localStorage.getItem("btnCss");
  cardInfoForm: FormGroup;
  cardInfo;
  todayDate = new Date();
  // maxDate: any = new Date(this.todayDate.getFullYear() - 18, this.todayDate.getMonth(), this.todayDate.getDate());
  minDate: Date = new Date(
    this.todayDate.getFullYear() - 100,
    this.todayDate.getMonth(),
    this.todayDate.getDate()
  );
  @Input() view: any;

  constructor(
    private router: Router,
    private notifyService: NotifyService,
    private cvsService: CvsService,
    private userService: UserService
  ) {
    if (this.userService.isLoggedIn()) {
      this.router.navigateByUrl("/transaction-landing-page");
    }
  }

  ngOnInit() {
    this.cardInfoForm = new FormGroup({
      cardNumber: new FormControl("", [
        Validators.required,
        Validators.minLength(16)
      ]),
      dateOfBirth: new FormControl("", [Validators.required])
    });
    // console.log(this.maxDate);
  }

  cardTransform(cardNumber) {
    cardNumber.setValue(
      cardNumber.value
        .replace(/[^0-9]/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
    );
  }

  get cardNumber() {
    return this.cardInfoForm.get("cardNumber");
  }

  get dateOfBirth() {
    return this.cardInfoForm.get("dateOfBirth");
  }

  formatDate(dateofBirth) {
    let date;
    const datePipe = new DatePipe("en-US");

    if (typeof dateofBirth === "object") {
      date = datePipe.transform(dateofBirth, "yyyy-MM-dd");
    } else {
      date = dateofBirth;
    }
    return date;
  }

  validateDate(control:any){
    let month =  parseInt(control.value.split("/")[0])-1;
    if(control.value.split("/").length==3 && control.value.split("/")[2].length==4 && month==new Date(control.value).getMonth()){
      control.invalid = false;
    } else {
      control.invalid = true;
    }
  }

  onSignUp(cardInfoForm) {
    const arr = cardInfoForm.value;
    arr.dateOfBirth = this.formatDate(cardInfoForm.value.dateOfBirth);
    arr.cardNumber = arr.cardNumber.replace(/\s/g, "");
    this.cvsService.getUserInformation(arr).subscribe(
      data => {
        console.log(data.body, "data===");
        this.cvsService.setUserInfo(data.body, arr);
        this.router.navigate(["/personal-info"]);
      },
      (errorResponse: Response) => {
        if (errorResponse["error"]["code"] === "INVALID_DATA") {
          this.notifyService.setMessage.next(NotifyEnum.SIGNUP);
        } else if (errorResponse["error"]["code"] === "ALREADY_ENROLLED") {
          this.notifyService.setMessage.next(NotifyEnum.ALREADY_ENROLLED);
        }
        this.cardInfoForm.reset();
      }
    );
  }
}
