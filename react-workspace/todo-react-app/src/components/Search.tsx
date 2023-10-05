import { Button, Form, Stack } from 'react-bootstrap';
import { useTodoList, useTodoListDispatch } from '../context/TodosContext';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  placeholder: string
};

export function Search({ placeholder }: Props) {
  const dispatch = useTodoListDispatch();
  const todoList = useTodoList();

  function handleSearch(searchTerm: string) {
    dispatch({
      type: 'searched',
      searchTerm,
      activePage: 1,
    });
  }

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
                dispatch({
                  type: 'searchTerm-updated',
                  searchTerm: e.target.value
                });
                if (e.target.value === '') {
                  handleSearch(e.target.value);
                }
              }}
          />
          {todoList.search.searchTerm !== '' && <FontAwesomeIcon 
            className="clear-icon" 
            icon={faCircleXmark}
            onClick={() => {
              dispatch({
                type: 'searchTerm-updated',
                searchTerm: ''
              });
              handleSearch('');
            }}
          />}
        </Form.Group>
        <Button 
          variant="warning"
          className="m-2"
          style={{ 
            backgroundColor: '#FE9801',
            color: 'white', 
            minWidth: '90px',
            borderRadius: '20px'
          }} 
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