import { Component, ContentChildren, QueryList, AfterContentInit, Input, ViewChildren, AfterViewChecked } from '@angular/core';
import {TabContentComponent} from "../tab-content/tab-content.component";

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['tabs.component.scss']
})
export class Tabs implements AfterViewChecked {

  @ContentChildren(TabContentComponent) tabs: QueryList<TabContentComponent>;

  ngAfterViewChecked() {
    let activeTabs = this.tabs.filter((tab)=>tab.active);

    if(activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: TabContentComponent){
    this.tabs.toArray().forEach(tab => tab.active = false);
    tab.active = true;
  }

}

