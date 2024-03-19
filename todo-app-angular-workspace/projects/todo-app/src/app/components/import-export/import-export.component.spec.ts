import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { ConfirmModalService } from '../confirm-modal/confirm-modal.service';
import { ImportExportComponent } from './import-export.component';
import { By } from '@angular/platform-browser';
import { todos } from '../../tests/test-data';
import { AlertService } from '../../shared/services/alert.service';

describe('ImportExportComponent', () => {
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
          useValue: {
            getItem: () => of(JSON.stringify(todos)),
            setItem: () => of({})
          }
        },
        {
          provide: AlertService,
          useValue: {
            alert: () => {}
          }
        }
      ],
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

  describe('choose file', () => {
    it('should choose selected file', () => {
      const data = '[{"id":1,"title":"test","description":"des","completed":false,"createdAt":"2024-01-23T13:26:32.093Z"}]';
      const blobJson = new Blob([data], { type: 'application/json' });
      const mockFile = new File([blobJson], 'todo-list.json');
      const chooseFileEvent = { target: { files: [mockFile]} as unknown } as ProgressEvent<FileReader>;

      component.onChooseFile(chooseFileEvent);

      expect(component.file).toBe(mockFile);
    });
  });

  describe('import', () => {
    describe('fail', () => {
      it('should not import when invalid array', () => {
        const data = {};
        const event = { target: { result: JSON.stringify(data)}} as ProgressEvent<FileReader>;
        component.onLoad(event);

        const action = TodoListActions.imported({
          activePage: 1,
          list: [] as Todo[]
        });
        expect(store.dispatch).not.toHaveBeenCalledWith(action);
      });

      it('should not import when invalid todo item', () => {
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

      it('should not import when confirm declined', () => {
        const data = '[{"id":1,"title":"test","description":"des","completed":false,"createdAt":"2024-01-23T13:26:32.093Z"}]';
        spyOn(component.fileReader, 'readAsText').and.callThrough();
        const blobJson = new Blob([data], { type: 'application/json' });
        const mockFile = new File([blobJson], 'todo-list.json');

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(mockFile);

        const chooseFileInput = fixture.debugElement.query(By.css('#choose-file'));
        chooseFileInput.nativeElement.files = dataTransfer.files;

        component.file = mockFile;
        chooseFileInput.nativeElement.dispatchEvent(new InputEvent('change'));
        fixture.detectChanges();

        expect(component.fileContainer.nativeElement.value).not.toBe('');
        component.onConfirm(false);

        expect(component.fileReader.readAsText).not.toHaveBeenCalledWith(component.file);
        expect(component.file).toBe(mockFile);
        expect(component.fileContainer.nativeElement.value).not.toBe('');
      });
    });

    describe('success', () => {
      it('should trigger confirm modal', () => {
        const data = '[{"id":1,"title":"test","description":"des","completed":false,"createdAt":"2024-01-23T13:26:32.093Z"}]';
        spyOn(confirmModalService, 'confirm').and.returnValue(of(true));
        spyOn(component.fileReader, 'readAsText').and.callThrough();
        const blobJson = new Blob([data], { type: 'application/json' });
        const mockFile = new File([blobJson], 'todo-list.json');
        component.file = mockFile;
        component.onImport();

        expect(confirmModalService.confirm).toHaveBeenCalledWith('Existing data will be lost. Are you sure?', 'modal-sm');
      });

      it('should import from file on confirm success', () => {
        const data = '[{"id":1,"title":"test","description":"des","completed":false,"createdAt":"2024-01-23T13:26:32.093Z"}]';
        spyOn(component.fileReader, 'readAsText').and.callThrough();
        const blobJson = new Blob([data], { type: 'application/json' });
        const mockFile = new File([blobJson], 'todo-list.json');

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(mockFile);

        const chooseFileInput = fixture.debugElement.query(By.css('#choose-file'));
        chooseFileInput.nativeElement.files = dataTransfer.files;

        component.file = mockFile;
        chooseFileInput.nativeElement.dispatchEvent(new InputEvent('change'));
        fixture.detectChanges();

        expect(component.fileContainer.nativeElement.value).not.toBe('');
        component.onConfirm(true);

        expect(component.fileReader.readAsText).toHaveBeenCalledWith(mockFile);
        expect(component.file).toBeNull();
        expect(component.fileContainer.nativeElement.value).toBe('');
      });

      it('should import from file when onload invoked', () => {
        const todo = new Todo(1, 'Task 1', 'Description 1', false, new Date(2022, 1, 4));
        const data = [todo] as Todo[];
        const event = { target: { result: JSON.stringify(data)}} as ProgressEvent<FileReader>;
        component.onLoad(event);

        const action = TodoListActions.imported({
          activePage: 1,
          list: data
        });

        expect(store.dispatch).toHaveBeenCalledWith(action);
      });
    });
  });

  describe('export', () => {
    it('should succeed', () => {
      const todo = new Todo(1, 'Task 1', 'Description 1', false, new Date(2022, 1, 4));
      component.items = [todo] as Todo[];
      const expectedJsonContent = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(component.items)
      )}`;
      spyOn(component.downloadLink, 'click').and.callFake(() => {});

      const linkResult = component.onExport();

      expect(component.downloadLink.click).toHaveBeenCalled();
      expect(linkResult.download.startsWith('todo-list-')).toBeTrue();
      expect(linkResult.href).toBe(expectedJsonContent);
    });

    it('should fail', () => {
      component.items = [] as Todo[];
      spyOn(component.downloadLink, 'click').and.callFake(() => {});

      expect(component.ifExportDisabled).toBeTrue();
    });
  });
});
