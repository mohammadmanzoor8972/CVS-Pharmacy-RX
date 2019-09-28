import { EqualValidator } from './password-equal-validator.directive';
import {
  MatDatepickerModule, MatInputModule, MatNativeDateModule,
  MatIconModule
} from '@angular/material';
import { ImageTextList } from './image-text-list/image-text-list.component';
import { Tabs } from './tabs/tabs.component';
import { WindowRef } from './services/WindowRef';
import { CvsInterceptor } from './interceptors/CvsInterceptor.interceptor';
import { AuthGuard } from './auth.guard';

// MODULES
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MobxAngularModule } from 'mobx-angular';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { TextMaskModule } from "angular2-text-mask";
import { ModalModule } from 'ngx-bootstrap';

// COMPONENTS
import { AboutIncommComponent } from './about-incomm/about-incomm.component';
import { AccordionItemComponent } from './accordion-item/accordion-item.component';
import { AddFundsToCardComponent } from './add-funds-to-card/add-funds-to-card.component';
import { AppComponent } from './app.component';
import { AppLinkComponent } from './app-link/app-link.component';
//import { BoxListComponent } from './box-list/box-list.component';
//import { BalanceTransactionsComponent } from './balance-transactions/balance-transactions.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CheckBalanceComponent } from './check-balance/check-balance.component';
import { EligibleItemsComponent } from './eligible-items/eligible-items.component';
import { FooterComponent } from './footer/footer.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HeaderComponent } from './header/header.component';
import { HelpPageComponent } from './containers/help-page/help-page.component';
import { HomepageComponent } from './containers/homepage/homepage.component';
import { LogoutComponent } from './logout/logout.component';
import { MessagePreferencesComponent } from './message-preferences/message-preferences.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NotificationComponent } from './notification/notification.component';
import { PdfLinkListComponent } from './pdf-link-list/pdf-link-list.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ScrollbarComponent } from './scrollbar/scrollbar.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SubHeaderComponent } from './sub-header/sub-header.component';
import { SupportPageComponent } from './support-page/support-page.component';
import { PrivacyPolicyComponent} from './privacy-policy/privacy-policy.component';
import { TabContentComponent } from './tab-content/tab-content.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { TextMessagePolicyComponent } from './text-message-policy/text-message-policy.component';
import { TextBoxComponent } from './text-box/text-box.component';
import { TransactionLandingPageComponent } from './transaction-landing-page/transaction-landing-page.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ReportLostOrDamagedCardComponent } from './report-lost-or-damaged-card/report-lost-or-damaged-card.component';
import { ForgotUsernameComponent } from './forgot-username/forgot-username.component';
import { ManageReloadComponent } from './manage-reload/manage-reload.component';
import { AutoReloadOptOutComponent } from './auto-reload-opt-out/auto-reload-opt-out.component';
import { AutoReloadUpdateComponent } from './auto-reload-update/auto-reload-update.component';
import { NotifyComponent } from './notify/notify.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TimeoutModalComponent } from './timeout-modal/timeout-modal.component';
import { RecaptchaModule, RECAPTCHA_LANGUAGE } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

// SERVICES
import { NotificationService } from './services/notification/Notification.service';
import { NavbarService } from './navbar/navbar.service';
import { CvsService } from './services/cvs-services/cvs.services';
import { ModalService } from './services/modal/modal.service';
import { UserService } from './services/user.service';
import { CmsService } from './services/cms.service';
import {SelectLangService} from './services/selectLang.service';
import { NotifyService } from './services/notification/notify.service';
import { TimeOutService } from './services/notification/timeOut.service';
import { ModalContentComponent } from './modal-content/modal-content.component';
import { LoaderComponent } from './loader/loader.component';




const appRoutes: Routes = [
  { path: '', pathMatch: 'full', component: HomepageComponent },
  { path: 'message-preferences', component: MessagePreferencesComponent, runGuardsAndResolvers: 'always'},
  { path: 'personal-info', component: PersonalInfoComponent},
  { path: 'personal-info/:cardNumber', component: PersonalInfoComponent},
  { path: 'transaction-landing-page', component: TransactionLandingPageComponent},
  { path: 'add-funds-to-card', component: AddFundsToCardComponent, runGuardsAndResolvers: 'always'},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'change-password', component: ChangePasswordComponent, runGuardsAndResolvers: 'always'},
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent},
  { path: 'about-incomm', component: AboutIncommComponent},
  { path: 'sign-in', component: SigninComponent},
  { path: 'help', component: HelpPageComponent},
  { path: 'support', component: SupportPageComponent,runGuardsAndResolvers: 'always' },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'cookie-policy', component: CookiePolicyComponent },
  { path: 'check-balance', component: CheckBalanceComponent },
  { path: 'text-message-policy', component: TextMessagePolicyComponent },
  { path: 'update-profile', component: UpdateProfileComponent, runGuardsAndResolvers: 'always'},
  { path: 'report-lost-or-damaged-card', component: ReportLostOrDamagedCardComponent,runGuardsAndResolvers: 'always' },
  { path: 'forgot-username', component: ForgotUsernameComponent},
  { path: 'manage-automatic-reload', component: ManageReloadComponent},
  { path: 'auto-reload-opt-out', component: AutoReloadOptOutComponent},
  { path: 'auto-reload-update', component: AutoReloadUpdateComponent},
  { path: 'eligible-items', component: EligibleItemsComponent},
  { path: 'resetPassword', component: ResetPasswordComponent},
  // { path: 'help', component: HelpPageComponent },
  // { path: 'account', canActivate: [AuthGuard], component: LandingPageComponent },
  // { path: 'store-locations', component: WhereToBuyPageComponent },
  // { path: 'cardholder-agreement', component: CardholderAgreementsPageComponent },
  // { path: 'hilton', component: CardholderAgreementsPageComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '**', component: HomepageComponent },

];


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ImageTextList,
    Tabs,
   // BoxListComponent,
    AccordionItemComponent,
    HelpPageComponent,
   // BalanceTransactionsComponent,
    TabContentComponent,
    HeaderComponent,
    FooterComponent,
    AppLinkComponent,
    NotificationComponent,
    PdfLinkListComponent,
    LogoutComponent,
    SubHeaderComponent,
    TextBoxComponent,
    SignupComponent,
    PersonalInfoComponent,
    AddFundsToCardComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    ScrollbarComponent,
    TermsAndConditionsComponent,
    AboutIncommComponent,
    SigninComponent,
    EqualValidator,
    MessagePreferencesComponent,
    TransactionLandingPageComponent,
    NavbarComponent,
    SupportPageComponent,
    UpdateProfileComponent,
    PrivacyPolicyComponent,
    CheckBalanceComponent,
    TextMessagePolicyComponent,
    CookiePolicyComponent,
    ReportLostOrDamagedCardComponent,
    ForgotUsernameComponent,
    ManageReloadComponent,
    AutoReloadOptOutComponent,
    AutoReloadUpdateComponent,
    EligibleItemsComponent,
    NotifyComponent,    
    ModalContentComponent,
    TimeoutModalComponent,
    ResetPasswordComponent,
    CookiePolicyComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes, {
        onSameUrlNavigation: 'reload'
      }),
    NgIdleKeepaliveModule.forRoot(),
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    MobxAngularModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatIconModule,
    CommonModule,
    TextMaskModule,
    ModalModule.forRoot()
  ],
  exports: [
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatIconModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CvsInterceptor,
      multi: true,
    },
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: localStorage.getItem('newLocation')
    },
    CmsService,
    NotificationService,
    NotifyService,
    TimeOutService,
    ModalService,
    WindowRef,
    CvsService,
    UserService,
    AuthGuard,
    NavbarService,
    SelectLangService,
    UserService
    //BalanceService
  ],
  entryComponents: [
    ModalContentComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
