import { Button, Form, Stack } from 'react-bootstrap';
import { useTodoList, useTodoListDispatch } from '../../context/TodoListContext';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IAction, TodoActions } from '../../models/Action';

type Props = {
  placeholder: string
};

export function Search({ placeholder}: Props) {
  const dispatch = useTodoListDispatch();
  const todoList = useTodoList();

  function handleSearch(searchTerm: string) {
    dispatch({
      type: TodoActions.search,
      payload: {
        filter: todoList.filter, 
        sort: todoList.sort,
        searchTerm
      }
    } as IAction);
  }

  return (
    <Form className="todo-background p-1">
      <Stack direction="horizontal" gap={3}>
        <Form.Group className="me-auto m-2 w-100">
          <Form.Control
            data-testid="search-input"
            type="text" 
            placeholder={placeholder} 
            size="sm" 
            value={todoList.search.searchTerm}
            onChange={(e) => {
              const searchTerm = e.target.value;
              dispatch({
                type: TodoActions.searchTermUpdated,
                payload: {
                  searchTerm
                }
              } as IAction);
              if (searchTerm === '') {
                handleSearch(e.target.value);
              }
            }}
          />
          {todoList.search.searchTerm !== '' && <FontAwesomeIcon 
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
          />}
        </Form.Group>
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
      </Stack>
    </Form>
  );
}