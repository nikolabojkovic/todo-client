import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, first } from 'rxjs';
import { faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { IState, selectTodos, TodoListActions } from '../../shared/state';
import { ITodo, Todo, Event } from '../../shared/models';
import { ConfirmModalService } from '../';
import { AlertService } from '../../shared/services';

@Component({
  standalone: true,
  imports: [FontAwesomeModule],
  selector: 'app-import-export',
  templateUrl: './import-export.component.html',
  styleUrls: ['./import-export.component.scss']
})
export class ImportExportComponent implements OnInit, OnDestroy {

  @ViewChild('fileContainer') fileContainer!: ElementRef<HTMLInputElement>;

  items: ITodo[] = [];
  file: File | null = null;
  fileReader = new FileReader();
  faFileImport = faFileImport;
  faFileExport = faFileExport;
  downloadLink: HTMLAnchorElement = document.createElement('a');
  private subscription!: Subscription;

  constructor(
    private store: Store<IState>,
    private modalService: ConfirmModalService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.subscription = this.store.select(selectTodos)
      .pipe()
      .subscribe((todoList: IState) => this.items = todoList.originalList);

    this.fileReader.onload = this.onLoad;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get ifExportDisabled() {
    return !this.items || this.items.length === 0;
  }

  onImport(): void {
    this.modalService.confirm('Existing data will be lost. Are you sure?', 'modal-sm')
      .pipe(first())
      .subscribe(this.onConfirm);
  }

  onConfirm = (confirmed: boolean) => {
    if (confirmed) {
      this.fileReader.readAsText(this.file!);
      this.file = null;
      this.fileContainer.nativeElement.value = '';
    }
  };

  onExport(): HTMLAnchorElement {
    const jsonContent = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(this.items)
    )}`;
    this.downloadLink.href = jsonContent;
    this.downloadLink.download = `todo-list-${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}.json`;
    this.downloadLink.click();

    return this.downloadLink;
  }

  onChooseFile(e: Event) {
    this.file = ((e.target) as HTMLInputElement).files![0];
  }

  // has to be arrow function because onLoad is invoked by fileReader and this.dispatch has to be bind to this component
  onLoad = (e: ProgressEvent<FileReader>) => {
    const text = e.target?.result;
    const list = JSON.parse(text as string) as Todo[];

    if (!(list instanceof Array)) {
      this.alertService.alert('Invalid JSON file content. Todo list should be an array.');

      return;
    }

    const importedTodoList = list.map((item: Todo) => new Todo(item.id,
                                                               item.title,
                                                               item.description,
                                                               item.completed,
                                                               item.createdAt,
                                                               item.sortId));

    if ((importedTodoList.length > 0
        && (!(importedTodoList[0] instanceof Todo)
         || !(Todo.validateFields(importedTodoList[0]))
            )
        )) {
      this.alertService.alert('Invalid JSON file content. Objects in array are not valid Todo objects.');

      return;
    }

    this.store.dispatch(TodoListActions.imported({
      activePage: 1,
      list: importedTodoList
    }));
  };
}
