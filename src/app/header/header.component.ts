import {
  Component,
  HostListener,
  OnInit,
  Output,
  EventEmitter,
  OnChanges
} from "@angular/core";
import { CmsService } from "../services/cms.service";
import { CmsHelpers } from "../cms-helpers";
import { WindowRef } from "../services/WindowRef";
import { ImageModalModel } from "../services/modal/image-modal-model";
import { ModalService } from "../services/modal/modal.service";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";
import { NavbarService } from "../navbar/navbar.service";

class View {
  headerText: string;
  leftLogo: any;
  loginBtn: string;
  logoutBtn: string;
  rightLogo: any;
  rightLogoLink: string;
  rightSideMobileImg: any;
  lowerHeaderLinks: string[];
  toolbarMenuLinks: string[];
  lowerHeaderLabel: string;
  mobileLogo: any;
  mobileMenuIcon: any;
}

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent extends CmsHelpers implements OnInit, OnChanges {
  public view: View;
  desktopView: boolean;
  mobileMaxWidth: number;
  isMobileMenuActive: boolean;
  animateImageModal: boolean;
  imageModalModel: ImageModalModel;
  // showLogout: boolean;
  // @Output() pageSlideRightToggle = new EventEmitter<boolean>();
  closeMobileMenu: boolean;
  isLoggedIn: boolean;

  constructor(
    cms: CmsService,
    private winRef: WindowRef,
    modalService: ModalService,
    public userService: UserService,
    public router: Router,
    nav: NavbarService
  ) {
    super();
    cms.getContent("componentHeader", this.setView.bind(this));

    modalService.imageModal$.subscribe(imageModalModel => {
      this.imageModalModel = imageModalModel;
      // the css transition won't work until the div has a display value that isn't 'none'
      // so we delay applying the css transation with this setTimeout()
      setTimeout(() => {
        this.animateImageModal = true;
      }, 100);
    });
  }

  ngOnInit() {
    this.mobileMaxWidth = 768;
    this.desktopView = !(
      this.winRef.nativeWindow.innerWidth < this.mobileMaxWidth
    );
    this.animateImageModal = false;
    // show the logout button on pages only after login
    if (this.userService.isLoggedIn()) {
      this.isLoggedIn = true;
    }

    this.userService.notifyLoginLogout.subscribe(data => {
      this.isLoggedIn = data;
    });
  }

  ngOnChanges() {}

  setView(cmsData: any) {
    this.view = cmsData.fields;
  }

  @HostListener("window:popstate", ["$event"])
  onBackBtn(event) {
    if (event) {
      this.closeMobileMenu = false;
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.desktopView = !(event.target.innerWidth < this.mobileMaxWidth);
    if (this.desktopView) {
      this.closeMobileMenu = false;
    }
  }

  toggleMobileMenu() {
    this.closeMobileMenu = !this.closeMobileMenu;
  }

  login() {
    location.assign("/sign-in");
  }

  logout() {
    this.userService.logout();
    this.isLoggedIn = false;
  }

  public checkDisplayDesktop(item) {
    if (
      item.fields.linkDisplay === "Both" ||
      item.fields.linkDisplay === "Desktop"
    ) {
      return true;
    }
  }

  // If clicking outside of the Mobile Menu Icon or Mobile Menu, toggle the mobile menu
  autoCloseMobileMenu(event) {
    const target = event.target;
    if (this.closeMobileMenu) {
      if (
        !target.closest("#mobileMenuIcon") &&
        !target.closest("#mobileMenu")
      ) {
        this.toggleMobileMenu();
      }
    }
  }
}
