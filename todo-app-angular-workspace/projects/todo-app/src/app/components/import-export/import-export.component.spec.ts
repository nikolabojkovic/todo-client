import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { BsModalService } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { Todo } from '../../shared/models/todo';
import { StorageProviderKey } from '../../shared/services/storage.provider';
import { IState } from '../../shared/state/state';
import { TodoListActions } from '../../shared/state/todo.actions';
import { TodoEffects } from '../../shared/state/todo.effects';
import { todosReducer } from '../../shared/state/todo.reducer';
import { MockLocalStorageProvider } from '../../tests/mocks/local-storage.provider.mock';
import { ConfirmModalService } from '../confirm-modal/confirm-modal.service';
import { ImportExportComponent } from "./import-export.component";

describe("ImportExportComponent", () => {
  let component: ImportExportComponent;
  let fixture: ComponentFixture<ImportExportComponent>;
  let confirmModalService: ConfirmModalService;
  let store: Store<IState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportExportComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        BsModalService,
        ConfirmModalService,
        {
          provide: StorageProviderKey,
          useClass: MockLocalStorageProvider
        }],
      imports:
      [
        StoreModule.forRoot({ todos: todosReducer }),
        EffectsModule.forRoot([TodoEffects])
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExportComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();

    confirmModalService = TestBed.inject(ConfirmModalService);
    spyOn(confirmModalService, 'confirm').and.returnValue(of(true));
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('import', () => {
    it('should not import from empty file', () => {
      component.file = null;
      component.onImport();

      const action = TodoListActions.imported({
        activePage: 1,
        list: [] as Todo[]
      });
      expect(store.dispatch).not.toHaveBeenCalledWith(action);
    });
  });

  describe('export', () => {
    it('should import from file', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('choose file', () => {
    it('should ...', () => {
      expect(component).toBeTruthy();
    });
  });
})
