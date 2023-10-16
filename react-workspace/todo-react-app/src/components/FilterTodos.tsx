import { Form, Stack } from "react-bootstrap";
import { first } from "rxjs";
import { useTodoList, useTodoListDispatch } from "../context/TodoListContext";
import { IAction } from "../models/Action";
import { IFilter } from "../models/IFilter";
import { IRange } from "../models/IPaging";
import { ITodo } from "../models/Todo";
import { todoServiceInstance } from "../services/TodoService";

export function FilterTodos() {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  function handleFilter(completed: boolean, uncompleted: boolean) {
    const filter = { 
      completed: completed,
      uncompleted: uncompleted
    } as IFilter;
    todoServiceInstance.getList(
      {} as IRange, 
      filter, 
      todoList.sort,
      todoList.search.searchTerm)
      .pipe(first())
      .subscribe((list: ITodo[]) => { 
        dispatch({
          type: 'filtered',
          payload: {
            activePage: 1,
            list: list,
            filter
          }
        } as IAction);
    });
  }

  return (
    <Form className="App__filter d-flex justify-content-start align-items-center">
      <Stack direction="horizontal" gap={3}>       
        <Form.Check 
          type="switch"
          id={`completed`}
          label={`Completed`}
          checked={todoList.filter.completed}
          onChange={(e) => {
            handleFilter(e.target.checked, todoList.filter.uncompleted);
          }}
        />   
        <Form.Check 
          type="switch"
          id={`uncompleted`}
          label={`Uncompleted`}
          checked={todoList.filter.uncompleted}
          onChange={(e) => {
            handleFilter(todoList.filter.completed, e.target.checked);
          }}
        />         
      </Stack>
    </Form>
  )
}