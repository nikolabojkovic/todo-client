import { useState } from "react";
import { Form, Stack } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import { useTodoList } from "../../context/TodoListContext";
import { IFilter, StateFilter } from "../../models/IFilter";

type Props = { 
  filter: IFilter,
  onFilter: Function
}

export function FilterTodos({ filter, onFilter: handleFilter }: Props) {
  const todoList = useTodoList();

  // const [completedSwitch, setCompletedSwitch] = useState(completed);
  // const [uncompletedSwitch, setetUncompletedSwitch] = useState(uncompleted);
  const [stateFilter, setStateFilter] = useState(filter.state);

  function handleStateFilter(filterValue: StateFilter) {
    setStateFilter(filterValue);
    handleFilter({ 
      state: filterValue
    } as IFilter);
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
              data-testid="selected-filter-option"
              variant="outline-secondary"
              className="action-button ps-2 pe-2"
              id="dropdown-basic"
              disabled={todoList.isLoading}
            >
              {' '}{stateFilter}{' '}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item data-testid="filter-option-all" onClick={() => handleStateFilter(StateFilter.all)}>All</Dropdown.Item>
              <Dropdown.Item data-testid="filter-option-completed" onClick={() => handleStateFilter(StateFilter.completed)}>Completed</Dropdown.Item>
              <Dropdown.Item data-testid="filter-option-uncompleted" onClick={() => handleStateFilter(StateFilter.uncompleted)}>Uncompleted</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
      </Stack>

    </Form>
  )
}