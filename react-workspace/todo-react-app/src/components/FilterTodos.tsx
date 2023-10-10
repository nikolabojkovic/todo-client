import { Form, Stack } from "react-bootstrap";
import { useTodoList, useTodoListDispatch } from "../context/TodoListContext";
import { IAction } from "../models/Action";
import { IFilter } from "../models/IFilter";
import { todoServiceInstance } from "../services/TodoService";

export function FilterTodos() {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  function handleFilter(completed: boolean, uncompleted: boolean) {
    const filter = { 
      completed: completed,
      uncompleted: uncompleted
    } as IFilter;

    const filteredList = todoServiceInstance.filter(todoList.originalList, filter);
    const searchedList = todoServiceInstance.search(filteredList, todoList.search.searchTerm);

    dispatch({
      type: 'filtered',
      payload: {
        activePage: 1,
        list: searchedList,
        filter
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