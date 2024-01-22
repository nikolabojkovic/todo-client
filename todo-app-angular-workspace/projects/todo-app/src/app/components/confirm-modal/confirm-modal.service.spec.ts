import { TestBed } from '@angular/core/testing';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { ConfirmModalComponent } from './confirm-modal.component';

import { ConfirmModalService } from "./confirm-modal.service";

describe("ConfirmModalService", () => {
  let service: ConfirmModalService;
  let bsModalService: BsModalService;
  let modalRef: BsModalRef<ConfirmModalComponent>;
  let subject = new Subject<boolean>();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BsModalService, ConfirmModalService]
    });
    service = TestBed.inject(ConfirmModalService);
    bsModalService = TestBed.inject(BsModalService);
    modalRef = jasmine.createSpyObj('BsModalRef', {}, { content: { text: '', result: subject }} as BsModalRef<ConfirmModalComponent>);
    spyOn(bsModalService, 'show').and.returnValue(modalRef);
  });

  describe('confirm', () => {
    it('confirm should set confirm content', () => {
      const confirmationText = 'Are you sure?';
      const dialogSize = 'modal-sm';
      const response = service.confirm(confirmationText, dialogSize);

      expect(bsModalService.show).toHaveBeenCalledOnceWith(ConfirmModalComponent, {class: `${dialogSize} modal-dialog-centered`, backdrop: 'static'});
      expect(modalRef.content?.text).toBe(confirmationText);
      expect(modalRef.content?.result).toBe(subject);
      expect(response).toBe(subject);
    });

  });
});
