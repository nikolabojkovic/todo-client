import { useEffect, useState } from "react";
import { useTodoList, useTodoListDispatch } from "../context/TodosContext";
import { SortIcon } from "./SortIcon";

export function SortButton({ column, text }: any) {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();
  const [direction, setDirection] = useState('asc');

  useEffect(() => {
    if (todoList.sort.column !== column) {
      setDirection('none');
    }
  }, [column, todoList.sort.column])

  return(
    <div className="App__sorting__item" onClick={() => { 
        const newDirectionState = direction !== 'asc' ? 'asc' : 'desc';
        setDirection(newDirectionState);
        dispatch({
          type: 'sorted',
          sort: {...{
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