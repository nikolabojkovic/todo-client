import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ITodoList } from '../../shared/models/todoList';
import { ITodo, Todo } from '../../shared/models/todo';
import { selectTodos } from '../../shared/state/todo.selectors';
import { faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { TodoListActions } from '../../shared/state/todo.actions';
import { Event } from '../../shared/models/event';

@Component({
  selector: 'app-import-export',
  templateUrl: './import-export.component.html',
  styleUrls: ['./import-export.component.scss']
})
export class ImportExportComponent implements OnInit {

  @ViewChild("fileContainer") fileContainer!: ElementRef<HTMLInputElement>;

  items: ITodo[] = [];
  file: File | null = null;
  fileReader = new FileReader();
  faFileImport = faFileImport;
  faFileExport = faFileExport;

  constructor(private store: Store<ITodoList>) { }

  ngOnInit(): void {
    this.store.select(selectTodos)
      .pipe()
      .subscribe((todoList: ITodoList) => this.items = todoList.originalList);

    this.fileReader.onload = this.onLoad;
  }

  onImport(): void {
    if (this.file === null)
      return;

    this.fileReader.readAsText(this.file);
  }

  onExport(): void {
    const link = document.createElement('a');
    const jsonContent = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(this.items)
    )}`;
    link.href = jsonContent;
    link.download = `todo-list-${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}.json`;
    link.click();
  }

  onChooseFile(e: Event) {
    this.file = ((e.target) as HTMLInputElement).files![0];
  }

  onLoad = (e: ProgressEvent<FileReader>) => {
    const text = e.target?.result;
    const list = JSON.parse(text as string) as Todo[];

    if (!(list instanceof Array)) {
      alert("Invalid JSON file content. Todo list should be an array.");
      return;
    }

    const importedTodoList = list.map((item: Todo) => new Todo(item.id, 
                                                               item.title, 
                                                               item.description, 
                                                               item.completed, 
                                                               item.createdAt));

    if ((importedTodoList.length > 0 
        && (!(importedTodoList[0] instanceof Todo) 
         || !(Todo.validateFields(importedTodoList[0]))
            )
        )) {
      alert("Invalid JSON file content. Objects in array are not valid Todo objects.");
      return;
    }
          
    this.file = null;
    this.fileContainer.nativeElement.value = '';
    this.store.dispatch(TodoListActions.imported({ 
      activePage: 1,
      list: importedTodoList
    }));
  };
}
