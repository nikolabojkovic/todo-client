import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';

import { ConfirmModalComponent } from './confirm-modal.component';

@Injectable()
export class ConfirmModalService {

  constructor(private modalService: BsModalService) { }

  public confirm(
    text: string,
    dialogSize: 'modal-sm'|'modal-lg' = 'modal-sm'): Observable<boolean> {
    const modalRef = this.modalService.show(ConfirmModalComponent, {class: `${dialogSize} modal-dialog-centered`, backdrop: 'static'});
    modalRef.content!.text = text;
    modalRef.content!.modalRef = modalRef;

    return modalRef.content!.result;
  }
}
