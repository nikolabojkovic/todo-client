import { Button, Form, Stack } from 'react-bootstrap';
import { useTodoList, useTodoListDispatch } from '../../context/TodoListContext';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IAction, TodoActions } from '../../models/Action';

type Props = {
  placeholder: string,
  handleSearch: Function
};

export function Search({ placeholder, handleSearch }: Props) {
  const dispatch = useTodoListDispatch();
  const todoList = useTodoList();

  return (
    <Form className="todo-background p-1">
      <Stack direction="horizontal" gap={3}>
        <Form.Group className="me-auto m-2 w-100">
          <Form.Control 
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