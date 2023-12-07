import { useState } from "react";
import { Form, Stack } from "react-bootstrap";
import { first } from "rxjs";
import Dropdown from 'react-bootstrap/Dropdown';
import { useTodoList, useTodoListDispatch } from "../context/TodoListContext";
import { IAction } from "../models/Action";
import { IFilter, StateFilter } from "../models/IFilter";
import { ITodo } from "../models/Todo";
import { getList, GetListProps } from "../providers/TodoProvider";
import { localStorageProvider } from "../providers/StorageProvider";

type Props = { 
  filter: IFilter
}

export function FilterTodos({ filter }: Props) {
  const todoList = useTodoList();
  const dispatch = useTodoListDispatch();

  // const [completedSwitch, setCompletedSwitch] = useState(completed);
  // const [uncompletedSwitch, setetUncompletedSwitch] = useState(uncompleted);
  const [stateFilter, setStateFilter] = useState(filter.state);

  function handleStateFilter(filterValue: StateFilter) {
    setStateFilter(filterValue);
    dispatch({
      type: 'loading-started'
    } as IAction);
    const filter = { 
      state: filterValue
    } as IFilter;

    getList({
      provider: localStorageProvider,
      filter, 
      sort: todoList.sort,
      searchTerm: todoList.search.searchTerm
      } as GetListProps)
    .pipe(first())
    .subscribe((list: ITodo[]) => { 
      dispatch({
        type: 'filtered',
        payload: {
          activePage: 1,
          list: list,
          filter: { 
            state: filterValue
          } as IFilter
        }
      } as IAction);
    });
  }

  return (
    <Form className="App__filter d-flex justify-content-start align-items-center">
      <Stack direction="horizontal" gap={3}>       
        {/* <Form.Check 
          type="switch"
          id={`completed`}
          label={`Completed`}
          checked={completedSwitch}
          onChange={(e) => {
            setCompletedSwitch(e.target.checked);
            handleFilter(e.target.checked, uncompleted);
          }}
        />   
        <Form.Check 
          type="switch"
          id={`uncompleted`}
          label={`Uncompleted`}
          checked={uncompletedSwitch}
          onChange={(e) => {
            setetUncompletedSwitch(e.target.checked);
            handleFilter(completed, e.target.checked);
          }}
        /> */}
         <Dropdown>
            <Dropdown.Toggle
              variant="outline-secondary"
              className="action-button ps-2 pe-2"
              id="dropdown-basic"
              disabled={todoList.isLoading}
            >
              {' '}{stateFilter}{' '}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleStateFilter(StateFilter.all)}>All</Dropdown.Item>
              <Dropdown.Item onClick={() => handleStateFilter(StateFilter.completed)}>Completed</Dropdown.Item>
              <Dropdown.Item onClick={() => handleStateFilter(StateFilter.uncompleted)}>Uncompleted</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
      </Stack>

    </Form>
  )
}