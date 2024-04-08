import { useState } from "react";
import { Form, Stack } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';

import { useTodoList, useTodoListDispatch } from "../../context";
import { IFilter, StateFilter, IAction, TodoActions } from "../../models";

type Props = { 
  filter: IFilter
}

export function FilterTodos({ filter }: Props) {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  const [stateFilter, setStateFilter] = useState(filter.state);

  function handleFilter(filterValue: StateFilter) {
    setStateFilter(filterValue);
    dispatch({
      type: TodoActions.filter,
      payload: {
        filter: { 
          state: filterValue
        } as IFilter
      }
    } as IAction);
  }

  return (
    <Form className="App__filter d-flex justify-content-start align-items-center">
      <Stack direction="horizontal" gap={3}>       
         <Dropdown>
            <Dropdown.Toggle
              data-testid="selected-filter-option"
              variant="outline-secondary"
              className="action-button ps-2 pe-2"
              id="dropdown-basic"
              disabled={todoList.isLoading}
            >
              {' '}{stateFilter}{' '}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item data-testid="filter-option-all" onClick={() => handleFilter(StateFilter.all)}>All</Dropdown.Item>
              <Dropdown.Item data-testid="filter-option-completed" onClick={() => handleFilter(StateFilter.completed)}>Completed</Dropdown.Item>
              <Dropdown.Item data-testid="filter-option-uncompleted" onClick={() => handleFilter(StateFilter.uncompleted)}>Uncompleted</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
      </Stack>

    </Form>
  );
}