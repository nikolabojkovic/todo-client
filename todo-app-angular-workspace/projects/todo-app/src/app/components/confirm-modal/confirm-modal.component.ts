import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  result: Subject<boolean> = new Subject();
  modalRef!: BsModalRef;
  text: string = 'Are you sure?';
  constructor() {}

  confirm(): void {
    this.result.next(true);
    this.modalRef?.hide();
  }

  decline(): void {
    this.result.next(false);
    this.modalRef?.hide();
  }
}
