import { Button, Form, Stack } from 'react-bootstrap';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useTodoList, useTodoListDispatch } from '../../context';
import { IAction, TodoActions } from '../../models';
import { useDebounce } from '../../hooks';

type Props = {
  placeholder: string
};

export function Search({ placeholder}: Props) {
  const dispatch = useTodoListDispatch();
  const todoList = useTodoList();
  const [, setSearchValue] = useDebounce(todoList.settings.search.debounceTime, '', handleSearch);

  function handleSearch(searchTerm: string) {
    dispatch({
      type: TodoActions.search,
      payload: {
        searchTerm
      }
    } as IAction);
  }

  return (
    <Form className="todo-background p-1">
      <Stack direction="horizontal" gap={2}>
        <Form.Group className="m-2 w-100 position-relative">
          <Form.Control
            data-testid="search-input"
            type="text" 
            placeholder={placeholder} 
            size="sm" 
            value={todoList.search.searchTerm}
            onChange={(e) => {
              if (todoList.settings.search.isSearchOnKeyPressEnabled) {
                setSearchValue(e.target.value);
              }

              const searchTerm = e.target.value;
              dispatch({
                type: TodoActions.searchTermUpdated,
                payload: {
                  searchTerm
                }
              } as IAction);
              if (searchTerm === '' && !todoList.settings.search.isSearchOnKeyPressEnabled) {
                handleSearch(e.target.value);
              }
            }}
          />
          {  todoList.search.searchTerm !== '' && 
            <FontAwesomeIcon 
              data-testid="clear-search"
              className="clear-icon"
              icon={faCircleXmark}
              onClick={() => {
                dispatch({
                  type: TodoActions.searchTermUpdated,
                  payload: {
                    searchTerm: ''
                  }
                } as IAction);
                handleSearch('');
              }}
            />
          }
        </Form.Group>
        { !todoList.settings.search.isSearchOnKeyPressEnabled &&
          <Button 
            data-testid="search-button"
            variant="outline-secondary"
            className="me-2 action-button"
            size="sm"
            disabled={!todoList.search.searchTerm || todoList.search.searchTerm.trim() === ''}
            onClick={() => {
              handleSearch(todoList.search.searchTerm);
            }}
          >
            Search
          </Button> 
        }
      </Stack>
    </Form>
  );
}