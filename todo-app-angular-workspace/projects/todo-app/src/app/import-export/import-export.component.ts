import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ITodoList } from '../shared/models/ITodoList';
import { ITodo, Todo } from '../shared/models/todo';
import { selectTodos } from '../state/todos.selectors';
import { faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { TodosActions } from '../state/todos.actions';

@Component({
  selector: 'app-import-export',
  templateUrl: './import-export.component.html',
  styleUrls: ['./import-export.component.scss']
})
export class ImportExportComponent implements OnInit {

  @ViewChild("fileContainer") fileContainer!: ElementRef<HTMLInputElement>;

  items: ITodo[] = [];
  file: any = null;
  fileReader = new FileReader();

  exportDisabled: boolean = false;
  buttonStyle : any = { 
    backgroundColor: '#F5F6F7', 
    borderRadius: '20px', 
    minWidth: '90px'
  }
  faFileImport = faFileImport;
  faFileExport = faFileExport;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.select(selectTodos)
    .pipe()
    .subscribe((todoList: ITodoList) => { 
      this.items = todoList.originalList;
      this.exportDisabled = !this.items || this.items.length === 0;
    });

    this.fileReader.onload = (e: any) => {
      const text = e.target.result;
      const list = JSON.parse(text) as Todo[];

      if (!(list instanceof Array)) {
        alert("Invalid JSON file content. Todo list should be an array.");
        return;
      }

      const importedTodoList = list.map((item: any) => 
        new Todo(item.id, 
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
      this.store.dispatch(TodosActions.todosImported({ 
        action: {        
          activePage: 1,
          originalList: importedTodoList
        }
      }));
    };
  }

  onImport(): void {
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

  onChooseFile(e: any) {
    this.file = e.target.files[0];
  }
}
