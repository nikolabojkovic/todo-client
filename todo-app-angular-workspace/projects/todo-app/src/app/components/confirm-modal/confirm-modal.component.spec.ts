import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmModalComponent]
    });
    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    component.modalRef = 
      jasmine.createSpyObj('BsModalRef', { hide: () => {}}, { content: { text: '', result: new Subject<boolean>() }} as BsModalRef<ConfirmModalComponent>);
    fixture.detectChanges();
    spyOn(component.result, 'next');
  });

  it('confirm should confirm', () => {
    component.confirm();

    expect(component.result.next).toHaveBeenCalledOnceWith(true);
    expect(component.modalRef.hide).toHaveBeenCalled();
  });

  it('decline should decline', () => {
    component.decline();

    expect(component.result.next).toHaveBeenCalledOnceWith(false);
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
});
