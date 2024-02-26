import { useState } from "react";
import { first } from "rxjs";
import { IAction } from "../../models/Action";
import { ITodo } from "../../models/Todo";
import { getList, GetListProps } from "../../providers/TodoProvider";
import { useTodoList, useTodoListDispatch } from "../../context/TodoListContext";
import { SortButton } from './SortButton';
import { SortDirection } from "../../models/ISort";
import { localStorageProvider } from "../../providers/StorageProvider";

type Sort = {
  name: string,
  text: string
}

const sortByColumns: Sort[] = [
  {
    name: 'title',
    text: 'Title'
  } as Sort,
  {
    name: 'description',
    text: 'Description'
  } as Sort,
  {
    name: 'createdAt',
    text: 'Date'
  } as Sort,
  {
    name: 'completed',
    text: 'Completed'
  } as Sort
];

export function Sorting() {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();
  const [activeColumn, setActiveColumn] = useState(todoList.sort.column);

  function handleSorting(column: string, direction: SortDirection) {
    setActiveColumn(column);
    const sort = {
      column: column, 
      direction: direction
    }
    dispatch({
      type: 'loading-started'
    } as IAction);
    getList({
      provider: localStorageProvider,
      filter: todoList.filter, 
      sort,
      searchTerm: todoList.search.searchTerm
    } as GetListProps)
      .pipe(first())
      .subscribe((list: ITodo[]) => { 
        dispatch({
          type: 'sorted',
          payload: {
            sort,
            list: list
          }
        } as IAction);
    });
  }

  return (
    <section className="App__sorting d-flex flex-wrap">
      {
        sortByColumns.map((item: Sort) => (
          <SortButton 
            key={item.name}
            column={item.name}
            text={item.text}
            disabled={todoList.isLoading}
            sortDirection={activeColumn === item.name ? SortDirection.Asc : SortDirection.None}
            onClick={handleSorting}
          />
        ))
      }
    </section>
  );
}