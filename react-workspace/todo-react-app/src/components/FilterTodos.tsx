import { Form, Stack } from "react-bootstrap";
import { useTodoList, useTodoListDispatch } from "../context/TodosContext";
import { IAction } from "../models/Action";

export function FilterTodos() {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  function handleFilter(completed: boolean, uncompleted: boolean) {
    dispatch({
      type: 'filtered',
      payload: {
        activePage: 1,
        filter: { 
          completed: completed,
          uncompleted: uncompleted
        }
      }
    } as IAction);
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