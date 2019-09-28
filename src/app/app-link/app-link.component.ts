import { Component, OnInit, Input } from '@angular/core';
import {WindowRef} from "../services/WindowRef";

@Component({
  selector: 'app-link',
  templateUrl: './app-link.component.html',
  styleUrls: ['./app-link.component.css']
})
export class AppLinkComponent implements OnInit {
  @Input() target: string = null;
  @Input() url: string = null;
  @Input() content: string = null;
  @Input() linkClass: string = null;
  @Input() loggedIn: boolean;
  _visible: boolean;
  triggerModal: boolean;

  constructor(private _winRef: WindowRef) { }

  externalLinkClicked(event){

    this.triggerModal = true;
    event.preventDefault();

  }

  ngOnInit() {
    if (this.target) {
      switch (this.target) {
        case 'Same Page':
          this.target = '_self';
          break;
        case 'New Page':
          this.target = '_blank';
          break;
        default:
          this.target = null;
      }
    } else {
      if (this.url && this.url.match('^(https?|ftp|file)://')) {
        this.target = '_blank';
      }
    }
  }

  @Input('visible')
  set visible(linkVisibility: string) {

    if (!linkVisibility) {
      this._visible = false;
      return;
    }

    switch (linkVisibility) {
      case 'Public':
        this._visible = true;
        break;

      case 'Not Logged In':
        this._visible = !this.loggedIn;
        break;

      case 'Logged In':
        this._visible = this.loggedIn;
        break;
      default:
        this._visible = false;


    }

  }

  scrollToTop() {
    this._winRef.nativeWindow.scrollTo(0, 0);
  }

}
