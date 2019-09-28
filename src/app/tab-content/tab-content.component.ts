import {Component, OnInit, Input} from '@angular/core';

class View {
  tabLabel: string;
}

@Component({
  selector: 'app-tab-content',
  templateUrl: './tab-content.component.html',
  styleUrls: ['./tab-content.component.scss']
})
export class TabContentComponent implements OnInit {

  @Input() label: string;
  @Input() view: View;
  @Input() active = false;

  constructor(){
    console.log("TAB LABEL ", this.label);
  }

  ngOnInit(){}
}
