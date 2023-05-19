import { useEffect } from 'react'
import { AddTodo } from './AddTodo';
import { TodoItem } from './TodoItem';
import { Paging } from './Paging';
import { Search } from './Search';
import { useTodoList } from '../context/TodosContext';
import { Tabs } from './Tabs';
import { FilterTodos } from './FilterTodos';
import { Sorting } from './Sorting';
import { ImportExport } from './ImportExport';
import { ITodo } from '../models/Todo';

export function TodoList() {
  const todoList = useTodoList();

  // TODO: move save to context
  useEffect(() => {
    localStorage.setItem('todo-list', JSON.stringify(todoList.originalList));
  }, [todoList.originalList]);

  return (
    <main className="App__todo-list">
      <Tabs>
        <AddTodo key="add-todo" />
        <Search 
          key="search-todos" 
          placeholder='Search by title or description' 
        />
        <FilterTodos key="filter-todos" />
        <ImportExport key="import-export" />
      </Tabs>
      <Sorting/>
      {todoList.displayList
        .slice(todoList.paging.startIndex, todoList.paging.endIndex)
        .map((todo: ITodo) => <TodoItem key={todo.id} todo={todo} />)}
      <Paging/>
    </main>
  );
}