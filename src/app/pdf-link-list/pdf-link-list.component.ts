import {Component, OnInit, Input} from '@angular/core';
import {CmsHelpers} from "../cms-helpers";

class View{

  pdfLinkText: string;
  pdfFile: any;

}

@Component({
  selector: 'app-pdf-link-list',
  template: ` 
     <a class="" [href]="getImage(view?.pdfFile)" target="_blank" [innerHTML]="view?.pdfLinkText"></a>
`,
  styleUrls: ['./pdf-link-list.component.scss']
})
export class PdfLinkListComponent extends CmsHelpers implements OnInit{

  @Input() view: View;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
