import { useEffect } from 'react'
import { TodoItem } from './TodoItem';
import { Paging } from './Paging';
import { todoService, useTodoList } from '../context/TodosContext';
import { ITodo } from '../models/Todo';

export function TodoList() {
  const todoList = useTodoList();

  useEffect(() => {
    todoService.saveTodoList(todoList.originalList);
  }, [todoList.originalList]);

  return (
    <main className="App__todo-list">
      {todoList.displayList
        .slice(todoList.paging.startIndex, todoList.paging.endIndex)
        .map((todo: ITodo) => <TodoItem key={todo.id} todo={todo} />)}
      <Paging rotate={false} />
    </main>
  );
}