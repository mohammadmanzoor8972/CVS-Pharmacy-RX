import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../services/notification/notify.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from '../services/user.service';
// import { TimeOutService } from '../services/notification/timeOut.service';
import { NotifyEnum } from '../shared/enums/notify.enum';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalContentComponent } from '../modal-content/modal-content.component';

@Component({
  selector: 'app-timeout-modal',
  templateUrl: './timeout-modal.component.html',
  styleUrls: ['./timeout-modal.component.scss']
})
export class TimeoutModalComponent implements OnInit {
  bsModalRef: BsModalRef;

  constructor(private notifyService: NotifyService, private modalService: BsModalService,
    private userService: UserService) { }


    openModalWithComponent() {
      this.bsModalRef = this.modalService.show(ModalContentComponent);
      (<ModalContentComponent>this.bsModalRef.content).onClose.subscribe(result => {
        if (result) {
          this.closeModal();
          this.userService.reset();
        } else {
          this.logout();
        }
    });
    }

    closeModal() {
      // Hide only when we instance of bsModalRef
       if (this.bsModalRef) {
         this.bsModalRef.hide();
         this.bsModalRef = null;
       }
     }

     logout() {
       this.closeModal();
       this.userService.logout();
     }

  ngOnInit() {
    this.notifyService.setMessage.subscribe(data => {
      if (data === NotifyEnum.TIMEOUT) {
        // Checking if already bsModalRef has been open, if yes use the same
        // else create new one
        if (!this.bsModalRef) {
          this.openModalWithComponent();
        }
      }
      if (data === NotifyEnum.LOGOUT) {
        this.logout();
      }
    });

    this.userService.notifyLoginLogout.subscribe( data => {
      if (!data) {
        this.closeModal();
      }
    });
  }

}
