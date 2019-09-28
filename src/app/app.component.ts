import { Component, ElementRef, OnInit, ViewChild, OnChanges, HostListener, AfterViewInit } from '@angular/core';
import { CmsService } from './services/cms.service';
import { ConfigurationCmsModel } from './services/notification/configuration-cms-model';
import { Meta } from '@angular/platform-browser';
import { NavbarService } from './navbar/navbar.service';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/interval";
import "rxjs/observable/IntervalObservable";
import { UserService } from './services/user.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { NotificationService } from './services/notification/Notification.service';
declare let ga: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  
  private loading:boolean = false;
  @ViewChild('googleAnalytics') googleAnalytics: ElementRef;
  configurationCmsModel: ConfigurationCmsModel;
  googleAnalyticsInjected = false;

  constructor(cmsService: CmsService, private router:Router, public userService: UserService,
    private metaService: Meta, public nav: NavbarService,  public notifiy : NotificationService) {
    cmsService.getContent('pageConfiguration', this.setView.bind(this));

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });

   }

   storageChange (event) {
    if (event.key === 'logged_in') {
        window.sessionStorage.clear();
        this.router.navigate(['/sign-in']);
    }
  }

  ngOnInit() {
    this.nav.show();
    this.userService.startRefreshToken();
    window.addEventListener('storage', this.storageChange.bind(this), false);
  }

  setView(cmsData: any) {
    this.loading = false;
    if (cmsData) {
      this.configurationCmsModel = new ConfigurationCmsModel(cmsData.fields);
      this.setHead();
      this.injectGoogleAnalytics();
      }
  }

  public setHead() {
    if (this.configurationCmsModel && this.configurationCmsModel.metaData && this.metaService) {
      this.metaService.addTag({name: this.configurationCmsModel.metaData.fields.keywords,
         content: this.configurationCmsModel.metaData.fields.description
        });
    }
  }

  injectGoogleAnalytics() {
    if (this.configurationCmsModel && this.configurationCmsModel.googleAnalyticsCode && !this.googleAnalyticsInjected) {
      this.googleAnalyticsInjected = true;
      if (this.googleAnalytics) {
        const fragment = document.createRange().createContextualFragment(this.configurationCmsModel.googleAnalyticsCode);
        this.googleAnalytics.nativeElement.appendChild(fragment);
      }
    }

  }

  // Code for pushing the page to the top on routing
  scrollTop() {
    document.body.scrollTop = 0;
    // Alternatively, you can scroll to top by using this other call:
     window.scrollTo(0, 0)
  }
  @HostListener("window:scroll", [])
onWindowScroll() {
 this.showScrollIcon = false;
  if(window.outerHeight - window.pageYOffset <100)
  {
   this.showScrollIcon = true;
  }
 }


  public showScrollIcon:boolean =  false;

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}:`);
}

ngAfterViewInit() {
  var that =this;
  //alert('in1')
  this.router.events
      .subscribe((event) => {
        //alert('in2')
          if(event instanceof NavigationStart) {
            that.loading = true;
          }
          else if (
              event instanceof NavigationEnd || 
              event instanceof NavigationCancel
              ) {
                setTimeout(function(){that.loading = false;},2000)
                
          }
      });
}
}
