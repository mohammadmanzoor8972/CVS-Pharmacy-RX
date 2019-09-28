import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss'],
  providers: [BsModalRef]
})
export class ModalContentComponent implements OnInit {
  title: string;
  closeBtnName: string;
  list: any[] = [];
  public onClose = new Subject<Boolean>();

  constructor(public bsModalRef: BsModalRef) { }

  onCancel(): void {
    this.onClose.next(false);
  }

  onContinue(): void {
    this.onClose.next(true);
  }

  ngOnInit() {
    this.list.push('PROFIT!!!');
  }

}
