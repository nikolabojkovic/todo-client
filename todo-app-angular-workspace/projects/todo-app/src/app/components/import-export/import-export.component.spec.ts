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

    it('should import from file', () => {
      const data = `[{"id":1,"title":"test","description":"des","completed":false,"createdAt":"2024-01-23T13:26:32.093Z"}]`;
      spyOn(confirmModalService, 'confirm').and.returnValue(of(true));
      spyOn(component.fileReader, 'readAsText').and.callThrough();
      let blobJson = new Blob([data], { type: 'application/json' });
      let mockFile = new File([blobJson], 'todo-list.json');
      component.file = mockFile;
      component.onImport();

      expect(component.fileReader.readAsText).toHaveBeenCalledWith(component.file);
    });


    it('should execute onload function and import list', () => {
      const todo = new Todo(1, "Task 1", "Description 1", false, new Date(2022, 1, 4));
      const data = [todo] as Todo[];
      const event = { target: { result: JSON.stringify(data)}} as ProgressEvent<FileReader>;
      component.onLoad(event);

      const action = TodoListActions.imported({
        activePage: 1,
        list: data
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
      expect(component.file).toBeNull();
      expect(component.fileContainer.nativeElement.value).toBe('');
    });

    it('should execute onload function and not import list because of invalid array', () => {
      const data = {};
      const event = { target: { result: JSON.stringify(data)}} as ProgressEvent<FileReader>;
      component.onLoad(event);

      const action = TodoListActions.imported({
        activePage: 1,
        list: [] as Todo[]
      });
      expect(store.dispatch).not.toHaveBeenCalledWith(action);
    });

    it('should execute onload function and not import list because of invalid todo item', () => {
      const todo = {test: 1, test2: 2};
      const data = [todo];
      const event = { target: { result: JSON.stringify(data)}} as ProgressEvent<FileReader>;
      component.onLoad(event);

      const action = TodoListActions.imported({
        activePage: 1,
        list: [] as Todo[]
      });
      expect(store.dispatch).not.toHaveBeenCalledWith(action);
    });
  });

  describe('export', () => {
    it('should import from file', () => {
      const todo = new Todo(1, "Task 1", "Description 1", false, new Date(2022, 1, 4));
      component.items = [todo] as Todo[]
      const expectedJsonContent = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(component.items)
      )}`;
      spyOn(component.downloadLink, 'click').and.callFake(() => {});

      const linkResult = component.onExport();

      expect(component.downloadLink.click).toHaveBeenCalled();
      expect(linkResult.download.startsWith('todo-list-')).toBeTrue();
      expect(linkResult.href).toBe(expectedJsonContent);
    });
  });

  describe('choose file', () => {
    it('should choose selected file', () => {
      const event = { target: { files: [{}]} as any} as any
      component.onChooseFile(event);

      expect(component.file).not.toBeNull();
    });
  });
})
