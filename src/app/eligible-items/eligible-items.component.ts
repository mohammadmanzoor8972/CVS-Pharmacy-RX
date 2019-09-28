import { Component, OnInit } from '@angular/core';
import { CmsService } from '../services/cms.service';
import { NavbarService } from '../navbar/navbar.service';

class Cms {
    buttonLink: string;
    buttonText: string;
    eligibleList: any;
    header: string;
    subHeader: string;

}

@Component ({
    selector: 'app-eligible-items',
    templateUrl: './eligible-items.component.html',
    styleUrls: ['./eligible-items.component.scss']
})
export class EligibleItemsComponent implements OnInit {

    public view: Cms;

    constructor(cms: CmsService, private nav: NavbarService) {
        cms.getContent('pageEligibleItems', this.setView.bind(this));
    }

    ngOnInit () {
        this.nav.visible = true;
    }

    setView(content: any) {
        this.view = content.fields;
        console.log('ELIGIBLE ITEMS VIEW: -------', this.view);
    }

}
