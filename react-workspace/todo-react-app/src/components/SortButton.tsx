import { useEffect, useState } from "react";
import { useTodoList, useTodoListDispatch } from "../context/TodosContext";
import { SortIcon } from "./SortIcon";

export function SortButton({ column, text }: any) {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();
  const [direction, setDirection] = useState(todoList.sort.column === column ? todoList.sort.direction : 'none');

  useEffect(() => {     
    setDirection(todoList.sort.column === column ? todoList.sort.direction : 'none');
  }, [column, todoList.sort.column, todoList.sort.direction])

  return(
    <div className="App__sorting__item" onClick={() => { 
        const newDirectionState = direction !== 'asc' ? 'asc' : 'desc';
        setDirection(newDirectionState);
        dispatch({
          type: 'sorted',
          sort: {
            ...{
              column: column, 
              direction: newDirectionState
            }
          }
        })
      }}
    >
      <span>{text}</span> 
      <SortIcon sortDirection={direction}/>
    </div>
  )
}