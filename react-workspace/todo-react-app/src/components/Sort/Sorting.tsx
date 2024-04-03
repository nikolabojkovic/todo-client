import { useState } from "react";
import { IAction, TodoActions } from "../../models/Action";
import { useTodoList, useTodoListDispatch } from "../../context/TodoListContext";
import { SortButton } from './SortButton';
import { ISort, SortDirection } from "../../models/ISort";

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
    dispatch({
      type: TodoActions.sort,
      payload: {
        sort: {
          column: column, 
          direction: direction
        } as ISort
      }
    } as IAction);
  }

  return (
    <>
    {todoList.activeTab !== 'settings' &&
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
    }
    </>    
  );
}