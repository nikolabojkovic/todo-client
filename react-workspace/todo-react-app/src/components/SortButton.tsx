import { useEffect, useState } from "react";
import { useTodoList, useTodoListDispatch } from "../context/TodosContext";
import { IAction } from "../models/Action";
import { SortDirection } from "../models/ISort";
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
        dispatch({
          type: 'sorted',
          payload: {
            sort: {
              column: column, 
              direction: newDirectionState
            }
          }
        } as IAction)
      }}
    >
      <span>{text}</span> 
      <SortIcon sortDirection={direction}/>
    </div>
  )
}