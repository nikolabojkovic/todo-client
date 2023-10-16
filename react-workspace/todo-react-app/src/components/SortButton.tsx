import { useEffect, useState } from "react";
import { first } from "rxjs";
import { useTodoList, useTodoListDispatch } from "../context/TodoListContext";
import { IAction } from "../models/Action";
import { IRange } from "../models/IPaging";
import { SortDirection } from "../models/ISort";
import { ITodo } from "../models/Todo";
import { todoServiceInstance } from "../services/TodoService";
import { SortIcon } from "./SortIcon";

type Props = {
  column: string,
  text: string
};

export function SortButton({ column, text }: Props) {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();
  const [direction, setDirection] = useState(todoList.sort.column === column ? todoList.sort.direction : SortDirection.None);

  useEffect(() => {     
    setDirection(todoList.sort.column === column ? todoList.sort.direction : SortDirection.None);
  }, [column, todoList.sort.column, todoList.sort.direction])

  return(
    <div className="App__sorting__item" onClick={() => { 
        const newDirectionState = direction !== SortDirection.Asc ? SortDirection.Asc : SortDirection.Desc;
        setDirection(newDirectionState);
        const sort = {
          column: column, 
          direction: newDirectionState
        }
        todoServiceInstance.getList(
          {} as IRange, 
          todoList.filter, 
          sort,
          todoList.search.searchTerm)
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
      }}
    >
      <span>{text}</span> 
      <SortIcon sortDirection={direction}/>
    </div>
  )
}