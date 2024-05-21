import { useEffect, useState } from "react";

import { IAction, SortType, TodoActions } from "../../models";
import { useTodoList, useTodoListDispatch } from "../../context";
import { ISort, SortDirection } from "../../models";
import { SortButton } from './SortButton';

type Sort = {
  name: string,
  text: string,
  sortType: SortType
}

const sortByColumns: Sort[] = [
  {
    name: 'title',
    text: 'Title',
    sortType: SortType.direction
  } as Sort,
  {
    name: 'description',
    text: 'Description',
    sortType: SortType.direction
  } as Sort,
  {
    name: 'createdAt',
    text: 'Date',    
    sortType: SortType.direction
  } as Sort,
  {
    name: 'completed',
    text: 'Completed',
    sortType: SortType.direction
  } as Sort,
  {
    name: 'sortId',
    text: 'Manual order',
    sortType: SortType.noDirection
  } as Sort
];

export function Sorting() {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();
  const [activeColumn, setActiveColumn] = useState(todoList.sort.column);

  useEffect(() => {
    setActiveColumn(todoList.sort.column);
  }, [todoList.sort.column]);

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
    <section className="App__sorting d-flex flex-wrap">
        {
          sortByColumns.map((item: Sort) => (
            <SortButton 
              key={ item.name }
              column={ item.name }
              text={ item.text }
              sortType={ item.sortType }
              disabled={ todoList.isLoading }
              active = { activeColumn === item.name }
              sortDirection={ activeColumn === item.name ? SortDirection.Asc : SortDirection.None }
              onClick={handleSorting}
            />
          ))
        }
      </section>  
  );
}