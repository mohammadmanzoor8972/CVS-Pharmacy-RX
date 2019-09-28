import { Component, OnInit, Input } from '@angular/core';
import { CmsHelpers } from "../cms-helpers";

class AccordionView {
  faqHeader: string;
  faqText: string;
  faqSubItems: any;
}

@Component({
  selector: 'app-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['accordion-item.component.scss']
})
export class AccordionItemComponent extends CmsHelpers implements OnInit {

  @Input() accordionView: AccordionView;
  @Input() itemPlusSign: any;
  @Input() itemMinusSign: any;
  @Input() subItemPlusSign: any;
  @Input() subItemMinusSign: any;
  @Input() isSubAccordionItem: boolean;
  @Input() isHelpPage: boolean;

  public isCollapsed = true;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  public toggleIsCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }
}
