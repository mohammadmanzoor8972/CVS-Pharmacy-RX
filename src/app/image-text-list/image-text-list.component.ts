import {Component, OnInit, Input} from '@angular/core';

class View {
  entryField: string;
  text: string;
  image: any;

  get show() {
    return "tester";
  }

}
@Component({
  selector: 'image-text-list',
  template: `
<ng-container *ngIf="view">
 <img *ngIf="view?.image" [src]="getImage(view.image)">
 <h2 *ngIf="view?.text" class="font20px font-color-brandcolor20 fontAL iconText horizontal-spacing-left-3 heroTitleInfo" [innerHTML]="view.text"></h2>
 {{view.show}}
 </ng-container>

`,
  styleUrls: ['./image-text-list.component.css']
})
export class ImageTextList implements OnInit {

  @Input() view: View;

  constructor() {
  }

  ngOnInit() {
    console.log("VIEW ", this.view);
  }


  getImage(image: any) {
    return image.fields.file.url;
  }

}

